<template>
  <base-card>
    <div class="card">
      <img @click="imageUpload" id="myImage" alt="내 이미지" style="width:100%" src="../../assets/avatar.jpg">
      <h1>{{name}}</h1>
      <p class="title">{{email}}</p>
      <p>가입일: {{createdAt}}</p>
      <p><button @click="deleteAccount">회원 탈퇴</button></p>
    </div>

    <div>
      <ul>
        <li>내가 쓴글</li>
      </ul>
    </div>

  </base-card>
</template>

<script>

export default {
  inject:['$moment'],
  data(){
    return{
      email:'',
      name:'',
      createdAt:'',
      myId:'',
      myAvatar:null
    }
  },
  async created(){
    // 내 정보 불러오기
    await this.getMyInfo()  
    // 내 아바타 불러오기
    await this.getMyAvatar()
  },
  methods:{
    async getMyInfo(){
      await this.$store.dispatch('fetchMyInfo')
      const myInfo = {...this.$store.getters.getMyInfo}
    
      this.email = myInfo.email
      this.name = myInfo.name
      this.createdAt = this.$moment(myInfo.createdAt).format('YYYY-MM-DD'),
      this.myId = myInfo._id
    },
    async getMyAvatar(){
      await this.$store.dispatch('fetchAvatar', this.myId)
      document.querySelector('#myImage').src = `http://localhost:3000/users/${this.myId}/avatar`

      // const urlCreator = window.URL || window.webkitURL;
      // if(this.$store.getters.getMyAvatar.size > 0){
      //   document.querySelector('#myImage').src = urlCreator.createObjectURL(this.$store.getters.getMyAvatar)
      // }
    },  
    imageUpload(){
      const upload = document.createElement('input')
      upload.type = 'file'
      upload.accept="image/png, image/jpeg"

      upload.onchange = async (e) => {
        if (!upload.files) return

        const data = new FormData()
        const files = e.target.files
        const fileToUpload = files[0]
        data.append('avatar', fileToUpload)

        // 서버 로직
        await this.$store.dispatch('uploadAvatar',data)
        this.getMyAvatar()
       
      }
      upload.click()
    },
    async deleteAccount(){
      console.log('qweqwe')
      await this.$store.dispatch('deleteAccount')
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
  .card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    max-width: 300px;
    /* margin: auto; */
    text-align: center;
  }

  .title {
    color: grey;
    font-size: 1.8rem;
  }

  img{
    cursor:pointer
  }

  button {
    border: none;
    outline: 0;
    display: inline-block;
    padding: 0.8rem;
    color: white;
    background-color: #000;
    text-align: center;
    cursor: pointer;
    width: 100%;
    font-size: 1.8rem;
  
    &:hover{
      background-color: lighten(#000, 70%);
    }
  }
</style>