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
      <el-table-column label="封面">
        <template slot-scope="scope">
            <el-image 
              style="width: 65px;"
              :src="getBookImg(scope.row.img)" 
              :preview-src-list="[getBookImg(scope.row.img)]">
            </el-image>
        </template>
      </el-table-column>
      <el-table-column label="书名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="简介" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.summary }}
        </template>
      </el-table-column> -->
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
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="onInfo(scope.row)" size="small" type="primary">详情</el-button>
          <el-button v-if="(scope.row.stock > 0 && scope.row.status == 1)" @click="onBorrow(scope.row)" size="small" type="success">借阅</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogType === 'borrow' ? '图书借阅信息确认' : '图书信息'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" v-loading="dialogLoading" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="封面" prop="img">
            <img :src="getBookImg(temp.img)" class="avatar">
        </el-form-item>
        <el-form-item label="书名">
          <el-input v-model="temp.name" :disabled="true"/>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="temp.author" :disabled="true"/>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="temp.summary" type="textarea" :disabled="true"/>
        </el-form-item>
        <el-form-item label="出版社" prop="publishing">
          <el-input v-model="temp.publishing" :disabled="true"/>
        </el-form-item>
        <el-form-item label="ISBN编码" prop="isbnCode">
          <el-input v-model="temp.isbnCode" :disabled="true"/>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="temp.price" :disabled="true"/>
        </el-form-item>
        <el-form-item label="库存" :disabled="true">
          <el-input v-model="temp.stock" :disabled="true"/>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="temp.categoryId" class="filter-item" placeholder="请选择书籍分类" :disabled="true">
            <el-option v-for="item in categorys" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="借出日期" v-if="dialogType === 'borrow'">
          <el-input v-model="temp.startTime" :disabled="true"/>
        </el-form-item>
        <el-form-item label="预估归还日期" v-if="dialogType == 'borrow'">
          <el-input v-model="temp.endTime" :disabled="true"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="bookBorrow"  v-if="dialogType == 'borrow'">
          确认
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
import { getBorrowPeriod } from '@/api/configinfo'
import { bookImgUrl } from '@/api/upload'

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
      dialogType: 'info',
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
        readerNumber: '',
        startTime: '',
        endTime: '',
        img: '',
        publishing: '',
        categoryId: '',
        isbnCode: '',
        price: 0,
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
        let categorys = this.categorys
        for(let i=0; i<categorys.length; i++){
          categorys[i].id = Number(categorys[i].id)
        }
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
      this.dialogType = 'borrow'
      this.dialogFormVisible = true
      this.temp.id = row.id
      this.temp.name = row.name
      this.temp.author = row.author
      this.temp.summary = row.summary
      this.temp.publishing = row.publishing
      this.temp.img = row.img
      this.temp.stock = row.stock
      this.temp.categoryId = row.categoryId
      this.temp.price = row.price
      this.temp.isbnCode = row.isbnCode
      this.temp.startTime = ''
      this.temp.endTime = ''
      this.getBorrowPeriod();
    },
    onInfo(row) {
      this.dialogType = 'info'
      this.dialogFormVisible = true
      this.temp.id = row.id
      this.temp.name = row.name
      this.temp.author = row.author
      this.temp.summary = row.summary
      this.temp.publishing = row.publishing
      this.temp.img = row.img
      this.temp.stock = row.stock
      this.temp.categoryId = row.categoryId
      this.temp.price = row.price
      this.temp.isbnCode = row.isbnCode
      this.temp.startTime = ''
      this.temp.endTime = ''
    },
    bookBorrow(){
      this.$refs['dataForm'].validate(valid => {
        if(valid){
          let param = {
            bookId: this.temp.id
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
    },
    getBorrowPeriod(){
      getBorrowPeriod().then(res => {
        this.temp.startTime = this.parseTime(res.data.startTime)
        this.temp.endTime = this.parseTime(res.data.endTime)
      })
    },
    getBookImg(img) {
      return bookImgUrl + img
    }
  }
}
</script>

<style>
  .avatar {
    width: 178px;
    display: block;
  }
</style>