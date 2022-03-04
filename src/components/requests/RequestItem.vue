<template>
  <li class="request" @click="enterChatRoom">
    <img class="request__img" alt="유저 프로필" :src="imgSrc">
    <div class="request__group">
      <div class="request__title">
        <h4>{{name}}</h4>
        <p> {{ email }} </p>
      </div>
      
      <p class="request__content">{{message}}</p>
    </div>
  </li>
</template>

<script>
export default {
  props:{
    email:{
      type:String,
      required:true
    },
    message:{
      type:String,
      required:true
    },
    name:{
      type:String,
      required: true
    },
    imgSrc:{
      type:String,
      default: require('../../assets/avatar.jpg')
    }
  },
  data(){
    return{
      // imgSrc:require('../../assets/avatar.jpg') 
    }
  },
  computed:{
    emailLink(){
      return 'mailto:' + this.email
    }
  },
  async created(){
    
  
  },
  methods:{
    enterChatRoom(){
      // const roomName = this.email

    }
  }
}
</script>

<style lang="scss" scoped>
  .request {
    display: flex;
    margin: 1rem 0;
    border-bottom: 1px solid $color-grey-light;
    border-radius: 5px;
    padding: 1rem;
    cursor:pointer;

    &__img{
      width: 10%;
      border-radius: 5px;
    }

    &__group{
      margin-left: .9rem;
    }

    &__title{
      display:inline-flex;

      p {
        color: $primary-color;
        text-decoration: none;
        font-weight: bold;
        margin-left: .4rem;
      }
    }

    &__content{
      margin: .8rem 0 0 0;
    }
  }
</style>