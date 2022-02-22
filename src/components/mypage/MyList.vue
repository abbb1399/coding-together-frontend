<template>
  <section id="main">
    <header>
      <h2>{{title}}</h2>
      <p class="info">
        {{createdAt}}  
        <base-badge class="badge" v-for="area in areas" :key="area" :type="area" :title="area"></base-badge>  
      </p>
    </header>
    <img id="list-img" :src="imgSrc" alt="글 이미지">
    
    <div id="viewer"/>
 
  </section>
</template>

<script>
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

export default {
  inject:['$moment'],
  data(){
    return{
      title:'',
      createdAt:'',
      description:'',
      areas:[],
      imgSrc:null
    }
  },
  async created(){
    await this.getMyList()

    new Viewer({
      el: document.querySelector('#viewer'),
      initialValue: this.description
    });
  },
  methods:{
    async getMyList(){
      await this.$store.dispatch('articles/fetchMyArticle')
      const myList = {...this.$store.getters['articles/getMyPageList']}
      this.title = myList.name
      this.createdAt = this.$moment(myList.createdAt).format('YYYY-MM-DD')
      this.description = myList.description
      this.areas = myList.areas
      this.imgSrc = `http://localhost:3000/images/${myList.thumbnail}`
    }
  }
}
</script>

<style lang="scss" scoped>
  :deep(.toastui-editor-contents){
    font: inherit;
  }

  h2{
    margin-bottom: 1rem;
    color: #555;
  }

  img{
    width: 100%;
    margin-bottom: 1rem;
  }

  .writer {
    text-decoration: none;
    color: #1abc9c;
  }
  .writer:hover{
    text-decoration: underline;
  }

  #main{
    header p {
      color: #555;
      margin: 0 0 1em 0;
      font-size: 1em;
      font-style: italic;
      border-top: 1px solid rgba(144, 144, 144, 0.25);
      border-bottom: 1px solid rgba(144, 144, 144, 0.25);
      padding: 5px 0;
    }
  }

  .badge{
    margin-left: .5rem;
  }


</style>