const axios = require('axios');

let timer

export default {
  login(context, {email, password}){
    return context.dispatch('auth',{
      email,
      password,
      mode:'login'
    })
  },
  
  signup(context, payload){
    return context.dispatch('auth',{
      ...payload,
      mode:'signup'
    })
  },

  async auth(context, payload){
    const mode = payload.mode

    // 로그인 router
    let url = 'http://localhost:3000/users/login' 

    if(mode === 'signup'){
      // 회원가입 router
      url = 'http://localhost:3000/users'
    }

    try{
      const {data} = await axios.post(url, payload)
      
      // 로그인 유지 기간
      const expiresIn = 1000000
      const expirationDate = new Date().getTime() + expiresIn
      localStorage.setItem('tokenExpiration', expirationDate)

      timer = setTimeout(() => {
        context.dispatch('autoLogout')
      }, expiresIn)

      localStorage.setItem('token', data.token)
      localStorage.setItem('userId',data.user._id)
      
      context.commit('setUser',{
        token: data.token,
        userId: data.user._id,
        email: data.user.email
      })
    }catch(error){
      return Promise.reject(error.data)
    }        
  },
  
  tryLogin(context){
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const tokenExpiration = localStorage.getItem('tokenExpiration')

    const expiresIn = +tokenExpiration - new Date().getTime()
  
    if(expiresIn < 0){
      return 
    }

    timer = setTimeout(() => {
      context.dispatch('autoLogout')
    }, expiresIn)

    if(token && userId){
      context.commit('setUser',{
        token: token,
        userId: userId
      })
    }
  },
  
  async logout(context){
    const token = localStorage.getItem('token')

    try{
      await axios.post('http://localhost:3000/users/logoutAll',
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      )
      
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('tokenExpiration')
      
      clearTimeout(timer)
  
      context.commit('setUser',{
        token:null,
        userId:null
      })
      
    }catch(error){
      console.log(error)
    }
  },
  
  autoLogout(context){
    context.dispatch('logout')
    context.commit('setAutoLogout')
  },

  // 모든 유저 정보 가져오기
  async fetchAllUsersInfo(context,payload){
    try{
      const {data} = await axios.get(`http://localhost:3000/users/usersList`)
      
      
      const [matchedOwner]= data.filter((info) => info._id === payload)
    
      
      
      context.commit('setUsersInfo', matchedOwner)
    }catch(e){
      console.log(e)
    }
  }
}