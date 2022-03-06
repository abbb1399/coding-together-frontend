<template>
  <div class="article">
    <section>
      <img class="article__thumbnail" :src="imgSrc" alt="썸내일">
      <h1 class="l-heading">{{title}}</h1> 
      <div class="meta">
        <small>
          <i class="fas fa-user"></i> Written By {{getOwnerName}} {{updatedAt}}
        </small>
        <div>
          <base-badge class="bagde" v-for="area in areas" :key="area" :type="area" :title="area"/>
        </div>
      </div>

      <div id="viewer"/>
    </section>

    <section>
      <base-card :card-width="cardWidth">
        <header>
          <h2>관심있나요? 지금 신청하세요!</h2>
          <!-- <base-button link :to="contactLink">연락하기</base-button> -->
        </header>
        <contact-owner
          :title="title"
          :owner="owner"
          :img-src="imgSrc"
        />
        <!-- <router-view></router-view> -->
      </base-card>
    </section>
   
  </div>
</template>

<script>
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
// import '@toast-ui/editor/dist/toastui-editor.css'
import ContactOwner from '../requests/ContactOwner.vue'

export default {
  components:{
    ContactOwner
  },
  // router로 props 넘김
  props:{
    owner:{
      type:String
    }
  },
  inject:['$moment'],
  computed:{
    getOwnerName(){
      return this.$store.getters.getUsersInfo.name
    },
    contactLink(){
      return this.$route.path + '/' + this.owner + '/contact'
      // return this.$route.path + '/contact'
    }
  },
  data(){
    return{
      selectedCoach:null,
      title:'',
      areas:[],
      updatedAt:'',
      description:'',
      cardWidth:'large-card',
      imgSrc: require('../../assets/ent1.jpg')
    }
  },
  async created(){
    await this.loadArticles()
    await this.$store.dispatch('fetchAllUsersInfo', this.owner)
    
    const info = this.$store.getters['articles/articles'].find(coach => coach.owner === this.owner)

    this.title = info.name
    this.areas = info.areas
    this.description = info.description
    this.updatedAt = this.$moment(info.updatedAt).format('YYYY-MM-DD')

    if(info.thumbnail){
      this.imgSrc =  `http://localhost:3000/images/${info.thumbnail}`
    }

    new Viewer({
      el: document.querySelector('#viewer'),
      // 표시하고자 하는 내용은 여기에 들어간다.
      initialValue: this.description
    });


  },
  methods:{
    async loadArticles(refresh = false) {
      this.isLoading = true
      try{
        await this.$store.dispatch('articles/loadArticles', { forceRefresh : refresh})
      }catch(error){
        this.error = error.message || '에러 발생!'
      }
      this.isLoading = false
    },
  }
}
</script>


<style lang="scss" scoped>
  :deep(.toastui-editor-contents){
    font: inherit;
  }
  
  .article{
    max-width: $website-width;
    margin: 1rem auto;

    &__thumbnail{
      height: 32rem;
      width:100%;
      border-radius: 5px;
    }
  }

  #viewer{
    margin-top: 1.56rem;
  }



  
  .meta{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #eee;
    padding: 0.5rem;

    .badge{
      text-align: center;
      font-size: 12px;
      width: 5.5rem;
    }
  }
</style>