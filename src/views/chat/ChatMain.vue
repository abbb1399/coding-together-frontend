<template>
  <section class="chat">
    <h2 class="chat__caption">채팅 목록</h2>
    <div v-if="roomList.length">
      <li class="chat__list" @click="enterChatRoom(room)" v-for="room in roomList" :key="room.roomId">
        <img class="chat__img" alt="유저 프로필" :src="room.avatar ? room.avatar : noImg">
        <div class="chat__group">
          <h2>{{room.roomName}}</h2>
          <div class="content__group">
            <p class="content__name" v-for="user in room.users" :key="user._id">
              {{user.username}}
            </p>
          </div>
        </div>
      </li>
    </div>
    <h3 v-else>채팅 방 목록이 없습니다.</h3>
  </section>
</template>

<script>
export default {
  data(){
    return{
      noImg: require('../../assets/avatar.jpg')
    }
  },
  computed:{
    roomList(){
      return this.$store.getters['chat/roomList']
    },
  },
  async created(){
    await this.$store.dispatch('chat/fetchChatRoomList')
  },
  methods:{
    enterChatRoom(roomInfo){
      this.$router.push({name:'chatRoom',  params: {roomId: roomInfo.roomId }})
    }
  }
}
</script>

<style lang="scss" scoped>
  .chat{
    max-width: $website-width;
    margin: 0 auto;

    &__caption{
      text-align: center;
      margin-top: 1rem;
    }

    &__list {
      display: flex;
      border-bottom: 1px solid $color-grey-light;
      border-radius: 5px;
      padding: .8rem;
      cursor:pointer;    
    }

    &__img{
      width: 8%;
      border-radius: 5px;
    }
    
    &__group{
      margin-left: .9rem;

      .content__group{
        display:inline-flex;
        margin-bottom: 5px;

        .content__name{
          font-weight: 600;
        
            &:not(:first-child){
            margin-left: .3rem;
          }
        }

        .content__email {
          color: $primary-color;
          font-weight: bold;
          margin-left: .4rem;
        }
      }
    }
  }
</style>