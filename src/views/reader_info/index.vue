<template>
  <div class="app-container">
    <el-form label-width="130px" label-position="left" v-loading="listLoading">
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
        <el-button @click="dialogFormVisible = true">修改密码</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" v-loading="dialogLoading" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="temp.oldPassword" placeholder="请输入旧密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="temp.newPassword" placeholder="请输入新密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input v-model="temp.checkPassword" placeholder="请再次输入新密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updatePassword()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { getReader, updatePassword } from '@/api/reader'
import { parseTime } from '@/utils'

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.temp.checkPassword !== '') {
          this.$refs['dataForm'].validateField('checkPassword');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.temp.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
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
      temp: {
        oldPassword: '',
        newPassword: '',
        checkPassword: ''
      },
      dialogFormVisible: false,
      dialogLoading: false,
      rules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'change' }],
        newPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
        checkPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
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
    updatePassword() {
      this.$refs['dataForm'].validate(valid => {
        if(valid) {
          this.dialogLoading = true
          updatePassword(this.temp).then(res => {
            this.$message({message: '操作成功',type:'success'})
            this.dialogLoading = false
            this.dialogFormVisible = false
          }).catch(err => {
            this.dialogLoading = false
          })
        }
      })
    }
  }
}
</script>