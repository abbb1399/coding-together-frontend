<template>
  <div>
    <section>
      <base-card>
        <img src="../../assets/ent1.jpg" alt="">
        <h1 class="l-heading">{{name}}</h1> 
        <div class="meta">
          <small>
            <i class="fas fa-user"></i> Written By {{getOwnerName}} {{updatedAt}}
          </small>
          <!-- <div class="category category-ent">Entertainment</div> -->
          <base-badge v-for="area in areas" :key="area" :type="area" :title="area" ></base-badge>
        </div>

       
        <div id="viewer"/>
      </base-card>
    </section>

    <section>
      <base-card>
        <header>
          <h2>관심있나요? 지금 신청하세요!</h2>
          <!-- <base-button link :to="contactLink">연락하기</base-button> -->
        </header>
        <contact-coach></contact-coach>
        <!-- <router-view></router-view> -->
      </base-card>
    </section>
   
  </div>
</template>

<script>
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
// import '@toast-ui/editor/dist/toastui-editor.css'
import ContactCoach from '../requests/ContactCoach.vue'

export default {
  components:{
    ContactCoach
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
      name:'',
      areas:[],
      updatedAt:'',
      description:''
    }
  },
  async created(){
    await this.loadCoaches()
    
    const info = this.$store.getters['coaches/coaches'].find(coach => coach.owner === this.owner)
    this.name = info.name
    this.areas = info.areas
    this.description = info.description
    this.updatedAt = this.$moment(info.updatedAt).format('YYYY-MM-DD')

    new Viewer({
      el: document.querySelector('#viewer'),
      // 표시하고자 하는 내용은 여기에 들어간다.
      initialValue: this.description
    });


  },
  mounted(){
    
  },
  methods:{
    async loadCoaches(refresh = false) {
      this.isLoading = true
      try{
        await this.$store.dispatch('coaches/loadCoaches', { forceRefresh : refresh})
      }catch(error){
        this.error = error.message || '에러 발생!'
      }
      this.isLoading = false
    },

  }
}
</script>


<style scoped>
  #viewer{
    margin-top: 25px;
  }

  :deep(.toastui-editor-contents){
    font-family: inherit;
    font-size: 18px;
  }

  img{
    width:100%;
  }

  .l-heading{
    font-size: 3rem;
  }

  
  .meta{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #eee;
    padding: 0.5rem;
  }
</style>