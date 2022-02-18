<template>
  <li @click="toDetail" >
    <img id="list-img" src="../../assets/ent1.jpg" alt="">
    <div>
      <base-badge v-for="area in areas" :key="area" :type="area" :title="area"></base-badge>
      <h3>{{ name }} by {{ownerName}}</h3>
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
    },
    thumbnail:{
      type:String,
    },
  },
  data(){
    return{
      ownerName:''
    }
  },
  computed:{
    coachContactLink(){ 
      return this.$route.path + '/' + this.owner + '/contact'
    },
    coachDetailsLink(){
      return this.$route.path + '/' + this.owner
    },
  },
  async created(){
    await this.getOnwerName()
    this.getListImage()
  },
  methods:{
    async getOnwerName(){
      await this.$store.dispatch('fetchAllUsersInfo', this.owner)
      this.ownerName = this.$store.getters.getUsersInfo.name
    },
    async getListImage(){
      if(this.thumbnail){
        await this.$store.dispatch('coaches/fetchListImage',this.thumbnail)
        document.querySelector('#list-img').src = `http://localhost:3000/images/${this.thumbnail}`
      }
    },
    toDetail(){
      this.$router.push(this.$route.path + '/' + this.owner)
    }
  }
}
</script>

<style scoped>
  li{
    display: flex;
    border-radius: 5px;
    background: #fff;
    padding: 1.6rem;
    grid-gap: 1.6rem;
    cursor:pointer;
    /* align-items: center; */    
  }

  h3{
    margin-top: 1rem;
    line-height: 1.3;
  }

  img{
    width: 50%;
    border-radius: 5px;
    width: 255px;
    height: 170px;
  }
</style>