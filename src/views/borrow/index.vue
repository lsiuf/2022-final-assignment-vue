<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="书名">
        <el-input v-model="listParams.name" style="width:200px" placeholder="请输入书名"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="listParams.author" style="width:200px" placeholder="请输入作者"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="listParams.categoryId" placeholder="请选择分类">
          <el-option v-for="item in categorys" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
          {{'《'+scope.row.name+'》'}}
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.summary }}
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center">
        <template slot-scope="scope">
          {{ scope.row.stock }}
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center">
        <template slot-scope="scope">
          {{ categoryFilter(scope.row.categoryId) }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上架时间" align="center">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="(scope.row.stock > 0 && scope.row.status == 1)" @click="onBorrow(scope.row)" size="small" type="primary">借阅</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="图书借阅" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" v-loading="dialogLoading" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="书名">
          <el-input v-model="temp.name" :disabled="true"/>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="temp.author" :disabled="true"/>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="temp.summary" type="textarea" :disabled="true"/>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="temp.stock" :disabled="true"/>
        </el-form-item>
        <el-form-item label="读者卡号" prop="readerNumber">
          <el-input v-model="temp.readerNumber" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="bookBorrow">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBook, } from '@/api/book'
import { listCategory } from '@/api/category'
import { bookBorrow } from '@/api/borrow'
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
        0: '下架',
        1: '上架'
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      list: [],
      listParams:{
        name: '',
        author: '',
        categoryId: '',
        status: ''
      },
      listLoading: true,
      dialogFormVisible: false,
      dialogLoading: false,
      temp: {
        id: 0,
        name: '',
        author: '',
        summary: '',
        stock: 0,
        readerNumber: ''
      },
      categorys:[],
      statusOptions:[{
        value: 0,
        label: '下架'
      },{
        value: 1,
        label: '上架'
      }],
      rules: {
        readerNumber: [{ required: true, message: '请输入读者卡号', trigger: 'change' }]
      },
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
      listBook(this.listParams).then(response => {
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
    onBorrow(row){
      this.dialogFormVisible = true
      this.temp.id = row.id
      this.temp.name = row.name
      this.temp.author = row.author
      this.temp.summary = row.summary
      this.temp.stock = row.stock
      this.temp.readerNumber = ''
    },
    bookBorrow(){
      this.$refs['dataForm'].validate(valid => {
        if(valid){
          let param = {
            bookId: this.temp.id,
            readerNumber: this.temp.readerNumber
          }
          this.dialogLoading = true
          bookBorrow(param).then(res => {
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
