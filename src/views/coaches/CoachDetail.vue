<template>
  <div>
    <section>
      <base-card>
        <h2>{{fullName}}</h2>
        <h3>{{rate}}원/시간</h3>
      </base-card>
    </section>
    <section>
      <base-card>
        <header>
          <h2>관심있나요? 지금 신청하세요!</h2>
          <base-button link :to="contactLink">연락하기</base-button>
        </header>
        <router-view></router-view>
      </base-card>
    </section>
    <section>
      <base-card>
        <base-badge v-for="area in areas" :key="area" :type="area" :title="area" ></base-badge>
        <p>{{description}}</p>
      </base-card>
    </section>
  </div>
</template>

<script>
export default {
  props:['id'],
  data(){
    return{
      selectedCoach:null
    }
  },
  computed:{
    fullName(){
      return this.selectedCoach.lastName
    },
    areas(){
      return this.selectedCoach.areas
    },
    rate(){
      return this.selectedCoach.hourlyRate
    },
    description(){
      return this.selectedCoach.description
    },
    contactLink(){
      // console.log(this.id)
      // console.log(this.$route.path )
      return this.$route.path + '/' + this.id + '/contact'
      // return this.$route.path + '/contact'
    }
  },
  created(){
    this.selectedCoach = this.$store.getters['coaches/coaches'].find(
      coach => coach.id = this.id
    )
  }
}
</script>