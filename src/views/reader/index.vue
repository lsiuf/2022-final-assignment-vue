<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="读者卡号">
        <el-input v-model="listParams.number" style="width:200px" placeholder="请输入读者卡号"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="listParams.name" style="width:200px" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="listParams.phone" style="width:200px" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="listParams.sex" placeholder="请选择状态">
          <el-option :key="1" label="男" :value="1"></el-option>
          <el-option :key="2" label="女" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类别">
        <el-select v-model="listParams.category" placeholder="请选择分类">
          <el-option :key="0" label="游客" :value="0"></el-option>
          <el-option :key="1" label="学生" :value="1"></el-option>
          <el-option :key="2" label="教师" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listParams.status" placeholder="请选择状态">
          <el-option :key="0" label="禁用" :value="0"></el-option>
          <el-option :key="1" label="可用" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="  ">
        <el-button @click="onInsert" size="small" icon="el-icon-check" type="success">新增</el-button>
        <el-button @click="onReset" size="small" icon="el-icon-search" type="info">重置搜索</el-button>
        <el-button @click="onRefresh" size="small" icon="el-icon-search" type="primary">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="读者卡号" align="center">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          {{ scope.row.sex | sexFilter }}
        </template>
      </el-table-column>
      <el-table-column label="类别" align="center">
        <template slot-scope="scope">
          {{ scope.row.category | categoryFilter }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="建卡时间" align="center" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="onUpdate(scope.row)" size="small" icon="el-icon-edit" type="warning">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" v-loading="dialogLoading" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="读者卡号" prop="number">
          <el-input v-model="temp.number" placeholder="请输入读者卡号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="temp.phone" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="temp.sex " class="filter-item" placeholder="请选择性别">
            <el-option :key="1" label="男" :value="1"></el-option>
            <el-option :key="2" label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-select v-model="temp.category" class="filter-item" placeholder="请选择读者类别">
            <el-option :key="0" label="游客" :value="0"></el-option>
            <el-option :key="1" label="学生" :value="1"></el-option>
            <el-option :key="2" label="教师" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择状态">
            <el-option :key="0" label="禁用" :value="0"></el-option>
            <el-option :key="1" label="可用" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='insert'?insertData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listReader, insertReader, updateReader ,deleteReader } from '@/api/reader'
import { parseTime } from '@/utils'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'error',
        1: 'success'
      }
      return statusMap[status]
    },
    statusNameFilter(status){
      const statusMap = {
        0: '禁用',
        1: '可用'
      }
      return statusMap[status]
    },
    categoryFilter(category){
      const categoryMap = {
        0: '游客',
        1: '学生',
        2: '教师'
      }
      return categoryMap[category]
    },
    sexFilter(sex){
      const sexMap = {
        1: '男',
        2: '女'
      }
      return sexMap[sex]
    },
  },
  data() {
    return {
      list: [],
      listParams:{
        name: '',
        number: '',
        phone: '',
        sex: '',
        category: '',
        status: ''
      },
      listLoading: true,
      textMap: {
        update: '修改',
        insert: '新增'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      dialogLoading: false,
      temp: {
        id: 0,
        name: '',
        number: '',
        phone: '',
        sex: '',
        category: '',
        status: 1,
      },
      rules: {
        number: [{ required: true, message: '请输入读者卡号', trigger: 'change' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        phone: [{ required: true, message: '请输入手机', trigger: 'change' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        category: [{ required: true, message: '请选择读者类别', trigger: 'change' }]
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    parseTime(time){
      return parseTime(new Date(time),'{y}-{m}-{d}')
    },
    fetchData() {
      this.listLoading = true
      listReader(this.listParams).then(response => {
        this.list = response.data
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
    onRefresh() {
      this.fetchData()
    },
    onReset(){
      this.listParams = {
        name: '',
        number: '',
        phone: '',
        sex: '',
        category: '',
        status: ''
      }
      this.fetchData()
    },
    onInsert() {
      this.temp = {
        id: 0,
        name: '',
        number: '',
        phone: '',
        sex: '',
        category: '',
        status: 1,
      }
      this.dialogStatus = 'insert'
      this.dialogFormVisible = true
    },
    onUpdate(row) {
      this.temp = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    insertData(){
      this.$refs['dataForm'].validate(valid => {
        if(valid) {
          this.dialogLoading = true;
          insertReader(this.temp).then(res =>{
            this.$message({message: '操作成功',type:'success'})
            this.onRefresh()
            this.dialogFormVisible = false
            this.dialogLoading = false
          }).catch(err => {
            this.dialogLoading = false
          });
        }
      })
    },
    updateData(){
      this.$refs['dataForm'].validate(valid => {
        if(valid) {
          this.dialogLoading = true;
          updateReader(this.temp).then(res =>{
            this.$message({message: '操作成功',type:'success'})
            this.onRefresh()
            this.dialogFormVisible = false
            this.dialogLoading = false
          }).catch(err => {
            this.dialogLoading = false
          });
        }
      })
    }
  }
}
</script>
