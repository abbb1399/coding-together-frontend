<template>
  <form @submit.prevent="submitForm" class="form">
    <div class="form__control" :class="{invalid: !name.isValid}">
      <label for="name" class="form__caption">제목</label>
      <input type="text" id="name" class="form__input" v-model.trim="name.val" maxlength="30" 
        v-focus @blur="clearValidity('name')" @keydown.tab="focusEditor"> 
    </div>
    
    <div class="form__control" :class="{invalid: !description.isValid}">
      <label class="form__caption" @click="focusEditor">설명</label>
      <div id="editor" ref="tuiEditor"></div>
    </div>
    
    <div class="form__control" :class="{invalid: !areas.isValid}"> 
      <label for="frontend" class="form__caption">분야</label>
      <div>
        <input type="checkbox" id="frontend" value="frontend" class="form__input" v-model="areas.val" @blur="clearValidity('areas')"> 
        <label for="frontend" class="form__caption">프론트엔드 개발자</label>
      </div>
      <div>
        <input type="checkbox" id="backend" value="backend" class="form__input" v-model="areas.val" @blur="clearValidity('areas')"> 
        <label for="backend" class="form__caption">백엔드 개발자</label>
      </div>
      <div>
        <input type="checkbox" id="publisher" value="publisher" class="form__input" v-model="areas.val" @blur="clearValidity('areas')"> 
        <label for="publisher" class="form__caption">퍼블리셔</label>
      </div>
    </div>

    <div class="form__control" :class="{invalid: !file.isValid}">
      <label for="file" class="form__caption">썸내일</label>
      <div class="file-container my-1">
        <label class='file-label' for="file">파일 첨부</label>
        <input type="file" id="file" hidden accept="image/png, image/jpeg" @change="selectFile"/>
        <label class="file-chosen" for="file">{{chosenFileName}}</label>
      </div>
    </div>

    <div class="form__btn-container">
      <base-button>등록</base-button>
    </div>
  </form>
</template>

<script>
import {ref,reactive,inject,onMounted} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'

import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/ko-kr'

export default {
  emits:['save-data'],
  setup(_, context){
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const $swal = inject('$swal')
    const name = reactive({
      val:'',
      isValid:true
    })
    const description = reactive({
      val:'',
      isValid:true
    })
    const areas = reactive({
      val:[],
      isValid:true
    })
    const file = reactive({
      val:null,
      isValid:true
    })

    const formIsValid = ref(true)
    const listId = ref('')
    const chosenFileName = ref('파일을 선택하세요.')
    const tuiEditor = ref()

    onMounted(()=>{
      tuiEditor.value= new Editor({
        el: document.querySelector("#editor"),
        initialEditType: "wysiwyg",
        previewStyle: "vertical",
        language: 'ko-KR',
        autofocus:false,
        linkAttribute: {
          target: '_blank',
          contenteditable: 'false',
          rel: 'noopener noreferrer'
        }, 
        hooks: {
          addImageBlobHook: addImageBlobHook
        }
      })
      // mypage에서 변경시
      if(route.path ==='/mypage/list'){
        const myInfo = store.getters['articles/getMyPageList']
        
        name.val = myInfo.name
        const desc = myInfo.description
        description.val = desc
        tuiEditor.value.setMarkdown(desc,false)
        
        areas.val= [...myInfo.areas]
        chosenFileName.value = myInfo.thumbnail
        listId.value = myInfo._id
      }
    })

    // input이 blur될때마다 에러표시 지워주기
    const clearValidity = (input) =>{
      if(input === 'name'){
        name.isValid = true
      }else if(input === 'description'){
        description.isValid = true
      }else if(input === 'areas'){
        areas.isValid = true
      }else if(input === 'file'){
        file.isValid = true
      }
    }

    const validateForm = () =>{
      formIsValid.value = true
  
      if(name.val === ''){
        name.isValid = false
        formIsValid.value = false
      }
      if(description.val === ''){
        description.isValid = false
        formIsValid.value = false
      }
      if(areas.val.length === 0){
        areas.isValid = false
        formIsValid.value = false
      }
      if(!file.val){
        file.isValid = false
        formIsValid.value = false
      }
    }

    const submitForm = async ()=>{
      const result = await swalAlert(route.path ==='/mypage/list' ? '수정' :' 등록')
      if(result.value){
        // tui 에디터 글내용 받아오기
        description.val = tuiEditor.value.getMarkdown()

        if(description.val !== ''){
          clearValidity('description')
        }

        validateForm()

        if(!formIsValid.value){
          return $swal.fire({
            icon: 'error',
            title: '모든 내용을 기입하여 주세요.',
            showConfirmButton: false,
            timer: 2000
          })
        }

        if(file.val){
          // 파일업로드 로직
          const data = new FormData()
          const fileToUpload = file.val
          data.append('images', fileToUpload)

          await store.dispatch('articles/uploadImage',data)
          file.val = store.getters['articles/getUploadFileName']
        }

        const formData={
          _id: listId.value,
          name: name.val,
          desc: description.val,
          areas: areas.val,
          thumbnail: file.val
        }

        if(route.path ==='/mypage/list'){
          // 마이페이지 경우는 Update
          if(!file.val){
            delete formData.thumbnail
          }

          await store.dispatch('articles/updateArticle', formData)
          router.replace({name:'myProfile'})
          $swal.fire({
            icon: 'success',
            title: `글 수정에 성공 하였습니다.`,
            showConfirmButton: false,
            timer: 2000
          })
        }else{
          // 공고등록 경우는 Create
          context.emit('save-data', formData)
        }
      }
    }

    

    const focusEditor = () =>{
      tuiEditor.value.focus()
    }

    const selectFile = (e)=> {
      file.val = e.target.files[0]
      chosenFileName.value = e.target.files[0].name
      clearValidity('file')
    }

    const swalAlert = (title) => {
      return $swal.fire({
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

    const addImageBlobHook = async(blob, callbacks) =>{
      const fd = new FormData()
      fd.append('images', blob)

      await store.dispatch('articles/uploadImage',fd)
      callbacks(`http://localhost:3000/images/${store.getters['articles/getUploadFileName']}`)
    }

    return{
      name,
      description,
      areas,
      file,
      formIsValid,
      chosenFileName,
      clearValidity,
      validateForm,
      submitForm,
      focusEditor,
      selectFile
    }
  }
}
</script>


<style lang="scss" scoped>
   :deep(.toastui-editor-contents){
    font:inherit;
  }

  .form{
    &__control{
      margin: 1.6rem 0;

      .file-container{
        
        .file-label {
          background-color: $secondary-color;
          color: white;
          padding: 0.5rem;
          font-family: sans-serif;
          border-radius: 0.3rem;
          cursor: pointer;
        }

        .file-chosen{
          padding: .5rem;
          font-family: sans-serif;
          cursor: pointer;
        }
      }
    }

    &__caption{
      font-weight: bold;
      display: block;
      margin: 1.2rem 0 0.5rem 0;
    }

    &__input{
      display: block;
      width: 100%;
      border: 1px solid #ccc;
      font: inherit;
      
      &[type='text']{
        padding: .5rem;
        border-radius: 5px;
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
        /* background-color: $primary-bg-color; */
        outline: none;
        border-color: $color-grey-dark-1;
      }  
    }

    &__btn-container{
      margin-top: 1.6rem;
      display: flex;
      justify-content: flex-end;

      *{
        font-size: 1rem;
        width: 7rem;
      }
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
</style>      

