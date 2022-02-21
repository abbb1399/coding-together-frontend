<template>
  <section id="article">
    <div class="container">
      <div class="page-container">
        <aside id="categories" class="card">
          <h2>내 정보</h2>
          <ul class="list">
            <li>
              <a href="#"><i class="fas fa-chevron-right"></i>프로필</a>
            </li>
            <li>
              <a href="#"><i class="fas fa-chevron-right"></i>Entertainment</a>
            </li>
            <li>
              <a href="#"><i class="fas fa-chevron-right"></i>Technology</a>
            </li>
            <li>
              <a href="#"><i class="fas fa-chevron-right"></i>Fashion</a>
            </li>
            <li>
              <a href="#"><i class="fas fa-chevron-right"></i>Shopping</a>
            </li>
          </ul>
        </aside>

        <article class="card">
          <img src="../../assets/ent1.jpg" alt="">
          <h1 class="l-heading">Lorem ipsum dolor sit amet.</h1>
          <div class="meta">
            <small>
              <i class="fas fa-user"></i> Written By John Doe January 12, 2019
            </small>
            <div class="category category-ent">Entertainment</div>
          </div>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore debitis beatae ad doloremque voluptate, blanditiis suscipit error quam fugit sapiente, aliquid quia libero incidunt recusandae enim voluptas nulla sequi similique? Temporibus ad est minima magni molestias obcaecati consequatur cumque exercitationem deleniti eos, animi facere recusandae, pariatur eveniet neque? Voluptatem, molestias.</p>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae dignissimos dolorum ipsam corporis similique! Quis, esse minus? Ducimus tempore provident sunt officia? Velit temporibus harum voluptate, ipsum quisquam rerum doloremque consectetur quos incidunt deleniti dicta excepturi ratione, fugiat ad fuga in nam dolorum aut minus esse voluptatum suscipit et quae. Repellendus minus, ratione aperiam commodi voluptas iusto aliquam sapiente. Aut obcaecati, corporis praesentium porro nostrum excepturi animi repellendus incidunt non quis nisi assumenda voluptas possimus molestiae laboriosam iure sed architecto in perferendis magnam blanditiis voluptatum placeat labore odio? Unde id dolore aliquam, quas sit harum, saepe maiores facilis aliquid molestiae qui. Praesentium rerum, minima fugit laudantium quaerat voluptatem pariatur sequi saepe blanditiis nobis natus possimus quo, assumenda numquam sit, eaque accusamus incidunt exercitationem quis deleniti quisquam corrupti vel? Ut quisquam consequatur, doloribus voluptatibus iusto quaerat, sint non magnam reiciendis amet quos sapiente excepturi omnis laboriosam nobis, expedita delectus odio provident?</p>
        </article>
    
      </div>
    </div>
  </section>
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
    // await this.getMyInfo()  
    // 내 아바타 불러오기
    // await this.getMyAvatar()
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
.category{
  --ent-color: #a66bbe;
}

a{
  color: #333;
}

p{
  margin: .5rem 0;
}

img{
  width: 100%;
}


/* Utility */
.container{
  max-width: 1100px;
  margin: auto;
  padding: 0 2rem;
  overflow: hidden;
}

.category{
  display: inline-block;
  color: #fff;
  font-size: 0.55rem;
  text-transform: uppercase;
  padding: 0.4rem 0.6rem;
  border-radius: 15px;
  margin-bottom: 0.5rem;
}

.category-ent{ background: var(--ent-color);}

.btn{
  display: inline-block;
  border: none;
  background: black;
  color: #fff;
  padding: 0.5rem 1.5rem;
}


.btn-block{
  display: block;
  width: 100%;
  text-align: center;
}

.btn:hover{
  opacity: 0.9;
}

.card{
  background: #fff;
  padding: 1rem;
}


.bg-secondary{
  background: orangered;
  color: #fff;
}


.l-heading{
  font-size: 3rem;
}


.list li{
  padding: .5rem 0;
  border-bottom:  #555 dotted 1px;
  width: 90%;
}

.list li a:hover{
  color: $primary-color;
}

/* Inner page grid container */
.page-container{
  display: grid;
  grid-template-columns: 2fr 5fr;
  margin: 2rem 0;
  gap: 1.5rem;
}


#article .meta{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #eee;
  padding: 0.5rem;
}

#article .meta .category{
  margin-top: 0.4rem;
}

h2{
  margin-bottom: 1rem;
}
</style>