<template>
  <section id="main" v-if="!editMode && hasArticle">
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
  <section v-else-if="!editMode">
    <h2>작성된 글이 없습니다.</h2>
  </section>
  
  <div v-else>
    <h2>공고 수정</h2>
    <article-form id="article-form" ></article-form>
  </div>
</template>

<script>
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import ArticleForm from '../../../components/articles/ArticleForm.vue'


export default {
  inject:['$moment','$swal'],
  components:{
    ArticleForm
  },
  data(){
    return{
      title:'',
      createdAt:'',
      description:'',
      areas:[],
      imgSrc:null,
      hasArticle: null,
      editMode: false
    }
  },
  async created(){
    await this.getMyList()
  },
  methods:{
    async getMyList(){
      this.hasArticle = true
      await this.$store.dispatch('articles/fetchMyArticle')
      const myList = this.$store.getters['articles/getMyPageList']
     
      if(myList){
        this.title = myList.name
        this.createdAt = this.$moment(myList.createdAt).format('YYYY-MM-DD')
        // this.description = myList.description
        this.areas = myList.areas
        this.imgSrc = `http://localhost:3000/images/${myList.thumbnail}`

        new Viewer({
          el: document.querySelector('#viewer'),
          initialValue: myList.description
        });
      }else{
        this.hasArticle = false
      }
    },
    async deleteArticle(){
      const result = await this.$swal.fire({
        title: '삭제 하시겠습니까??',
        text: '해당 글을 삭제합니다.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: '네',
        cancelButtonText: '아니오'
      })

      if(result.value){
        await this.$store.dispatch('articles/deleteMyArticle')
        this.$router.replace({name:'myList'})
        this.$swal.fire({
          icon: 'success',
          title: `글 삭제에 성공 하였습니다.`,
          showConfirmButton: false,
          timer: 2000
        })
      }
    },
    editArticle(){
      this.editMode = true
      // vuex로 article form에 데이터 전달
    },
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

  #article-form{
    width: 45vw;
  }
</style>