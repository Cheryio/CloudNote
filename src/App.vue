<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import axios from "axios";
import Loginx from "@/components/Loginx.vue";
import Main from "@/components/Main.vue";
import Register from "@/components/Register.vue";
import User from "@/components/User.vue";
export default {
  data() {
    return {};
  },
  components: { Loginx, Main, Register, User },
};
</script>

<style lang="less" scoped>
</style>
