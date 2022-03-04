<template>
  <div>
    <!-- 에러 Dialog -->
    <base-dialog :show="!!error" title="에러 발생!" @close="handleError">
      <p>{{error}}</p>
    </base-dialog>

    <!-- 로딩 Dialog -->
    <base-dialog :show="isLoading" title="인증 중 입니다...." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    
    <!-- 입력 Form -->
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control" v-if="mode==='signup'">
          <label for="name">이름</label>
          <input type="text" id="name" v-model.trim="name" required v-focus>
        </div>
        
        <div class="form-control">
          <label for="email">이메일</label>
          <input type="email" id="email" v-model.trim="email" required v-focus>
        </div>
        
        <div class="form-control">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model.trim="password" autocomplete="off" required>
        </div>
        <p v-if="!formIsValid">유효한 이메일 과 비밀번호를 입력해주세요.(6글자) </p>
        
        <div class="button-container">
          <!-- 회원가입/로그인 -->
          <base-button>{{submitButtonCaption}}</base-button>
          <!-- 회원가입/로그인 하러가기-->
          <base-button type="button" mode="secondary" @click="switchAuthMode" style="margin-left:0.2rem;" >
            {{switchModeButtonCaption}}
          </base-button>
        </div>
      </form>
    </base-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      name:'',
      email:'',
      password:'',
      formIsValid: true,
      mode:'login',
      isLoading:false,
      error:null
    }
  },
  computed:{
    submitButtonCaption(){
      if(this.mode === 'login'){
        return '로그인'
      }else{
        return '회원가입'
      }
    },
     switchModeButtonCaption(){
      if(this.mode === 'login'){
        return '회원가입하러 가기'
      }else{
        return '로그인하러 가기'
      }
    }
  },
  methods:{
    async submitForm(){
      this.formIsValid = true
      if(this.email === '' || !this.email.includes('@') || this.password.length < 6){
        this.formIsValid = false
        return
      }

      this.isLoading = true
      
      const userInfo = {
        name: this.name,
        email: this.email,
        password: this.password
      }

      try{
        if(this.mode === 'login'){
        // 로그인
          await this.$store.dispatch('login', userInfo)
       }else{
        // 회원가입
          await this.$store.dispatch('signup', userInfo)
        }
        await this.$store.dispatch('fetchMyInfo')
        
        const redirectUrl = '/' + (this.$route.query.redirect || 'articles')
        this.$router.replace(redirectUrl)
      
      }catch(err){
        this.error = err || '인증실패, 다시 시도하세요.'
      }

      this.isLoading = false
    },
    switchAuthMode(){
      if(this.mode === 'login'){
        this.mode = 'signup'
      }else{
        this.mode = 'login'
      }
    },
    handleError(){
      this.error = null
    }

  }
}
</script>

<style lang="scss" scoped>
  form{
    margin: 1rem;
    padding: 1rem;
  }
  
  .form-control{
    margin: 0.5rem 0 1rem 0;
  }
  
  label{
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
  }

  input{
    display: block;
    width: 100%;

    font: inherit;
    border: 1px solid #ccc;
    padding: 0.3125rem;
    border-radius: 5px;
  
    &:focus{
      border-color: $primary-color;
      background-color: $primary-bg-color;
      outline: none;   
    }
  }

  .button-container{
    text-align: right;
    margin-top: 2.5rem;
  }
</style>