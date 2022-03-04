<template>
  <form @submit.prevent="submitForm">
    <div class="form-control" :class="{invalid: !name.isValid}">
      <label for="name" class="caption">제목</label>
      <input type="text" id="name" class="form-input" v-model.trim="name.val" maxlength="30" 
        v-focus required @blur="clearValidity('name')" @keydown.tab="useTab"
      > 
      <p v-if="!name.isValid">이름은 반드시 입력되야 합니다.</p>
    </div>
    
    <div class="form-control" :class="{invalid: !description.isValid}">
      <label for="description" class="caption">설명</label>
      <div id="editor" ref="tuiEditor" ></div>
      <!-- <textarea id="description" rows="5" v-model.trim="description.val" @blur="clearValidity('description')"></textarea>  -->
      <!-- <p v-if="!description.isValid">설명은 반드시 입력되야 합니다..</p> -->
    </div>
    
    <div class="form-control" :class="{invalid: !areas.isValid}"> 
      <label for="frontend" class="caption">분야</label>
      <div>
        <input type="checkbox" id="frontend" value="frontend" class="form-input" v-model="areas.val" @blur="clearValidity('areas')"> 
        <label for="frontend" class="caption">프론트엔드 개발자</label>
      </div>
      <div>
        <input type="checkbox" id="backend" value="backend" class="form-input" v-model="areas.val" @blur="clearValidity('areas')"> 
        <label for="backend" class="caption">백엔드 개발자</label>
      </div>
      <div>
        <input type="checkbox" id="publisher" value="publisher" class="form-input" v-model="areas.val" @blur="clearValidity('areas')"> 
        <label for="publisher" class="caption">퍼블리셔</label>
      </div>
      <p v-if="!areas.isValid">최소한 하나는 선택 되어야 합니다.</p>
    </div>

    <div class="form-control">
      <label for="file" class="caption">썸내일</label>
      <div class="my-1">
        <input type="file" id="actual-btn" hidden @change="selectFile"/>
        <label id='file-label' for="actual-btn">파일 첨부</label>
        <span id="file-chosen">{{chosenFileName}}</span>
      </div>
    </div>
    <!-- <input id="file" type="file" accept="image/png, image/jpeg" @change="uploadFile"> -->

    <p v-if="!formIsValid">제대로 입력 하신 후, 다시 등록해주세요.</p>
    
    <div id="btn-container">
      <base-button>등록</base-button>
    </div>

  </form>
</template>

<script>
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/ko-kr'

export default {
  inject:['$swal'],
  emits:['save-data'],
  data(){ 
    return{
      name:{
        val:'',
        isValid:true
      },
      description: {
        val:'',
        isValid:true
      },
      areas:{
        val:[],
        isValid:true
      },
      formIsValid:true,
      file:null,
      listId:'',
      chosenFileName:'파일을 선택하세요.'
    }
  },
  created(){
    

  },
  mounted() {
    const editor = new Editor({
      el: document.querySelector("#editor"),
      initialEditType: "wysiwyg",
      previewStyle: "vertical",
      language: 'ko-KR',
      autofocus:false
    })
    // tuiEditor 바인딩
    this.tuiEditor = editor

    // mypage에서 변경시
    if(this.$route.path ==='/mypage/list'){
      const myInfo = this.$store.getters['articles/getMyPageList']
      this.name.val = myInfo.name
      const desc = myInfo.description
      this.description.val = desc
      editor.setMarkdown(desc,false)
      this.areas.val= [...myInfo.areas]
      this.chosenFileName = myInfo.thumbnail
      this.listId = myInfo._id

      console.log(this.file)
    }
  },
  methods:{
    // input이 blur될때마다 에러표시 지워주기
    clearValidity(input){
      // this.name ....
      this[input].isValid = true
    },
    validateForm(){
      this.formIsValid = true
  
      if(this.name.val === ''){
        this.name.isValid = false
        this.formIsValid = false
      }
      if(this.description.val === ''){
        this.description.isValid = false
        this.formIsValid = false
      }
      if(this.areas.val.length === 0){
        this.areas.isValid = false
        this.formIsValid = false
      }
      if(!this.file && !this.$route.path ==='/mypage/list'){
        this.formIsValid = false
      }
    },
    async submitForm(){
      console.log(this.$route.path)
      const result = await this.swalAlert(this.$route.path ==='/mypage/list' ? '수정' :' 삭제')
      if(result.value){
        // tui 에디터 글내용 받아오기
        this.description.val = this.tuiEditor.getMarkdown()

        this.validateForm()

        if(!this.formIsValid){
          return
        }


        if(this.file){
          // 파일업로드 로직
          const data = new FormData()
          const fileToUpload = this.file
          data.append('images', fileToUpload)

          await this.$store.dispatch('articles/uploadImage',data)
          this.file = this.$store.getters['articles/getUploadFileName']
        }

        
        const formData={
          _id: this.listId,
          name: this.name.val,
          desc: this.description.val,
          areas:this.areas.val,
          thumbnail: this.file
        }

        if(this.$route.path ==='/mypage/list'){
          // 마이페이지 경우는 Update
            console.log(this.file)
          if(!this.file){
            delete formData.thumbnail
          }
          console.log(formData)

          await this.$store.dispatch('articles/updateArticle', formData)
          this.$router.replace({name:'myProfile'})
          this.$swal.fire({
            icon: 'success',
            title: `글 수정에 성공 하였습니다.`,
            showConfirmButton: false,
            timer: 2000
          })
        }else{
          // 공고등록 경우는 Create
          this.$emit('save-data', formData)
        }
      }
    },
    useTab(){
      // 버전업 필요 
      this.tuiEditor.focus()
    },
    selectFile(e){
      this.file = e.target.files[0]
      this.chosenFileName = e.target.files[0].name
    },
    swalAlert(title){
      return this.$swal.fire({
        title: `${title} 하시겠습니까?`,
        text: `해당 글을 ${title}합니다.`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: '네',
        cancelButtonText: '아니오'
      })
    }
  }
}
</script>


<style lang="scss" scoped>
   :deep(.toastui-editor-contents){
    font:inherit;
  }

  .form-control {
    margin: 0.5rem 0;
  }

  .caption {
    font-weight: bold;
    display: block;
    margin: 1.2rem 0 0.5rem 0;
  }

  .form-input{
    display: block;
    width: 100%;
    border: 1px solid #ccc;
    font: inherit;
  
    &[type='text']{
      padding: 5px;
    }

    &[type='checkbox'] {
      display: inline;
      width: auto;
      border: none;
    }

    &[type='checkbox'] + label {
      font-weight: normal;
      display: inline;
      margin: 0 0 0 0.5rem;
    }

    &:focus{
      border-color: $primary-color;
      background-color: $primary-bg-color;
      outline: none;
    }  
  }

  .invalid{
    label {
      color: red;
    }
    input{
      border: 1px solid red;
    }
  }

  #btn-container{
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;

    *{
      font-size: 1rem;
      width: 7rem;
    }
  }

  #file-label {
    background-color: indigo;
    color: white;
    padding: 0.5rem;
    font-family: sans-serif;
    border-radius: 0.3rem;
    cursor: pointer;
    margin-top: 1rem;
  }

  #file-chosen{
    margin-left: 0.3rem;
    font-family: sans-serif;
  }
</style>      

