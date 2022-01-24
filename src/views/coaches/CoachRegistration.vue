<template>
  <section>
    <base-card>
      <h2>지금 코치로 등록하세요!</h2>
      <coach-form @save-data="saveData"></coach-form>
    </base-card>
  </section>
</template>

<script>    
import CoachForm from '../../components/coaches/CoachForm.vue'

export default {
  components:{
    CoachForm
  },
  methods:{
    async saveData(data){
      await this.$store.dispatch('coaches/registerCoach',data)
      this.$router.replace('/coaches')
    }
  }
}
</script>