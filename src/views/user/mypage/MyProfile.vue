<template>
  <div>
    <img @click="imageUpload" id="myImage" alt="내 이미지" :src="imgSrc">
    <p><strong>이름 : </strong>{{name}}</p>
    <p><strong>이메일 : </strong>{{email}}</p>
    <p><strong>가입일 : </strong>{{createdAt}}</p>
  </div>
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
      myAvatar:null,
      imgSrc:require('../../../assets/avatar.jpg') 
    }
  },
  async created(){
    // 내 정보 불러오기
    await this.getMyInfo()  
 
  },
  methods:{
    async getMyInfo(){
      // await this.$store.dispatch('fetchMyInfo')
      const myInfo = {...this.$store.getters.getMyInfo}

      this.email = myInfo.email
      this.name = myInfo.name
      this.createdAt = this.$moment(myInfo.createdAt).format('YYYY-MM-DD'),
      this.myId = myInfo._id
      this.imgSrc = `http://localhost:3000/avatars/${myInfo.avatar}`
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
        this.getMyInfo()
       
      }
      upload.click()
    },
    async deleteAccount(){
      await this.$store.dispatch('deleteAccount')
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
  p{
    margin: .8rem 0;
  }

  #myImage{
    display: block;
    height: 150px;
    border-radius: 50%;
    margin: 0 auto;
    cursor: pointer;
    margin-bottom: 2rem;
  }
</style>