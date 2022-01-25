<template>
  <div>
    <section>
      <base-card>
        <h2>{{title}} by {{getOwnerName}}</h2>
        <base-badge v-for="area in areas" :key="area" :type="area" :title="area" ></base-badge>
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
  computed:{
    title(){
      return this.selectedCoach.name
    },
    areas(){
      return this.selectedCoach.areas
    },
    description(){
      return this.selectedCoach.description
    },
    getOwnerName(){
      return this.$store.getters.getUsersInfo.name
    },
    contactLink(){
      // console.log(this.id)
      // console.log(this.$route.path )
      return this.$route.path + '/' + this.owner + '/contact'
      // return this.$route.path + '/contact'
    }
  },
  data(){
    return{
      selectedCoach:null,
    }
  },
  created(){
    this.selectedCoach = this.$store.getters['coaches/coaches'].find(coach => coach.owner === this.owner)
  },
  mounted(){
    new Viewer({
      el: document.querySelector('#viewer'),
      // 표시하고자 하는 내용은 여기에 들어간다.
      initialValue: this.description
    });
  },
  methods:{
    

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


</style>