<template>
  <section class="change-password">
    <h2 class="change-password__title">비밀번호 변경</h2>

    <form @submit.prevent="changePassword">
      <div class="change-password__form-control" :class="{ invalid: !oldPassword.isValid }">
        <label for="old-password">현재 비밀번호</label>
        <input
          type="password"
          id="old-password"
          v-model.trim="oldPassword.val"
          autocomplete="off"
          required
          maxlength="30"
          @blur="clearValidity('old-password')"
        />
      </div>

      <div class="change-password__form-control" :class="{ invalid: !newPassword.isValid }">
        <label for="new-password">새 비밀번호</label>
        <input
          type="password"
          id="new-password"
          v-model.trim="newPassword.val"
          autocomplete="off"
          required
          maxlength="30"
          @blur="clearValidity('new-password')"
        />
      </div>

      <div class="change-password__form-control" :class="{ invalid: !confirmPassword.isValid }">
        <label for="confirm-password">새 비밀번호 확인</label>
        <input
          type="password"
          id="confirm-password"
          v-model.trim="confirmPassword.val"
          autocomplete="off"
          required
          maxlength="30"
          @blur="clearValidity('confirm-password')"
        />
      </div>

      <p v-if="!formIsValid" class="change-password__err-msg">{{ errMsg }}</p>

      <base-button class="change-password__send-btn">비밀번호 변경</base-button>
    </form>
  </section>
</template>

<script>
import { ref, reactive, inject } from "vue"
import { useStore } from "vuex"
import useUnreadRequests from '../../../hooks/use-unread-requests'

export default {
  setup() {
    const store = useStore()
    const $swal = inject("$swal")

    const oldPassword = reactive({ val: "", isValid: true })
    const newPassword = reactive({ val: "", isValid: true })
    const confirmPassword = reactive({ val: "", isValid: true })
    const formIsValid = ref(true)
    const errMsg = ref("")

    const { unreadRequestsCount } = useUnreadRequests()

    const clearValidity = (input) => {
      if (input === "old-password") {
        oldPassword.isValid = true
      } else if (input === "new-password") {
        newPassword.isValid = true
      } else if (input === "confirm-password") {
        confirmPassword.isValid = true
      }
    }

    const validateForm = () => {
      formIsValid.value = true

      if (oldPassword.val.length < 6) {
        oldPassword.isValid = false
        formIsValid.value = false
        errMsg.value = "비밀번호는 최소 6자 입니다."
      }
      if (newPassword.val.length < 6) {
        newPassword.isValid = false
        formIsValid.value = false
        errMsg.value = "비밀번호는 최소 6자 입니다."
      }
      if (confirmPassword.val.length < 6) {
        confirmPassword.isValid = false
        formIsValid.value = false
        errMsg.value = "비밀번호는 최소 6자 입니다."
      }
      if (newPassword.val !== confirmPassword.val) {
        confirmPassword.isValid = false
        formIsValid.value = false
        errMsg.value = "새 비밀번호를 다시 확인 해주세요."
      }
    }

    const changePassword = async () => {
      validateForm()

      if (!formIsValid.value) {
        return
      }

      const result = await $swal.fire({
        title: "비밀번호 변경",
        text: "비밀번호를 변경 하시겠습니까?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "네",
        cancelButtonText: "아니오",
      })

      if (result.isConfirmed) {
        try {
          await store.dispatch("changePassword", {
            oldPassword: oldPassword.val,
            newPassword: newPassword.val,
          })

          oldPassword.val = ""
          newPassword.val = ""
          confirmPassword.val = ""

          $swal.fire({
            icon: "success",
            title: "비밀번호를 변경하였습니다.",
            showConfirmButton: false,
            timer: 2000,
          })
        } catch (e) {
          $swal.fire({
            icon: "error",
            title: e.message,
            showConfirmButton: false,
            timer: 2000,
          })
        }
      }
    }

    unreadRequestsCount()

    return {
      errMsg,
      formIsValid,
      oldPassword,
      newPassword,
      confirmPassword,
      changePassword,
      clearValidity,
    }
  },
}
</script>

<style lang="scss" scoped>
.change-password {
  &__form-control {
    margin: 0.5rem 0 1rem 0;
  }

  &__send-btn {
    margin-top: 1.5rem;
  }

  &__err-msg {
    margin-top: 1.5rem;
  }

  &__title {
    text-align: center;
    margin-bottom: 3rem;
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  input {
    display: block;
    width: 50%;
    font: inherit;
    border: 1px solid #ccc;
    padding: 0.3125rem;
    border-radius: 5px;

    &:focus {
      border-color: $primary-color;
      outline: 1px solid $primary-color;
    }
  }

  .invalid {
    label {
      color: red;
    }
    input {
      border: 1px solid red;
      outline: 1px solid red;
    }
  }
}
</style>
