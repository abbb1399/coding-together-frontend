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
    // 내 아바타 불러오기
    await this.getMyAvatar()
  },
  methods:{
    async getMyInfo(){
      const myInfo = {...this.$store.getters.getMyInfo}

      this.email = myInfo.email
      this.name = myInfo.name
      this.createdAt = this.$moment(myInfo.createdAt).format('YYYY-MM-DD'),
      this.myId = myInfo._id
    },
    async getMyAvatar(){
      if(this.$store.getters.getMyInfo.thumbnail){
        await this.$store.dispatch('fetchAvatar', this.myId)
        this.imgSrc = `http://localhost:3000/users/${this.myId}/avatar`
      }
      
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