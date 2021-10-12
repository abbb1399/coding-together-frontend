import { createRouter, createWebHistory } from 'vue-router'

import CoachesList from '../views/coaches/CoachesList.vue'
// import CoachDetail from '../views/coaches/CoachDetail.vue'
import CoachRegistration from '../views/coaches/CoachRegistration.vue'
import UserAuth from '../views/auth/UserAuth.vue'

const routes = [
  { path:'/', redirect: '/coaches' },
  { path: '/coaches', component: CoachesList },
  // {
  //   path:'/coachs:/id',
  //   component: () => import(CoachDetail),
  //   props:true,
  //   children:[
  //     { path: 'contact', component: ContactCoach}, 
  //   ]
  // },
  {path:'/register', component: CoachRegistration},
  {path: '/auth', component: UserAuth},
  {path:'/:notFound(.*)*', component: () => import('../views/NotFound.vue')}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
