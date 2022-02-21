<template>
  <form @submit.prevent="submitForm">
    <div class="form-control" :class="{invalid: !name.isValid}">
      <label for="name">이름</label>
      <input type="text" id="name" v-model.trim="name.val" v-focus required @blur="clearValidity('name')" @keydown.tab="useTab"> 
      <p v-if="!name.isValid">이름은 반드시 입력되야 합니다.</p>
    </div>
    
    <div class="form-control" :class="{invalid: !description.isValid}">
      <label for="description">설명</label>
      <div id="editor" ref="tuiEditor" ></div>
      <!-- <textarea id="description" rows="5" v-model.trim="description.val" @blur="clearValidity('description')"></textarea>  -->
      <!-- <p v-if="!description.isValid">설명은 반드시 입력되야 합니다..</p> -->
    </div>
    
    <div class="form-control" :class="{invalid: !areas.isValid}"> 
      <label for="frontend">분야</label>
      <div>
        <input type="checkbox" id="frontend" value="frontend" v-model="areas.val" @blur="clearValidity('areas')"> 
        <label for="frontend">프론트엔드 개발자</label>
      </div>
      <div>
        <input type="checkbox" id="backend" value="backend" v-model="areas.val" @blur="clearValidity('areas')"> 
        <label for="backend">백엔드 개발자</label>
      </div>
      <div>
        <input type="checkbox" id="publisher" value="publisher" v-model="areas.val" @blur="clearValidity('areas')"> 
        <label for="publisher">퍼블리셔</label>
      </div>
      <p v-if="!areas.isValid">최소한 하나는 선택 되어야 합니다.</p>
    </div>

    <div class="form-control">
      <label for="file">썸내일</label>
      <input 
        id="file"
        type="file" 
        name="thumbnail"
        accept="image/png, image/jpeg"
        @change="uploadFile"
      >
    </div>

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
  emits:['save-data'],
  data(){ 
    return{
      name:{
        val:'',
        isValid:true
      },
      description: {
        // val:'',
        isValid:true
      },
      areas:{
        val:[],
        isValid:true
      },
      formIsValid:true,
      tuiEditor:null,
      file:null
    }
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
  },
  methods:{
    // input이 blur될때마다 에러표시 지워주기
    clearValidity(input){
      // this.name ....
      this[input].isValid = true
    },
    validateForm(tuiContent){
      this.formIsValid = true
  
      if(this.name.val === ''){
        this.name.isValid = false
        this.formIsValid = false
      }
      if(tuiContent === ''){
        this.description.isValid = false
        this.formIsValid = false
      }
      if(this.areas.val.length === 0){
        this.areas.isValid = false
        this.formIsValid = false
      }
    },
    uploadFile(e){
      this.file = e.target.files[0]
    },
    async submitForm(){
      // tui 에디터 글내용 받아오기
      const tuiContent = this.tuiEditor.getMarkdown()
    
      this.validateForm(tuiContent)

      if(!this.formIsValid){
        return
      }

      // 파일업로드 로직
      const data = new FormData()
      const fileToUpload = this.file
      data.append('images', fileToUpload)

      await this.$store.dispatch('coaches/uploadImage',data)
      
      // console.log(this.$store.getters['coaches/getUploadFileName'])

      const formData={
        name: this.name.val,
        desc: tuiContent,
        areas:this.areas.val,
        thumbnail: this.$store.getters['coaches/getUploadFileName']
      }
      this.$emit('save-data', formData)
    },
    useTab(){
      // 버전업 필요 
      // this.tuiEditor.focus()
    }
  }
}
</script>

<style>
  /* .toastui-editor-contents {
    font-size: 20px;
  } */
</style>

<style lang="scss" scoped>
   :deep(.toastui-editor-contents){
    font:inherit;
  }

  .form-control {
    margin: 0.5rem 0;
  }

  label {
    font-weight: bold;
    display: block;
    margin: 1.2rem 0 0.5rem 0;
  }

  input{
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
</style>      

