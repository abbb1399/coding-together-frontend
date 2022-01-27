<template>
  <base-card>
    <p>이름: {{name}}</p>
    <p>이메일: {{email}}</p>
    <p>가입일: {{createdAt}}</p>
    
    <img id="myImage" :src="myAvatar"  height="40" width="40" style="border-radius:20px;"/>
    <button @click="imageUpload">이미지 업로드</button>
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
      myAvatar: ''
    }
  },
  async created(){
    // 내 정보 불러오기
    await this.getMyInfo()  
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
      document.getElementById('myImage').src = urlCreator.createObjectURL(this.$store.getters.getMyAvatar )
    },  
    imageUpload(){
      const upload = document.createElement('input')
      upload.type = 'file'
      upload.accept="image/png, image/jpeg, image/jpg"

      upload.onchange = async (e) => {
        if (!upload.files) return

        const data = new FormData()
        const files = e.target.files
        const fileToUpload = files[0]
        data.append('avatar', fileToUpload)

        // 서버 로직
        try{
          await this.$store.dispatch('uploadAvatar',data)
        }catch(e){
          alert(e)
        }
      }
      upload.click()
    }
  }
}
</script>

<style scoped>

</style>