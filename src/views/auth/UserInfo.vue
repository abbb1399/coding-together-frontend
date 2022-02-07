<template>
  <base-card>
    <div class="card">
      <img @click="imageUpload" id="myImage" alt="내 이미지" style="width:100%">
      <h1>{{name}}</h1>
      <p class="title">{{email}}</p>
      <p>가입일: {{createdAt}}</p>
      <p><button @click="deleteAccount">회원 탈퇴</button></p>
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
    
      const urlCreator = window.URL || window.webkitURL;
      this.myAvatar = urlCreator.createObjectURL(this.$store.getters.getMyAvatar )
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
        try{
          await this.$store.dispatch('uploadAvatar',data)
          this.getMyAvatar()
        }catch(e){
          alert(e)
        }
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

<style scoped>
  .card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    max-width: 300px;
    margin: auto;
    text-align: center;
  }

  .title {
    color: grey;
    font-size: 18px;
  }

  img{
    cursor:pointer
  }

  button {
    border: none;
    outline: 0;
    display: inline-block;
    padding: 8px;
    color: white;
    background-color: #000;
    text-align: center;
    cursor: pointer;
    width: 100%;
    font-size: 18px;
  }

  button:hover{
    opacity: 0.7;
  }
</style>