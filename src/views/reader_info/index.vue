<template>
  <div class="app-container">
    <el-form label-width="130px" label-position="left" :loading="listLoading">
      <el-form-item label="卡号">
        <el-input v-model="readerInfo.number" style="width:300px" disabled></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="readerInfo.name" style="width:300px" disabled></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="readerInfo.phone" style="width:300px" disabled></el-input>
      </el-form-item>
      <el-form-item label="开卡时间">
        <el-input v-model="readerInfo.createTime" style="width:300px" disabled></el-input>
      </el-form-item>
      <el-form-item label="读者类别">
        <el-radio v-model="readerInfo.category" :label="0" disabled>游客</el-radio>
        <el-radio v-model="readerInfo.category" :label="1" disabled>学生</el-radio>
        <el-radio v-model="readerInfo.category" :label="2" disabled>教师</el-radio>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="readerInfo.sex" :label="1" disabled>男</el-radio>
        <el-radio v-model="readerInfo.sex" :label="2" disabled>女</el-radio>
      </el-form-item>
      <el-form-item label="操作">
        <el-button>修改密码</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>

import { getReader } from '@/api/reader'
import { parseTime } from '@/utils'

export default {
  data() {
    return {
      listLoading: false,
      readerInfo:{
        id: '',
        number: '',
        name: '',
        phone: '',
        sex: '1',
        category: '1',
        createTime: '',
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getReader().then(response => {
        this.readerInfo = response.data
        this.readerInfo.createTime = parseTime(new Date(response.data.createTime),'{y}-{m}-{d}')
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
  }
}
</script>
