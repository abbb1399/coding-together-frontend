import { createStore } from 'vuex'

import authModule from './modules/auth/index.js'
import coachesModule from './modules/coaches/index.js'


const store =  createStore({
  modules: {
    coaches: coachesModule,
    auth: authModule
  }
})

export default store;