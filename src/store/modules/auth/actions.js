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

  // 회원가입 and 로그인
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
      const expiresIn = 10000000
      const expirationDate = new Date().getTime() + expiresIn
      localStorage.setItem('tokenExpiration', expirationDate)

      timer = setTimeout(() => {
        context.dispatch('autoLogout')
      }, expiresIn)
  
      const myInfo = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatar,
        createdAt: data.user.createdAt
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('myInfo', JSON.stringify(myInfo))
      
      context.commit('setUser',{
        token: data.token,
        myInfo
      })
    }catch(error){
      throw new Error('유효한 아이디/비밀번호를 입력해주세요.')
    }        
  },
  
  async tryLogin(context){
    const token = localStorage.getItem('token')
    const myInfo = JSON.parse(localStorage.getItem('myInfo'))
    const tokenExpiration = localStorage.getItem('tokenExpiration')

    const expiresIn = +tokenExpiration - new Date().getTime()
  
    if(expiresIn < 0){
      return 
    }

    timer = setTimeout(() => {
      context.dispatch('autoLogout')
    }, expiresIn)

    if(token && myInfo.id){
      context.commit('setUser',{
        token: token,
        myInfo
      })
    }
  },
  
  // 로그아웃
  async logout(context){
    const token = localStorage.getItem('token')

    try{
      await axios.post('http://localhost:3000/users/logoutAll',
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      )
      
      localStorage.removeItem('token')
      localStorage.removeItem('myInfo')
      localStorage.removeItem('tokenExpiration')
      
      clearTimeout(timer)
  
      context.commit('setUser',{
        token:null,
        myInfo:{
          id:'',
          name:'',
          email:'',
          avatar:'',
          createdAt:null
        },
      })
      
    }catch(error){
      console.log(error)
    }
  },
  
  autoLogout(context){
    context.dispatch('logout')
    context.commit('setAutoLogout')
  },

  // 내 정보 보기
  // async fetchMyInfo(context){
  //   const token = localStorage.getItem('token')
  //   try{
  //     const {data} = await axios.get(`http://localhost:3000/users/me`,
  //       { headers: { Authorization: `Bearer ${token}` }}
  //     )

  //     context.commit('setMyInfo',data)
  //   }catch(e){
  //     console.log(e)
  //   }
  // },

  // 회원탈퇴하기
  async deleteAccount(){
    const token = localStorage.getItem('token')
    try{
      await axios.delete('http://localhost:3000/users/me',
       { headers: { Authorization: `Bearer ${token}` }}
      )
    }catch(e){
      console.log(e)
    }
  },
  // 아바타 업로드하기
  async uploadAvatar(_, file){
    const token = localStorage.getItem('token')

    try{
      await axios.post(
        'http://localhost:3000/avatar', 
        file, 
        { headers: { Authorization: `Bearer ${token}` }}
      )

    }catch(e){
      console.log(e)
    }
  }
}