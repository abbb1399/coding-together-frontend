<template>
  <base-card>
    <h1>hihihihihhi</h1>
  </base-card>
</template>

<script>
export default {
  data(){
    return{

    }
  },
  async created(){
    await this.$store.dispatch('fetchMyInfo')
    console.log(this.$store.getters.getMyInfo)
  },
  methods:{

  }

}
</script>