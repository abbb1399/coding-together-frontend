<template>
  <base-card class="auth">
    <!-- 에러 Dialog -->
    <base-dialog :show="!!error" title="로그인 실패" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>

    <!-- 로딩 Dialog -->
    <base-dialog :show="isLoading" title="인증 중 입니다..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>

    <form class="auth__form" @submit.prevent="submitForm">
      <h1 v-if="mode === 'signup'">회원가입</h1>
      <h1 v-else>로그인</h1>

      <div v-if="mode === 'signup'" class="form-group">
        <input
          type="text"
          id="name"
          v-model.trim="name"
          required
          maxlength="20"
          placeholder="이름"
        />
        <label for="name">이름</label>
      </div>

      <div class="form-group">
        <input
          id="email"
          type="email"
          v-model.trim="email"
          required
          maxlength="30"
          placeholder="이메일"
        />
        <label for="email">이메일</label>
      </div>

      <div class="form-group">
        <input
          id="password"
          type="password"
          v-model.trim="password"
          autocomplete="off"
          required
          maxlength="30"
          placeholder="비밀번호"
        />
        <label for="password">비밀번호</label>
      </div>

      <p v-if="!formIsValid" class="auth__warning">
        비밀번호는 최소 6자 입니다.
      </p>

      <p v-if="mode === 'login'" class="auth__forgot" @click="forgotPassword">
        비밀번호를 잊으셨나요?
      </p>

      <base-button class="login-btn" :class="{ 'mg-top': mode === 'signup' }">
        {{ mode === "login" ? "로그인" : "회원가입" }}
      </base-button>
    </form>

    <section class="auth__panel">
      <div>
        <h1>{{ mode === "signup" ? "로그인" : "회원가입" }}</h1>
        <p>{{ loginSignupMessage }}</p>
        <base-button class="signup-btn" @click="switchAuthMode">
          {{ mode === "login" ? "회원가입하러 가기" : "로그인하러 가기" }}
        </base-button>
      </div>
    </section>
  </base-card>
</template>

<script>
import { ref, computed, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const $swal = inject("$swal");

    const name = ref("");
    const email = ref("");
    const password = ref("");
    const formIsValid = ref(true);
    const mode = ref("login");
    const isLoading = ref(false);
    const error = ref(null);

    const loginSignupMessage = computed(() => {
      if (mode.value === "login") {
        return "회원가입하고 서비스를 이용해주세요.";
      } else {
        return "로그인 화면으로 돌아가시겠습니까?";
      }
    });

    const submitForm = async () => {
      formIsValid.value = true;
      if (
        email.value === "" ||
        !email.value.includes("@") ||
        password.value.length < 6
      ) {
        formIsValid.value = false;
        return;
      }

      isLoading.value = true;

      const userInfo = {
        name: name.value,
        email: email.value,
        password: password.value,
      };

      try {
        if (mode.value === "login") {
          // 로그인
          await store.dispatch("login", userInfo);
        } else {
          // 회원가입
          await store.dispatch("signup", userInfo);
          // Kanban 게시판 3개 생성
          for (let index = 0; index <= 2; index++) {
            await store.dispatch("kanbans/registerKanban", {
              title: `Board ${index + 1}`,
              order: index,
            });
          }
        }

        const redirectUrl = "/" + (route.query.redirect || "articles");
        router.replace(redirectUrl);
      } catch (err) {
        error.value = err.message;
      }

      isLoading.value = false;
    };

    const switchAuthMode = () => {
      email.value = "";
      password.value = "";
      formIsValid.value = true;

      if (mode.value === "login") {
        mode.value = "signup";
        name.value = "";
      } else {
        mode.value = "login";
      }
    };

    const handleError = () => {
      error.value = null;
    };

    const forgotPassword = async () => {
      const { value: email } = await $swal.fire({
        title: "비밀번호 찾기",
        input: "email",
        inputLabel: "새로운 비밀번호를 발송합니다.",
        showCloseButton: true,
        inputPlaceholder: "당신의 이메일을 입력해주세요.",
        confirmButtonColor: "#34c38f",
        confirmButtonText: "제출",
        validationMessage: "유효하지 않은 이메일 입니다.",
      });

      if (email) {
        await store.dispatch("findPassword", { email });
        $swal.fire({
          icon: "success",
          title: `${email}로 새로운 비밀번호가 발송 되었습니다.`,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    };

    return {
      error,
      isLoading,
      mode,
      name,
      email,
      password,
      formIsValid,
      loginSignupMessage,
      switchAuthMode,
      handleError,
      submitForm,
      forgotPassword,
    };
  },
};
</script>

<style lang="scss" scoped>
.auth {
  display: flex;
  max-width: 50rem;
  height: 32rem;
  margin: 3rem auto;

  @include respond(big-screen) {
    margin-top: 5rem;
  }

  @include respond(phone) {
    flex-direction: column;
    margin-bottom: 0;
    margin-top: 3rem;
  }

  @include respond(small-screen) {
    height: 100%;
  }

  &__form {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 3.2rem;

    @include respond(phone) {
      width: 100%;
    }

    h1 {
      margin-bottom: 2.5rem;
    }

    .form-group {
      width: 100%;
      margin-bottom: 0.7rem;

      input {
        background-color: #ededee;
        border: none;
        border-radius: 5px;
        padding: 0.75rem 0.93rem;
        width: 100%;

        &:focus {
          border-color: $primary-color;
          outline: 2px solid $primary-color;
        }
      }

      label {
        font-size: 0.75rem;
        font-weight: 700;
        color: $color-grey-dark-2;
        display: block;
        margin-top: 0.3rem;
        margin-left: 1.25rem;
        transition: all 0.3s;
      }

      input:placeholder-shown + label {
        opacity: 0;
        visibility: hidden;
        transform: translateY(-40px);
      }
    }

    .login-btn {
      @include respond(phone) {
        font-size: 1rem;
        padding: 1rem 5rem;
      }
    }
  }

  &__panel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    background: linear-gradient(
      to right,
      lighten($primary-color, 4%),
      $primary-color
    );
    text-align: center;
    border-radius: 0 12px 12px 0;

    @include respond(phone) {
      width: 100%;
      border-radius: 0;
      margin-top: 2rem;
      padding: 5rem;
    }

    h1 {
      color: white;
    }

    p {
      margin-top: 1.25rem;
      margin-bottom: 1.875rem;
      color: white;
      font-size: 0.875rem;
    }

    .signup-btn {
      background-color: transparent;
      border-color: #ffffff;

      @include respond(phone) {
        padding: 1rem 3rem;
        font-size: 1rem;
      }
    }
  }

  @mixin message {
    font-size: 0.875rem;

    @include respond(phone) {
      font-size: 1rem;
    }
  }

  &__warning {
    color: red;
    margin-top: 0.5rem;

    @include message;
  }

  &__forgot {
    color: $color-grey-dark-3;
    margin: 0.93rem 0;
    cursor: pointer;

    @include message;
  }

  button {
    padding: 0.75rem 2.81rem;
    transition: all 0.3s;
  }

  button:hover {
    transform: scale(1.05);
  }

  .mg-top {
    margin-top: 1.4rem;
  }
}
</style>
