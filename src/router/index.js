import { createRouter, createWebHistory } from 'vue-router'

import store from '../store/index.js'

// import CoachDetail from '../views/coaches/CoachDetail.vue'
import CoachesList from '../views/coaches/CoachesList.vue'
import CoachRegistration from '../views/coaches/CoachRegistration.vue'
// import ContactCoach from '../views/requests/ContactCoach.vue'
import RequestsReceived from '../views/requests/RequestsReceived.vue'
import UserAuth from '../views/auth/UserAuth.vue'
import UserInfo from '../views/auth/UserInfo.vue'
import Test from '../views/Test.vue'

const routes = [
  { path:'/', redirect: '/coaches' },
  { path: '/coaches', component: CoachesList },
  {
    path:'/coaches/:owner',
    component: () => import('../views/coaches/CoachDetail.vue'),
    props:true,
    // children:[
    //   { path: 'contact', component: ContactCoach}, 
    // ]
  },
  {path:'/register', component: CoachRegistration, meta:{ requiresAuth: true}},
  {path: '/requests', component: RequestsReceived, meta:{ requiresAuth: true}},
  {path: '/auth', component: UserAuth, meta:{ requiresUnauth: true}},
  {path: '/user-info', component:UserInfo, meta:{ requiresAuth: true}},


  {path:'/test', component: Test},
  {path:'/:notFound(.*)*', component: () => import('../views/NotFound.vue')}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 네비게이션 가드
router.beforeEach(function(to, _, next){
  // 인증이 안된경우 로그인페이지로 이동
  if(to.meta.requiresAuth && !store.getters.isAuthenticated){
    next('/auth')
  } else if(to.meta.requiresUnauth && store.getters.isAuthenticated){
    //로그인 했는데 auth페이지 또가는거 이상하니깐
    next('/coaches')
  }else{
    next()
  }
})

export default router
