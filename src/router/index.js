import Vue from 'vue'
import VueRouter from 'vue-router'
import Loginx from '@/components/Loginx.vue'
import Register from '@/components/Register.vue'
import Main from '@/components/Main.vue'
import User from "@/components/User.vue";

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Loginx },
    { path: '/Register', component: Register },
    { path: '/Main', component: Main },
    { path: '/User', component: User },
  ]
})

router.beforeEach((to, from, next) => {

  if (to.path == '/login' || to.path == '/Register') {
    next();
  } else {
    const isLogin = localStorage.getItem("token");
    // 是否在登录状态下
    if (isLogin)
      next();
    else {
      alert('请先登录');
      next('login');
    }


  }
});

export default router