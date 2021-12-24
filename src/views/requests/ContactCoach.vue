<template>
  <form @submit.prevent="submitForm">
    <div class="form-control">
      <label for="email">당신의 이메일</label>
      <input type="email" id="email" v-model.trim="email" v-focus>
    </div>
    <div class="form-control">
      <label for="message">메세지</label>
      <textarea id="message" rows="5" v-model.trim="message"></textarea>
    </div>
    <p class="errors" v-if="!formIsValid">유효한 이메일과 메세지란을 입력해주세요.</p>
    <div class="actions">
      <base-button>메세지 보내기</base-button>
    </div>
  </form>
</template>

<script>
export default {
  data(){
    return{
      email:'',
      message:'',
      formIsValid:true
    }
  },
  computed:{
    getUserEmail(){
      const userId = this.$store.getters.userId
      if(userId){
        const userInfoArray = this.$store.getters.getUsersInfo
        const {email} = userInfoArray.find(info => info._id === userId)
         return email
      }else{
        return ''
      }
     
    }
  },
  created(){
    this.email = this.getUserEmail
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
        coachId: this.$route.params.owner
      })
      this.$router.replace('/coaches')
    }
  }
}
</script>

<style scoped>
  form {
    margin: 1rem;
    border: 1px solid #ccc;
    border-radius: 12px;
    padding: 1rem;
  }

  .form-control {
    margin: 0.5rem 0;
  }

  label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
  }

  input,
  textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: 1px solid #ccc;
    padding: 0.15rem;
  }

  input:focus,
  textarea:focus {
    border-color: #3d008d;
    background-color: #faf6ff;
    outline: none;
  }

  .errors {
    font-weight: bold;
    color: red;
  }

  .actions {
    text-align: center;
  }
</style>