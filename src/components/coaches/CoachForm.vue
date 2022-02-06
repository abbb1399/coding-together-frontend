<template>
  <form @submit.prevent="submitForm">
    <div class="form-control" :class="{invalid: !name.isValid}">
      <label for="name">이름</label>
      <input type="text" id="name" v-model.trim="name.val" v-focus required @blur="clearValidity('name')" > 
      <p v-if="!name.isValid">이름은 반드시 입력되야 합니다.</p>
    </div>
    <div class="form-control" :class="{invalid: !description.isValid}">
      <label for="description">설명</label>
      <div id="editor" ref="tuiEditor" ></div>
      <!-- <textarea id="description" rows="5" v-model.trim="description.val" @blur="clearValidity('description')"></textarea>  -->
      <!-- <p v-if="!description.isValid">설명은 반드시 입력되야 합니다..</p> -->
    </div>
    <div class="form-control" :class="{invalid: !areas.isValid}"> 
      <h3>Areas of Expertise</h3>
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
    <p v-if="!formIsValid">제대로 입력 하신 후, 다시 등록해주세요.</p>
    <base-button>등록</base-button>
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
      // rate:{
      //   val:null,
      //   isValid:true
      // },
      areas:{
        val:[],
        isValid:true
      },
      formIsValid:true,
      tuiEditor:null 
    }
  },
  mounted() {
    const editor = new Editor({
      el: document.querySelector("#editor"),
      initialEditType: "wysiwyg",
      previewStyle: "vertical",
      language: 'ko-KR',
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
    submitForm(){
      // tui 에디터 글내용 받아오기
      const tuiContent = this.tuiEditor.getMarkdown()
    
      this.validateForm(tuiContent)

      if(!this.formIsValid){
        return
      }

      const formData={
        name: this.name.val,
        desc: tuiContent,
        // rate: this.rate.val,
        areas:this.areas.val
      }
      this.$emit('save-data',formData)
    },
    // 이름(input)에서 설명(tui-editor)으로 tab키를 통해 넘어가도록 편의성 제공. 
    useTab () {
      // this.tuiEditor.focus()
    }
  }
}
</script>

<style>
  /* .toastui-editor-contents {
    font: inherit;
  } */
</style>


<style scoped>
  .form-control {
    margin: 0.5rem 0;
  }

  label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
  }

  input[type='checkbox'] + label {
    font-weight: normal;
    display: inline;
    margin: 0 0 0 0.5rem;
  }

  input,
  textarea {
    display: block;
    width: 100%;
    border: 1px solid #ccc;
    font: inherit;
  }

  input:focus,
  textarea:focus {
    background-color: #f0e6fd;
    outline: none;
    border-color: #3d008d;
  }

  input[type='checkbox'] {
    display: inline;
    width: auto;
    border: none;
  }

  input[type='checkbox']:focus {
    outline: #3d008d solid 1px;
  }

  h3 {
    margin: 0.5rem 0;
    font-size: 1rem;
  }

  .invalid label {
    color: red;
  }

  .invalid input,
  .invalid textarea {
    border: 1px solid red;
  }
</style>      

