<template>
  <div class="hello">
    <header>
    </header>

    <div v-for="(item,index) in list" :key="index">
      <div style="height:200px;">
        {{item.name}}
      </div>
    </div>

    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';


export default {
  components:{
    InfiniteLoading
  },
  data(){
    return{
      page:0,
      list:[]
    }
  },
  methods:{
    async infiniteHandler($state){
      await this.$store.dispatch('coaches/moreLoadCoaches', this.page)
      const array = this.$store.getters['coaches/coaches']
      console.log(array)
      // console.log('배열 갯수 : '+array)

      if(array.length){
        this.list.push(...array)
        $state.loaded()
        this.page += 2
      }else{
        $state.complete()
      }
    }
  }
}
</script>

