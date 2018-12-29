<template>
  <div class="login-wrap">
    <!-- <div class="ms-title">后台管理系统</div> -->
    <div class="ms-login">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item prop="username">
          <el-input placeholder="username" v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" v-loading.fullscreen.lock="fullScreenLoading" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名(admin)和密码(laikang123)。</p>
      </el-form>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        username: "admin",
        password: "laikang123"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur"}
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur"}
        ]
      },
      fullScreenLoading: false
    };
  },
  methods: {
    submitForm(formData){
      console.log(this.$refs[formData])
      this.$refs[formData].validate((valid) => {
        console.log(valid)
        if(valid) {
          localStorage.setItem("loginInfo", JSON.stringify(this.ruleForm))
          this.$router.push('/home')
        } else {
          return false
        }
      })
    }
  }
};
</script>

<style lang = "less">
html,
body,
#app {
  width: 100%;
  height: 100%;
}
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 160px;
  /* margin: -150px 0 0 -190px; */
  transform: translate(-50%, -80%);
  padding: 40px;
  border-radius: 5px;
  background: #fff;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
}
</style>
