<template>
  <form @submit.prevent="submitForm" class="form">
    <div class="form__control" :class="{ invalid: !name.isValid }">
      <label for="name" class="form__caption">제목</label>
      <input
        type="text"
        id="name"
        class="form__input"
        v-model.trim="name.val"
        maxlength="30"
        v-focus
        @blur="clearValidity('name')"
        @keydown.tab="focusEditor"
      />
    </div>

    <div class="form__control" :class="{ invalid: !description.isValid }">
      <label class="form__caption" @click="focusEditor">설명</label>
      <div id="editor"/>
    </div>

    <div class="form__control" :class="{ invalid: !areas.isValid }">
      <label for="frontend" class="form__caption">분야</label>
      <div>
        <input
          type="checkbox"
          id="frontend"
          value="frontend"
          class="form__input pointer"
          v-model="areas.val"
          @blur="clearValidity('areas')"
        />
        <label for="frontend" class="form__caption pointer">프론트엔드 개발자</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="backend"
          value="backend"
          class="form__input pointer"
          v-model="areas.val"
          @blur="clearValidity('areas')"
        />
        <label for="backend" class="form__caption pointer">백엔드 개발자</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="publisher"
          value="publisher"
          class="form__input pointer"
          v-model="areas.val"
          @blur="clearValidity('areas')"
        />
        <label for="publisher" class="form__caption pointer">퍼블리셔</label>
      </div>
    </div>

    <div class="form__control" :class="{ invalid: !file.isValid }">
      <label for="file" class="form__caption">썸내일</label>
      <div class="file-container my-1">
        <label class="file-label" for="file">파일 첨부</label>
        <input
          type="file"
          id="file"
          hidden
          accept="image/png, image/jpeg"
          @change="selectFile"
        />
        <label class="file-chosen" for="file">{{ chosenFileName }}</label>
      </div>
    </div>

    <div class="form__btn-container">
      <base-button>등록</base-button>
    </div>
  </form>
</template>

<script>
import Editor from "@toast-ui/editor"
import "@toast-ui/editor/dist/toastui-editor.css"
import "@toast-ui/editor/dist/i18n/ko-kr"

// 이 페이지(TuiEditor 사용)는 Options Api를 사용 
// - Composition Api 사용시 TuiEditor메소드 사용 문제가 있음
export default {
  inject: ["$swal"],
  emits: ["save-data"],
  data() {
    return {
      name: {
        val: "",
        isValid: true,
      },
      description: {
        val: "",
        isValid: true,
      },
      areas: {
        val: [],
        isValid: true,
      },
      file: {
        val: null,
        isValid: true,
      },
      formIsValid: true,
      listId: "",
      chosenFileName: "파일을 선택하세요.",
    }
  },
  mounted() {
    this.tuiEditor = new Editor({
      el: document.querySelector("#editor"),
      initialEditType: "wysiwyg",
      previewStyle: "vertical",
      language: "ko-KR",
      autofocus: false,
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'table', 'image'],
        [ 'link','code', 'codeblock']
      ],
      linkAttribute: {
        target: "_blank",
        contenteditable: "false",
        rel: "noopener noreferrer",
      },
      hooks: {
        addImageBlobHook: this.addImageBlobHook,
      },
    })
    
    // mypage에서 변경시
    if (this.$route.path.split("/")[1] === "mypage") {
      const {name, description, areas, thumbnail, _id} = this.$store.getters["articles/getMyListDetail"]

      this.name.val = name
      const desc = description
      this.description.val = desc
      this.tuiEditor.setMarkdown(desc, false)

      this.areas.val = [...areas]
      this.chosenFileName = thumbnail
      this.file.val = thumbnail

      this.listId = _id
    }
  },

  methods: {
    // input이 blur될때마다 에러표시 지워주기
    clearValidity(input) {
      if (input === "name") {
        this.name.isValid = true
      } else if (input === "description") {
        this.description.isValid = true
      } else if (input === "areas") {
        this.areas.isValid = true
      } else if (input === "file") {
        this.file.isValid = true
      }
    },

    validateForm() {
      this.formIsValid = true

      if (this.name.val === "") {
        this.name.isValid = false
        this.formIsValid = false
      }
      if (this.description.val === "") {
        this.description.isValid = false
        this.formIsValid = false
      }
      if (this.areas.val.length === 0) {
        this.areas.isValid = false
        this.formIsValid = false
      }
      if (!this.file.val) {
        this.file.isValid = false
        this.formIsValid = false
      }
    },

    async submitForm() {
      const result = await this.swalAlert(
        this.$route.path.split("/")[1] === "mypage" ? "수정" : " 등록"
      )
      if (result.isConfirmed) {
        // tui 에디터 글내용 받아오기
        const description = this.tuiEditor.getMarkdown().trim()
        this.description.val = description

        if (description !== "") {
          this.clearValidity("description")
        }
        
        this.validateForm()

        if (!this.formIsValid) {
          this.$swal.fire({
            icon: "error",
            title: "모든 내용을 기입하여 주세요.",
            showConfirmButton: false,
            timer: 2000,
          })
          return 
        }

        const formData = {
          _id: this.listId,
          name: this.name.val,
          desc: description,
          areas: this.areas.val,
          thumbnail: this.file.val,
        }

        if (this.$route.path.split("/")[1] === "mypage") {
          await this.$store.dispatch("articles/updateArticle", formData)
          this.$router.replace({ name: "myList" })
          this.$swal.fire({
            icon: "success",
            title: `글 수정에 성공 하였습니다.`,
            showConfirmButton: false,
            timer: 2000,
          })
        } else {
          // 공고등록 경우는 Create
          this.$emit("save-data", formData)
        }
      }
    },

    focusEditor() {
      this.tuiEditor.focus()
    },

    async selectFile(e) {
      this.chosenFileName = e.target.files[0].name

      // 파일업로드 로직
      const uploadFile = new FormData()
      const fileToUpload = e.target.files[0]
      uploadFile.append("images", fileToUpload)

      try {
        await this.$store.dispatch("articles/uploadImage", {uploadFile, type:'thumbnail'})
        this.file.val = this.$store.getters["articles/getUploadFileName"]

        this.clearValidity("file")
      } catch (e) {
        this.file.isValid = false
        
        this.$swal.fire({
          icon: "error",
          title: e.message,
          showConfirmButton: false,
          timer: 2000,
        })
      }
    },

    swalAlert(title) {
      return this.$swal.fire({
        title: `${title} 하시겠습니까?`,
        text: `해당 글을 ${title}합니다.`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "네",
        cancelButtonText: "아니오",
      })
    },

    async addImageBlobHook(blob, callbacks) {
      const uploadFile = new FormData()
      uploadFile.append("images", blob)

      await this.$store.dispatch("articles/uploadImage", {uploadFile, type:'content'})
      callbacks(
        `${process.env.VUE_APP_API_URL}/images/${this.$store.getters["articles/getUploadFileName"]}`
      )
    },
  }
}
</script>

<style lang="scss" scoped>
:deep(.toastui-editor-contents) {
  font: inherit;
}

.form {
  &__control {
    margin: 1.6rem 0;

    .file-container {
      .file-label {
        background-color: $secondary-color;
        color: white;
        padding: 0.5rem;
        font-family: sans-serif;
        border-radius: 0.3rem;
        cursor: pointer;
      }

      .file-chosen {
        padding: 0.5rem;
        font-family: sans-serif;
        cursor: pointer;
      }
    }
  }

  &__caption {
    font-weight: bold;
    display: block;
    margin: 1.2rem 0 0.5rem 0;
  }

  &__input {
    display: block;
    width: 100%;
    border: 1px solid #ccc;
    font: inherit;

    &[type="text"] {
      padding: 0.5rem;
      border-radius: 5px;
    }

    &[type="checkbox"] {
      display: inline;
      width: auto;
      border: none;
    }

    &[type="checkbox"] + label {
      font-weight: normal;
      display: inline;
      margin: 0 0 0 0.5rem;
    }

    &:focus {
      /* background-color: $primary-bg-color; */
      outline: none;
      border-color: $color-grey-dark-1;
    }
  }

  &__btn-container {
    margin-top: 1.6rem;
    display: flex;
    justify-content: flex-end;

    * {
      font-size: 1rem;
      width: 7rem;
    }
  }

  .pointer{
    cursor: pointer;
  }
}

.invalid {
  label {
    color: red;
  }
  input {
    border: 1px solid red;
  }
}
</style>
