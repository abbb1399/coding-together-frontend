const axios = require('axios');

let timer

export default {
  async login(context, payload){
    return context.dispatch('auth',{
      ...payload,
      mode:'login'
    })
  },
  async signup(context, payload){
    return context.dispatch('auth',{
      ...payload,
      mode:'signup'
    })
  },
  async auth(context, payload){
    const mode = payload.mode
    let url = 'http://localhost:3000/users/login' 

    if(mode === 'signup'){
      url = 'http://localhost:3000/users'
    }

    return new Promise((resolve, reject) => {  
      axios.post(url, {
        name:'test',
        email: payload.email,   
        password: payload.password
      }).then((response) => {

        const expiresIn = 1000000
        // const expiresIn = +response.expiresIn * 1000
        const expirationDate = new Date().getTime() + expiresIn
        localStorage.setItem('tokenExpiration', expirationDate)


        timer = setTimeout(() => {
          context.dispatch('autoLogout')
        }, expiresIn)

        localStorage.setItem('token', response.data.token)
        localStorage.setItem('userId',response.data.user._id)
        
        context.commit('setUser',{
          token: response.data.token,
          userId: response.data.user._id
        })

        resolve()
      
      }).catch((error) => {
        reject(error.response.data)
      });
    })  
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
  }
}