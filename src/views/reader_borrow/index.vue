<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="读者卡号">
        <el-input v-model="listParams.readerNumber" style="width:200px" placeholder="请输入读者卡号"></el-input>
      </el-form-item>
      <el-form-item label="书名">
        <el-input v-model="listParams.bookName" style="width:200px" placeholder="请输入书名"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listParams.status" placeholder="请选择状态">
          <el-option :key="0" label="借阅中" :value="0"></el-option>
          <el-option :key="1" label="已归还" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="  ">
        <el-button @click="onReset" size="small" icon="el-icon-search" type="info">重置搜索</el-button>
        <el-button @click="onRefresh" size="small" icon="el-icon-search" type="primary">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
    >
      <el-table-column label="书名" width="200">
        <template slot-scope="scope">
          {{'《'+scope.row.bookName+'》'}}
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bookAuthor }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="读者姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.readerName }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="读者卡号" align="center">
        <template slot-scope="scope">
          {{ scope.row.readerNumber }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="联系方式" align="center">
        <template slot-scope="scope">
          {{ scope.row.readerPhone }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="读者类别" align="center">
        <template slot-scope="scope">
          {{ scope.row.readerCategory | readerCategoryFilter}}
        </template>
      </el-table-column> -->
      <el-table-column class-name="status-col" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="起止时间" align="center">
        <template slot-scope="scope">
          {{parseTime(scope.row.startTime)}} 至 {{parseTime(scope.row.endTime)}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" @click="bookReturn(scope.row.id)" size="small" type="primary">归还</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { listCategory } from '@/api/category'
import { bookReturnByReader, listByReader } from '@/api/borrow'
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
        0: '借阅中',
        1: '已归还'
      }
      return statusMap[status]
    },
    readerCategoryFilter(category){
      const categoryMap = {
        0: '游客',
        1: '学生',
        2: '教师',
      }
      return categoryMap[category]
    },
  },
  data() {
    return {
      list: [],
      listParams:{
        readerNumber: '',
        bookName: '',
        status: ''
      },
      listLoading: true,
      categorys:[]
    }
  },
  created() {
    this.listCategory()
    this.fetchData()
  },
  methods: {
    parseTime(time){
      return parseTime(new Date(time),'{y}-{m}-{d}')
    },
    fetchData() {
      this.listLoading = true
      listByReader().then(response => {
        this.list = response.data
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
    listCategory() {
      listCategory().then(res => {
        this.categorys = res.data
      })
    },
    categoryFilter(categoryId){
      let categorys = this.categorys
      if(categorys && categorys.length > 0){
        for(let i=0; i<categorys.length; i++){
          if(categorys[i].id == categoryId){
            return categorys[i].name
          }
        }
      }
      return '无'
    },
    onRefresh() {
      this.fetchData()
    },
    onReset(){
      this.listParams = {
        name: '',
        author: '',
        categoryId: '',
        status: ''
      }
      this.fetchData()
    },
    bookReturn(id){
      this.listLoading = true
      bookReturnByReader(id).then(res => {
        this.$message({message: '操作成功',type:'success'})
        this.onRefresh()
      })
    }
  }
}
</script>
