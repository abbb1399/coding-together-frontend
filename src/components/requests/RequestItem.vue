<template>
  <li class="request" @click="enterChatRoom">
    <img class="request__img" alt="유저 프로필" :src="img">
    <div class="request__group">
      <h2>{{title}}</h2>
      <div class="content__group">
        <p class="content__email"> {{ email }} </p>
      </div>
      
      <p class="request__content">{{message}}</p>
    </div>
  </li>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      required:true
    },
    email:{
      type:String,
      required:true
    },
    message:{
      type:String,
      required:true
    },
    _id:{
      type:String,
      required: true
    },
    imgSrc:{
      type:String,
      // default: require('../../assets/avatar.jpg')
    },
    roomId:{
      type:String
    }
  },
  data(){
    return{

    }
  },
  computed:{
    emailLink(){
      return 'mailto:' + this.email
    },
    img(){
      if(this.imgSrc){
        return `http://localhost:3000/avatars/${this.imgSrc}`
      }else{
        return require('../../assets/avatar.jpg')
      }
    }

  },
  async created(){
    // console.log(this.roomId)
  },
  methods:{
    async enterChatRoom(){
      await this.$store.dispatch('chat/enterRoom', this.roomId)

      
      this.$router.push({name:'chatRoom',  params: {roomNum: this.roomId }})
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

      h3{
      }
    }

    .content__group{
      display:inline-flex;
      margin-bottom: 5px;


      .content__name{
        font-weight: 600;
      }

      .content__email {
        color: $primary-color;
        font-weight: bold;
        margin-left: .4rem;
      }
    }

    &__content{
      // margin: 5px 0 0 0;
    }
  }
</style>