<template>
  <li class="request" @click="enterChatRoom">
    <img class="request__img" alt="유저 프로필" :src="img">
    <div class="request__group">
      <h2>{{title}}</h2>
      <div class="content__group">
        <p class="content__name">{{fromName}}</p> 
        <p class="content__email"> {{fromEmail }} </p>
      </div>
      
      <p class="request__content">{{message}}</p>
    </div>
  </li>
</template>

<script>
import {toRefs, computed} from 'vue'
import { useStore } from "vuex"
import { useRouter } from "vue-router"

export default {
  props:{
    roomId:{
      type:String
    },
    title:{
      type:String,
      required:true
    },
    message:{
      type:String,
      required:true
    },
    fromName:{
      type:String,
      required:true
    },
    fromEmail:{
      type:String,
      required:true
    },
    fromImgSrc:{
      type:String,
    }
  },
  setup(props){
    const store = useStore()
    const router = useRouter()
    const {fromImgSrc, roomId} = toRefs(props) 

    const img = computed(()=>{
       if(fromImgSrc.value){
        return `http://localhost:3000/avatars/${fromImgSrc.value}`
      }else{
        return require('../../assets/avatar.jpg')
      }
    })

    const enterChatRoom = async () =>{
      await store.dispatch('chat/enterRoom', roomId.value)
      router.push({name:'chatRoom',  params: {roomId: roomId.value }})
    }

    return{
      img,
      enterChatRoom
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
      display:flex;
      align-items: center;
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