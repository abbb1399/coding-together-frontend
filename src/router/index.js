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

import MyProfile from '../views/user/MyProfile.vue'
import MyList from '../views/user/MyList.vue'

const routes = [
  { path:'/', redirect: '/articles' },
  { path: '/articles', component: ArticleList },
  {
    path:'/articles/:owner',
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
      {path:'list', name:"MyList", component: MyList},
    ]
  },
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
    next('/articles')
  }else{
    next()
  }
})

export default router
