import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/index.js'

import ArticleList from '../views/articles/ArticleList.vue'

const routes = [
  { path:'/', redirect: '/articles' },
  { path: '/articles', component: ArticleList },
  {
    path:'/articles/:id',
    component: () => import('../views/articles/ArticleDetail.vue'),
    props:true,
  },
  {path:'/register', component: () => import('../views/articles/ArticleRegistration.vue'), meta:{ requiresAuth: true}},
  {path: '/requests', component: () => import('../views/requests/RequestsReceived.vue'), meta:{ requiresAuth: true}},
  {path: '/auth', component:() => import('../views/auth/UserAuth.vue'), meta:{ requiresUnauth: true}},
  {
    path: '/mypage', 
    name:'myPage', 
    component:() => import('../views/user/MyPage.vue'), 
    meta:{ requiresAuth: true},
    children:[
      {path:'profile', name:"myProfile", component: ()=> import('../views/user/mypage/MyProfile.vue')},
      {path:'list', name:"myList", component: ()=> import('../views/user/mypage/MyList.vue')},
      {path:'list/:id', name:'myListDetail', component: () => import('../views/user/mypage/MyListDetail'), props:true,  meta:{ requiresAuth: true}}
    ]
  },
  {path:'/schedule', component: () => import('../views/schedule/Schedule.vue'), meta:{ requiresAuth: true, hideFooter:true}},
  {path:'/chat', name:"chatMain", component:()=> import('../views/chat/ChatMain.vue'), meta:{ requiresAuth: true}},
  {
    path:'/chat/:roomId', 
    name:"chatRoom",
    component: () => import('../views/chat/ChatRoom.vue'), 
    props:true,
    meta:{ requiresAuth: true, hideFooter: true}
  },
  {path:'/kanban', component:() => import('../views/kanban/Kanban.vue'), meta:{ requiresAuth: true,hideFooter: true} },
  {path:'/:notFound(.*)*', component: () => import('../views/NotFound.vue'), meta:{hideFooter:true}}
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
    next('/articles')
  }else{
    next()
  }
})

export default router
