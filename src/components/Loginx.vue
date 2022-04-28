<template>
  <div id="bck">
    <div class="main">
      <div class="title"><h2>云端笔记</h2></div>
      <div class="zhanghao">
        <el-input v-model="zhanghao" placeholder="请输入账号"></el-input>
      </div>
      <div class="mima">
        <el-input
          placeholder="请输入密码"
          v-model="mima"
          show-password
        ></el-input>
      </div>
      <div class="toRegister">
        <span>没有账号？</span>
        <el-link type="primary" @click="toRegister">立即注册</el-link>
      </div>
      <div class="login">
        <el-button type="primary" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      zhanghao: "",
      mima: "",
      userToken: "",
    };
  },
  components: {},
  created() {},
  methods: {
    login() {
      this.$axios({
        url: "/api/login",
        method: "post",
        Headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify({
          userAccount: this.zhanghao,
          userPassword: this.mima,
        }),
      })
        .then((res) => {
          let data = res.data;
          if (data.success == true) {
            this.$message({
              title: "成功",
              message: "登录成功",
              type: "success",
            });
            this.userToken = data.token;
            localStorage.setItem("token", "Bearer " + this.userToken);
            this.$router.push("/Main");
          } else {
            this.$message.error({
              title: "错误",
              message: "登录失败",
            });
            localStorage.removeItem("token");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toRegister() {
      this.$router.push("/Register");
    },
  },
};
</script>

<style lang="less" scoped>
//全屏背景的使用方法
#bck {
  background: url("../assets/bck.jpg");
  width: 100%; //大小设置为100%
  height: 100%; //大小设置为100%
  position: fixed;
  background-size: 100% 100%;
}

.main {
  height: 370px;
  width: 500px;
  margin: 180px auto;
  background-color: rgb(241, 243, 244);
  text-align: center;
  border-radius: 15px;
  opacity: 0.9;
}
.title {
  height: 100px;
  line-height: 100px;
}
.zhanghao {
  width: 350px;
  height: 50px;
  margin: 0px auto;
}
.mima {
  width: 350px;
  height: 50px;
  margin: 30px auto;
}
/deep/ .el-input__inner {
  height: 50px;
  font-size: 20px;
}
.toRegister {
  width: 200px;
  height: 30px;
  margin-left: 47px;
  margin-top: -10px;
}
.login {
  width: 350px;
  height: 50px;
  margin: 15px auto;
}
/deep/ .el-button--primary {
  width: 350px;
  font-size: 18px;
}
</style>