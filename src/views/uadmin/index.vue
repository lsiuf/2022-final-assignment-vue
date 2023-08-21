<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="用户名">
        <el-input v-model="listParams.username" style="width:200px" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="等级">
        <el-select v-model="listParams.level" placeholder="请选择等级">
          <el-option :key="0" label="超级管理员" :value="0"></el-option>
          <el-option :key="1" label="普通管理员" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listParams.status" placeholder="请选择状态">
          <el-option :key="0" label="禁用" :value="0"></el-option>
          <el-option :key="1" label="可用" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="info" @click="onReset">重置搜索</el-button>
        <el-button size="small" icon="el-icon-search" type="primary" @click="onRefresh">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="等级" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.level | levelFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <template v-if="(scope.row.level!=0)">
            <el-button v-if="(scope.row.status==1)" @click="updateStatus(scope.row.id, 0)" size="small" type="warning">禁用</el-button>
            <el-button v-if="(scope.row.status==0)" @click="updateStatus(scope.row.id, 1)" size="small" type="success">恢复可用</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { listUadmin, updateStatus } from '@/api/uadmin'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '禁用',
        1: '可用'
      }
      return statusMap[status]
    },
    levelFilter(level){
      const levelMap = {
        0: '超级管理员',
        1: '普通管理员'
      }
      return levelMap[level]
    }
  },
  data() {
    return {
      list: [],
      listParams: {
        username: '',
        level: '',
        status: ''
      },
      listLoading: true,
      textMap: {
        update: '修改'
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listUadmin(this.listParams).then(response => {
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
        username: '',
        level: '',
        status: ''
      }
      this.fetchData()
    },
    updateStatus(id,status) {
      this.listLoading = true
      updateStatus(id, status).then(res => { 
        this.$message({message: '操作成功',type:'success'})
        this.onRefresh()
      }).catch(err => {
        this.listLoading = false
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
          })
        }
      })
    }
  }
}
</script>
