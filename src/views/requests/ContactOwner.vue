<template>
  <form class="form" @submit.prevent="submitForm">
    <div class="form__group">
      <label class="form__label"  for="email">당신의 이메일</label>
      <input class="form__input" type="email" id="email" v-model.trim="email">
    </div>
    <div class="form__group">
      <label class="form__label" for="message">메세지</label>
      <textarea class="form__textarea" id="message" rows="5" v-model.trim="message"></textarea>
    </div>
    <p class="form__errors" v-if="!formIsValid">유효한 이메일과 메세지란을 입력해주세요.</p>
    <div class="form__actions">
      <base-button>요청 보내기</base-button>
    </div>
  </form>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      requird:true
    }
  },
  data(){
    return{
      email:'',
      message:'',
      formIsValid:true
    }
  },
  computed:{
    // getUserEmail(){
    //   const userId = this.$store.getters.userId
    //   if(userId){
    //     const userInfoArray = this.$store.getters.getUsersInfo
    //     const {email} = userInfoArray.find(info => info._id === userId)
    //      return email
    //   }else{
    //     return ''
    //   }
    // }
  },
  created(){

  },
  methods:{
    submitForm(){
      this.formIsValid = true
      
      if(this.email === '' || !this.email.includes('@') || this.message === ''){
        this.formIsValid = false
        return
      }

      this.$store.dispatch('requests/contactCoach',{
        email: this.email,
        message: this.message,
        title:this.title,
        owner: this.$store.getters.getMyInfo._id,
      })
      this.$router.replace('/articles')
    }
  }
}
</script>

<style lang="scss" scoped>
  .form {
    margin: 1rem;
    border: 1px solid #ccc;
    border-radius: 12px;
    padding: 1rem;
 
    &__group{
      margin: 0.5rem 0;
    }

    &__label{
      font-weight: bold;
      margin-bottom: 0.5rem;
      display: block;
    }

    &__input,
    &__textarea{
      display: block;
      width: 100%;
      font: inherit;
      border: 1px solid #ccc;
      padding: 0.3rem;
      border-radius: 5px;

      &:focus{
        border-color: $primary-color;
        background-color: $primary-bg-color;
        outline: none;
      }
    }

    &__errors{
      font-weight: bold;
      color: red;
    }

    &__actions{
      margin-top: 1.2rem;
      text-align: center;

      *{
        font-size: 1rem;
        width: 11rem;
      }
    }
 }
</style>