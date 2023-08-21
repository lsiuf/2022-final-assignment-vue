<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button @click="onInsert" size="small" icon="el-icon-check" type="success">新增</el-button>
        <el-button @click="onRefresh" size="small" icon="el-icon-search" type="primary">刷新</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="分类名" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="英文分类名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.enName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="onUpdate(scope.row)" size="small" icon="el-icon-edit" type="warning">修改</el-button>
          <el-button @click="onDelete(scope.row.id)" size="small" icon="el-icon-delete" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" v-loading="dialogLoading" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="分类名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="英文分类名" prop="enName">
          <el-input v-model="temp.enName" />
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
import { listCategory, insertCategory, updateCategory ,deleteCategory } from '@/api/category'

export default {
  data() {
    return {
      list: [],
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
        enName: ''
      },
      rules: {
        name: [{ required: true, message: '请输入分类名', trigger: 'change' }]
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listCategory().then(response => {
        console.log(response)
        this.list = response.data
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
    onRefresh() {
      this.fetchData()
    },
    onInsert() {
      this.temp = {
        id: 0,
        name: '',
        enName: ''
      }
      this.dialogStatus = 'insert'
      this.dialogFormVisible = true
    },
    onUpdate(row) {
      this.temp = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    onDelete(id) {
      this.listLoading = true
      deleteCategory(id).then(res => {
        this.$message({message: '操作成功',type:'success'})
        this.onRefresh()
      }).catch(err => {
        this.listLoading = false
      })
    },
    insertData(){
      this.$refs['dataForm'].validate(valid => {
        if(valid) {
          this.dialogLoading = true;
          insertCategory(this.temp).then(res =>{
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
          updateCategory(this.temp).then(res =>{
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
