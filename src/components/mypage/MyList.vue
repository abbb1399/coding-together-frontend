<template>
  <section id="main" v-if="hasArticle">
    <header>
      <div class="title-section">
        <h2>{{title}}</h2>
        <span>
          <base-button mode="secondary" @click="editArticle">수정</base-button>
          <base-button mode="primary" @click="deleteArticle">삭제</base-button>
        </span>
      </div>

      <p class="info">
        {{createdAt}}  
        <base-badge class="badge" v-for="area in areas" :key="area" :type="area" :title="area"></base-badge>  
      </p>
    </header>
    <img id="list-img" :src="imgSrc" alt="글 이미지">
    
    <div id="viewer"/>
  </section>
  <section v-else>
    <h2>작성된 글이 없습니다.</h2>
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
      imgSrc:null,
      hasArticle: null
    }
  },
  async created(){
    await this.$store.dispatch('articles/fetchMyArticle')
    await this.getMyList()
  },
  methods:{
    async getMyList(){
      const myList = this.$store.getters['articles/getMyPageList']
  
      if(myList){
        this.title = myList.name
        this.createdAt = this.$moment(myList.createdAt).format('YYYY-MM-DD')
        this.description = myList.description
        this.areas = myList.areas
        this.imgSrc = `http://localhost:3000/images/${myList.thumbnail}`

        new Viewer({
          el: document.querySelector('#viewer'),
          initialValue: this.description
        });

        this.hasArticle = true
      }else{
        this.hasArticle = false
      }
    },
    async deleteArticle(){
      await this.$store.dispatch('articles/deleteMyArticle')
      this.$router.replace('/articles')
    },
    editArticle(){

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

  .title-section{
    display: flex;
    justify-content: space-between;
  }


</style>