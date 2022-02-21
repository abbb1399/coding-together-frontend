<template>
  <section>
    <div class="container">
      <div class="page-container">
        <aside id="categories" class="card">
          <h2>내 정보</h2>
          <ul class="list">
            <li @click="selectComponent('my-profile')">
              <a :class="{ 'profile-class': currentClass === 'my-profile'}">프로필</a>
            </li>
            <li @click="selectComponent('my-list')">
              <a :class="{ 'list-class': currentClass === 'my-list'}">내가 쓴 공고</a>
            </li>
          </ul>
        </aside>
        <article class="card">
          <component :is="selectedComponent"></component>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import MyList from '../../components/mypage/MyList.vue'
import MyProfile from '../../components/mypage/MyProfile.vue'

export default {
  components:{
    MyList,
    MyProfile
  },
  data(){
    return{
      selectedComponent: 'my-profile',
      currentClass:'my-profile'
    }
  },
  methods:{
    selectComponent (cmp) {
      this.currentClass = cmp
      this.selectedComponent = cmp
    },
  }
}
</script>

<style lang="scss" scoped>
  h2{
    margin-bottom: 1rem;
  }

  .container{
    max-width: 1100px;
    margin: auto;
    padding: 0 2rem;
    overflow: hidden;
  }

  .page-container{
    display: grid;
    grid-template-columns: 2fr 5fr;
    margin: 2rem 0;
    gap: 1.5rem;
  }

  .card{
    background: #fff;
    padding: 1rem;
  }

  .l-heading{
    font-size: 3rem;
  }

  .list li{
    padding: .5rem 0;
    border-bottom:  #555 dotted 1px;
    width: 90%;
    list-style: inside;

    a{
      cursor:pointer;      
    }
  }

  .profile-class{
    color: $primary-color;
  }

  .list-class{
    color: $primary-color;
  }
</style>