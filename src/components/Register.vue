<template>
  <div id="bck">
    <div class="main">
      <div class="title"><h2>用户注册</h2></div>
      <div class="zhanghao">
        <el-input v-model="zhanghao" placeholder="请输入账号"></el-input>
      </div>
      <div class="yonghuming">
        <el-input v-model="yonghuming" placeholder="请输入用户名"></el-input>
      </div>
      <div class="mima">
        <el-input
          placeholder="请输入密码"
          v-model="mima1"
          show-password
        ></el-input>
      </div>
      <div class="mima">
        <el-input
          placeholder="确认密码"
          v-model="mima2"
          show-password
        ></el-input>
      </div>

      <div class="login">
        <el-button type="primary" @click="register">注册</el-button>
        <el-button type="info" @click="tologin">返回</el-button>
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
      mima1: "",
      mima2: "",
      yonghuming: "",
    };
  },
  components: {},
  created() {},
  methods: {
    tologin() {
      this.$router.push("/login");
    },
    register() {
      if (
        this.zhanghao === "" ||
        this.yonghuming === "" ||
        this.mima1 === "" ||
        this.mima2 === "" ||
        this.mima1 !== this.mima2
      ) {
        this.$notify.error({
          title: "失败",
          message: "注册失败，请检查您的输入",
        });
      } else {
        this.$axios({
          url: "/api/register",
          method: "post",
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
          data: qs.stringify({
            userName: this.yonghuming,
            userAccount: this.zhanghao,
            userPassword: this.mima1,
          }),
        })
          .then((res) => {
            console.log(res);
            let data = res.data;
            if (data.success == true) {
              this.$notify({
                title: "成功",
                message: "注册成功",
                type: "success",
              });
              this.$router.push("/login");
            } else {
              this.$notify.error({
                title: "错误",
                message: "该用户已被注册",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
#bck {
  background: url("../assets/bck.jpg");
  width: 100%; //大小设置为100%
  height: 100%; //大小设置为100%
  position: fixed;
  background-size: 100% 100%;
}

.main {
  height: 500px;
  width: 500px;
  margin: 115px auto;
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
.yonghuming {
  width: 350px;
  height: 50px;
  margin: 30px auto;
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
  display: flex;
  justify-content: space-between;
  width: 350px;
  height: 50px;
  margin: 15px auto;
}
/deep/ .el-button {
  width: 175px;
  font-size: 18px;
}
</style>