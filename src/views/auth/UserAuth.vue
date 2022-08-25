<template>
  <section class="auth">
    <!-- 에러 Dialog -->
    <base-dialog :show="!!error" title="에러 발생!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>

    <!-- 로딩 Dialog -->
    <base-dialog :show="isLoading" title="인증 중 입니다...." fixed>
      <base-spinner></base-spinner>
    </base-dialog>

    <!-- 입력 Form -->
    <base-card>
      <form class="auth__form" @submit.prevent="submitForm">
        <div class="auth__form-control text-center">
          <h1 v-if="mode === 'signup'">회원가입</h1>
          <h1 v-else>로그인</h1>
        </div>

        <div class="auth__form-control" v-if="mode === 'signup'">
          <label for="name">이름</label>
          <input type="text" id="name" v-model.trim="name" required v-focus maxlength="20"/>
        </div>

        <div class="auth__form-control">
          <label for="email">이메일</label>
          <input
            type="email"
            id="email"
            v-model.trim="email"
            required
            v-focus
            maxlength="30"
          />
        </div>

        <div class="auth__form-control">
          <label for="password">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model.trim="password"
            autocomplete="off"
            required
            maxlength="30"
          />
        </div>
        <p v-if="!formIsValid" class="invalid-message">
          유효한 이메일 과 비밀번호를 입력해주세요.(최소 6글자)
        </p>

        <div class="auth__btns">
          <p class="forgot-password" @click="forgotPassword">비밀번호를 잊으셨나요?</p>
          <div>
            <!-- 회원가입/로그인 -->
            <base-button>{{ submitButtonCaption }}</base-button>
            <!-- 회원가입/로그인 하러가기-->
            <base-button
              class="btnTwo"
              type="button"
              mode="secondary"
              @click="switchAuthMode"
            >
              {{ switchModeButtonCaption }}
            </base-button>
          </div>
        </div>
      </form>
    </base-card>
  </section>
</template>

<script>
import { ref, computed, inject } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useStore } from "vuex"

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const $swal = inject("$swal")

    const name = ref("")
    const email = ref("")
    const password = ref("")
    const formIsValid = ref(true)
    const mode = ref("login")
    const isLoading = ref(false)
    const error = ref(null)

    const submitButtonCaption = computed(() => {
      if (mode.value === "login") {
        return "로그인"
      } else {
        return "회원가입"
      }
    })

    const switchModeButtonCaption = computed(() => {
      if (mode.value === "login") {
        return "회원가입하러 가기"
      } else {
        return "로그인하러 가기"
      }
    })

    const submitForm = async () => {
      formIsValid.value = true
      if (email.value === "" || !email.value.includes("@") || password.value.length < 6) {
        formIsValid.value = false
        return
      }

      isLoading.value = true

      const userInfo = {
        name: name.value,
        email: email.value,
        password: password.value,
      }

      try {
        if (mode.value === "login") {
          // 로그인
          await store.dispatch("login", userInfo)
        } else {
          // 회원가입
          await store.dispatch("signup", userInfo)
          // Kanban 게시판 3개 생성
          for (let index = 0; index <= 2; index++) {
            await store.dispatch('kanbans/registerKanban',{title:`Board ${index+1}`, order:index})
          }
        }

        const redirectUrl = "/" + (route.query.redirect || "articles")
        router.replace(redirectUrl)
      } catch (err) {
        error.value = err.message
      }

      isLoading.value = false
    }

    const switchAuthMode = () => {
      email.value = ''
      password.value = ''
      formIsValid.value = true

      if (mode.value === "login") {
        mode.value = "signup"
        name.value = ''
      } else {
        mode.value = "login"
      }
    }

    const handleError = () => {
      error.value = null
    }

    const forgotPassword = async () => {
      const { value: email } = await $swal.fire({
        title: '비밀번호 찾기',
        input: 'email',
        inputLabel: '새로운 비밀번호를 발송합니다.',
        showCloseButton: true,
        inputPlaceholder: '당신의 이메일을 입력해주세요.',
        confirmButtonColor: "#34c38f",
        confirmButtonText: "제출",
        validationMessage:'유효하지 않은 이메일 입니다.'
      })

      if (email) {
        $swal.fire(`Entered email: ${email}`)
      }
    }

    return {
      error,
      isLoading,
      mode,
      name,
      email,
      password,
      formIsValid,
      submitButtonCaption,
      switchModeButtonCaption,
      switchAuthMode,
      handleError,
      submitForm,
      forgotPassword
    }
  }
}
</script>

<style lang="scss" scoped>
.auth{
  &__form{
    margin: 1rem;
    padding: 1rem;
  }

  &__form-control {
    margin: 0.5rem 0 1rem 0;
  }

  &__btns{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2.5rem;

    .forgot-password{
      color: #0969da;
      cursor: pointer;
      font-weight: 500;
    }

    .btnTwo{
      margin-left:0.2rem;
    }
  }

  label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
  }

  input {
    display: block;
    width: 100%;
    font: inherit;
    border: 1px solid #ccc;
    padding: 0.3125rem;
    border-radius: 5px;

    &:focus {
      border-color: $primary-color;
      background-color: $primary-bg-color;
      outline: none;
    }
  }

  .invalid-message{
    color: red;
  }
}
</style>
