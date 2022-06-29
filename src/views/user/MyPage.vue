<template>
  <div>
    <section class="my-page">
      <div class="my-page__grid">
        <aside id="categories" class="my-page__card">
          <h2>내 정보</h2>
          <ul class="my-page__list">
            <li>
              <router-link to="/mypage/profile">프로필</router-link>
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
  </div>
</template>


<style lang="scss" scoped>
  .my-page{
    max-width: 1100px;
    margin: auto;
    padding: 0 2rem;
    overflow: hidden;
  
    h2{
      margin-bottom: 1rem;
    }

    &__grid{
      display: grid;
      grid-template-columns: 2fr 5fr;
      margin: 2rem 0;
      gap: 1.5rem;
    }

    &__card{
      background: #fff;
      padding: 1rem;
    }

    &__list{
      li{
         padding: .5rem 0;
        border-bottom:  #555 dotted 1px;
        width: 90%;
        list-style: inside;

        a{
          color: #333;
        
          &.router-link-active {
            color: $primary-color;
          }
        }
      }
    }
  }
</style>