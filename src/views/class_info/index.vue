<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="班级名称">
        <el-input v-model="listParams.className" style="width:200px" placeholder="请输入班级名称"></el-input>
      </el-form-item>
      <el-form-item label="班级编号">
        <el-input v-model="listParams.classNumber" style="width:200px" placeholder="请输入班级编号"></el-input>
      </el-form-item>
      <el-form-item label="专业名称">
        <el-input v-model="listParams.expertName" style="width:200px" placeholder="请输入专业名称"></el-input>
      </el-form-item>
      <el-form-item label="院系">
        <el-select v-model="listParams.facultyId" placeholder="请选择院系">
          <el-option v-for="item in facultys" :key="item.id" :label="item.facultyName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listParams.status" placeholder="请选择分类">
          <el-option :key="-1" label="弃用" :value="-1"></el-option>
          <el-option :key="0" label="未注册" :value="0"></el-option>
          <el-option :key="1" label="正常" :value="1"></el-option>
          <el-option :key="2" label="毕业" :value="2"></el-option>
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
      <el-table-column label="班级名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.className }}
        </template>
      </el-table-column>
      <el-table-column label="班级编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.classNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.expertName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="院系名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.facultyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="院系编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.facultyNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="onUpdate(scope.row)" size="small" icon="el-icon-edit" type="warning">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: right; margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listParams.pageNum"
        :page-sizes="[1, 10, 15, 20, 30]"
        :page-size="listParams.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="listTotal">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" v-loading="dialogLoading" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="班级名称" prop="className">
        <el-input v-model="temp.className" placeholder="请输入班级名称"></el-input>
        </el-form-item>
        <el-form-item label="班级编号" prop="classNumber">
          <el-input v-model="temp.classNumber" placeholder="请输入班级编号"></el-input>
        </el-form-item>
        <el-form-item label="专业名称" prop="expertName">
          <el-input v-model="temp.expertName" placeholder="请输入专业名称"></el-input>
        </el-form-item>
        <el-form-item label="专业名称" prop="expertName">
          <el-select v-model="temp.facultyId" placeholder="请选择院系">
            <el-option v-for="item in facultys" :key="item.id" :label="item.facultyName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="dialogStatus === 'update'">
          <el-select v-model="temp.status" placeholder="请选择分类">
            <el-option :key="-1" label="弃用" :value="-1"></el-option>
            <el-option :key="0" label="未注册" :value="0"></el-option>
            <el-option :key="1" label="正常" :value="1"></el-option>
            <el-option :key="2" label="毕业" :value="2"></el-option>
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
import { pageClassInfo, saveClassInfo, updateClassInfo  } from '@/api/classinfo'
import { parseTime } from '@/utils'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '-1': 'info',
        '0': 'warning',
        '1': '',
        '2': 'success'
      }
      return statusMap[status]
    },
    statusNameFilter(status){
      const statusMap = {
        '-1': '弃用',
        '0': '未注册',
        '1': '正常',
        '2': '毕业'
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      list: [],
      listParams: {
        'className': '',
        'classNumber': '',
        'expertName': '',
        'facultyId': '',
        'status': '',
        'pageNum': 1,
        'pageSize': 10,
      },
      listLoading: true,
      listTotal: 0,
      textMap: {
        update: '修改班级信息',
        insert: '新增班级信息'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      dialogLoading: false,
      temp: {
        id: 0,
        className: '',
        classNumber: '',
        expertName: '',
        facultyId: '',
        status: '',
      },
      rules: {
        className: [{ required: true, message: '请输入班级名称', trigger: 'change' }],
        classNumber: [{ required: true, message: '请输入班级编号', trigger: 'change' }],
        expertName: [{ required: true, message: '请输入专业名称', trigger: 'change' }],
      },
      facultys: [
        {
          id: 1,
          facultyName: '信息系'
        },
        {
          id: 2,
          facultyName: '金融系'
        },
        {
          id: 3,
          facultyName: '电子系'
        }
      ],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      pageClassInfo(this.listParams).then(res => {
        console.log(res)
        this.list = res.data.list
        this.listTotal = res.data.total
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
    onReset(){
      this.listParams = {
        'className': '',
        'classNumber': '',
        'expertName': '',
        'facultyId': '',
        'status': '',
      }
      this.fetchData()
    },
    onRefresh() {
      this.fetchData()
    },
    onInsert() {
      this.temp = {
        id: 0,
        className: '',
        classNumber: '',
        expertName: '',
        facultyId: '',
        status: ''
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
          saveClassInfo(this.temp).then(res =>{
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
          updateClassInfo(this.temp).then(res =>{
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
    handleSizeChange(size) {
      this.listParams.pageSize = size
      this.fetchData();
    },
    handleCurrentChange(num) {
      this.listParams.pageNum = num
      this.fetchData();
    },
    parseTime(time){
      return parseTime(new Date(time),'{y}-{m}-{d}')
    },
  }
}
</script>
