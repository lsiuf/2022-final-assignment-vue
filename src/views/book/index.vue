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
      <el-form-item label="状态">
        <el-select v-model="listParams.status" placeholder="请选择状态">
          <el-option :key="0" label="下架" :value="0"></el-option>
          <el-option :key="1" label="上架" :value="1"></el-option>
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
      <el-table-column label="简介" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.summary }}
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center">
        <template slot-scope="scope">
          {{ categoryFilter(scope.row.categoryId) }}
        </template>
      </el-table-column>
      <el-table-column label="ISBN编码" align="center">
        <template slot-scope="scope">
          {{ scope.row.isbnCode }}
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
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="入库时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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
        <el-form-item label="书名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="temp.author" />
        </el-form-item>
        <el-form-item label="简介" prop="summary">
          <el-input v-model="temp.summary" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="ISBN编码" prop="isbnCode">
          <el-input v-model="temp.isbnCode" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="temp.price" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="temp.stock" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="temp.categoryId" class="filter-item" placeholder="请选择书籍分类">
            <el-option v-for="item in categorys" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择书籍状态">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" />
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
import { listBook, insertBook, updateBook ,deleteBook } from '@/api/book'
import { listCategory } from '@/api/category'
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
        author: '',
        summary: '',
        categoryId: '',
        isbnCode: '',
        price: 0,
        stock: 0,
        status: 1,
        sort: 0
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
        name: [{ required: true, message: '请输入书名', trigger: 'change' }],
        author: [{ required: true, message: '请输入作者', trigger: 'change' }],
        summary: [{ required: true, message: '请输入简介', trigger: 'change' }],
        isbnCode: [{ required: true, message: '请输入ISBN编码', trigger: 'change' }],
        price: [{ required: true, message: '请输入单价', trigger: 'change' }],
        stock: [{ required: true, message: '请输入库存', trigger: 'change' }]
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
      console.log(this.listParams)
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
    onInsert() {
      this.temp = {
        id: 0,
        name: '',
        author: '',
        summary: '',
        categoryId: '',
        isbnCode: '',
        price: 0,
        stock: 0,
        status: 1,
        sort: 0
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
      deleteBook(id).then(res => {
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
          insertBook(this.temp).then(res =>{
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
          updateBook(this.temp).then(res =>{
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
