<template>
  <li>
    <h3>{{ name }} by {{owner}}</h3>

    <div>
      <base-badge v-for="area in areas" :key="area" :type="area" :title="area"></base-badge>
    </div>

    <div class="actions">
      <base-button mode="outline" link :to="coachContactLink">연락</base-button>
      <base-button link :to="coachDetailsLink">상세보기</base-button>
    </div>
  </li>
</template>

<script>
export default {
  props:{
    name:{
      type:String,
      required:true
    },
    areas:{
      type:Array,
      required:true
    },
    owner:{
      type:String,
    }
  },
  computed:{
    coachContactLink(){ 
      return this.$route.path + '/' + this.owner + '/contact'
    },
    coachDetailsLink(){
      return this.$route.path + '/' + this.owner
    },
    getUsersInfo(){
      return this.$store.getters.getUsersInfo
    },
    getOwner(){
      const usersInfo = this.$store.getters.getUsersInfo
      const [matchedOwner]= usersInfo.filter((info) => info._id === this.owner)
      return matchedOwner.name
    }
  },
  async created(){
    // console.log(this.$store.getters.getUsersInfo)
  } 
}
</script>

<style scoped>
  li{
    margin: 1rem 0;
    border: 1px solid #424242;
    border-radius: 12px;
    padding: 1rem;
  }

  h3{
    font-size: 1.5rem;
  }

  h3,
  h4{
    margin: 0.5rem 0;
  }

  div{
    margin: 0.5rem 0;
  }

  .actions{
    display: flex;
    justify-content: flex-end;
  }
</style>