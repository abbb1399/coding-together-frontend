<template>
  <section class="my-page">
    <div class="my-page__grid">
      <aside id="categories" class="my-page__card">
        <h2>내 정보</h2>
        <ul class="my-page__list">
          <li>
            <router-link to="/mypage/profile">내 정보</router-link>
          </li>
          <li>
            <router-link to="/mypage/change-password">비밀번호 변경</router-link>
          </li>
          <li>
            <router-link to="/mypage/list">내가 쓴 공고</router-link>
          </li>
        </ul>
      </aside>
      <article class="card">
        <router-view v-slot="slotProps">
          <transition name="route" mode="out-in">
            <component :is="slotProps.Component"></component>
          </transition>
        </router-view>
      </article>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.my-page {
  max-width: 1100px;
  margin: auto;
  padding: 0 2rem;
  overflow: hidden;

  h2 {
    margin-bottom: 1rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: 2fr 5fr;
    margin: 2rem 0;
    gap: 1.5rem;

    @include respond(phone) {
      grid-template-rows: 20vh min-content;
      grid-template-columns: auto;
    }
  }

  &__card {
    background: #fff;
    padding: 1rem;
  }

  &__list {
    li {
      padding: 0.5rem 0;
      border-bottom: #555 dotted 1px;
      width: 90%;
      list-style: inside;

      a {
        color: $color-grey-dark-3;
        font-weight: 600;

        &.router-link-active {
          color: $primary-color;
        }
      }
    }
  }
}
</style>
