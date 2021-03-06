import { createRouter, createWebHistory } from 'vue-router'

import store from '../store/index.js'

// import ArticleDetail from '../views/articles/ArticleDetail.vue'
import ArticleList from '../views/articles/ArticleList.vue'
import ArticleRegistration from '../views/articles/ArticleRegistration.vue'
// import ContactOwner from '../views/requests/ContactOwner.vue'
import RequestsReceived from '../views/requests/RequestsReceived.vue'
import UserAuth from '../views/auth/UserAuth.vue'
import MyPage from '../views/user/MyPage.vue'
import Test from '../views/Test.vue'

import MyProfile from '../views/user/mypage/MyProfile.vue'
import MyList from '../views/user/mypage/MyList.vue'
import MyListDetail from '../views/user/mypage/MyListDetail'

const routes = [
  { path:'/', redirect: '/articles' },
  { path: '/articles', component: ArticleList },
  {
    path:'/articles/:id',
    component: () => import('../views/articles/ArticleDetail.vue'),
    props:true,
    // children:[
    //   { path: 'contact', component: ContactOwner}, 
    // ]
  },
  {path:'/register', component: ArticleRegistration, meta:{ requiresAuth: true}},
  {path: '/requests', component: RequestsReceived, meta:{ requiresAuth: true}},
  {path: '/auth', component: UserAuth, meta:{ requiresUnauth: true}},
  {
    path: '/mypage', 
    name:'myPage', 
    component:MyPage, 
    meta:{ requiresAuth: true},
    children:[
      {path:'profile', name:"myProfile", component: MyProfile},
      {path:'list', name:"myList", component: MyList},
      {path:'list/:id', name:'myListDetail', component: MyListDetail, props:true,  meta:{ requiresAuth: true}}
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
  {path:'/test', component: Test},
  {path:'/:notFound(.*)*', component: () => import('../views/NotFound.vue'), meta:{hideFooter:true}}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// ??????????????? ??????
router.beforeEach(function(to, _, next){
  // ????????? ???????????? ????????????????????? ??????
  if(to.meta.requiresAuth && !store.getters.isAuthenticated){
    next('/auth')
  } else if(to.meta.requiresUnauth && store.getters.isAuthenticated){
    //????????? ????????? auth????????? ???????????? ???????????????
    next('/articles')
  }else{
    next()
  }
})

export default router
