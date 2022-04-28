<template>
  <div id="building" v-loading="loading">
    <div class="main">
      <h1>用户信息</h1>
      <div>账号：{{ userAccount }}</div>
      <div>用户名：{{ userName }}</div>
      <div>
        <el-button class="change" type="primary" round @click="changeUserName"
          >修改名称</el-button
        >
      </div>
      <div>
        <el-button class="change" type="warning" round @click="changePassword"
          >修改密码</el-button
        >
      </div>
      <div>
        <el-button class="change" round @click="back">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      loading: false,
      userName: "",
      userAccount: "",
      newname: "",
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    changePassword() {
      this.$prompt("请输入新的密码", "新的密码", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\s{0,}[\S]{1,}[\s\S]{0,}/,
        inputErrorMessage: "密码不能为空！",
      }).then(({ value }) => {
        this.$axios({
          url: "/api/user/changeUserPassword",
          method: "put",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: qs.stringify({
            changeUserPassword: value,
          }),
        })
          .then((res) => {
            let data = res.data;
            if (data.success == true) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              localStorage.removeItem("token");
              this.$router.push("/login");
            } else {
              this.$message.error({
                message: "修改失败",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    changeUserName() {
      this.$prompt("请输入新的用户名", "新的名称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\s{0,}[\S]{1,}[\s\S]{0,}/,
        inputErrorMessage: "用户名不能为空！",
      }).then(({ value }) => {
        this.$axios({
          url: "/api/user/changeUserName",
          method: "put",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: qs.stringify({
            changeUserName: value,
          }),
        })
          .then((res) => {
            let data = res.data;
            if (data.success == true) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.getUserInfo();
            } else {
              this.$message.error({
                message: "修改失败",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    getUserInfo() {
      this.loading = true;
      this.$axios({
        url: "/api/user/getUser",
        method: "get",
      })
        .then((res) => {
          let data = res.data;
          console.log(data);
          this.userName = data.userBean.userName;
          this.userAccount = data.userBean.userAccount;
          setTimeout(() => {
            this.loading = false;
          }, 400);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
       
<style lang="less" scoped>
#building {
  background: url("../assets/bck2.png");
  width: 100%; //大小设置为100%
  height: 100%; //大小设置为100%
  position: fixed;
  background-size: 100% 100%;
}

.main {
  opacity: 0.8;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background-color: rgb(222, 225, 225);
  margin: 0 auto;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
  border-radius: 20px;
}
.change {
  width: 120px;
  height: 40px;
}
</style>