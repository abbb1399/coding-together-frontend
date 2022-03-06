<template>
  <div v-if="roomList.length !== 0">
    <li class="request" @click="enterChatRoom(room)" v-for="room in roomList" :key="room.roomId">
      <img class="request__img" alt="유저 프로필" :src="imgSrc(room.avatar)">
      <div class="request__group">
        <h2>{{room.roomName}}</h2>
        <div class="content__group">
          <p class="content__name">{{room.users}}</p>
          <!-- <p class="content__email"> {{ email }} </p> -->
        </div>
        <p class="request__content">{{room.roomId}}</p>
      </div>
    </li>
  </div>
  <h3 v-else>채팅 방 목록이 없습니다.</h3>
</template>

<script>
export default {
  data(){
    return{
      title: '프론트엔드 뽑아요',
      email:'abbb123@naver.com',
      message:'같이해요',
      name: '전인표',
    }
  },
  computed:{
    emailLink(){
      return 'mailto:' + this.email
    },
    roomList(){
      return this.$store.getters['chat/roomList']
    },
  },
  async created(){
    await this.$store.dispatch('chat/fetchChatRoomList')
  },
  methods:{
    imgSrc(avatar){
      if(avatar){
        return `http://localhost:3000/avatars/${avatar}` 
      }else{
        return require('../../assets/avatar.jpg')
      }
    },
    enterChatRoom(roomInfo){

      this.$router.push({name:'chatRoom',  params: {roomNum: roomInfo.roomId }})
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