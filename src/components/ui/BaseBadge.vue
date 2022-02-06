<template>
  <span class="badge" :class="type">
    {{text}}
  </span>
</template>

<script>
export default {
  props:{
    type:{
      type:String,
      required:true
    },
    title:{
      type:String,
      required:true
    }
  },
  computed:{
    text(){
      const title = this.title

      if(title === 'frontend'){
        return '프론트엔드'
      }else if(title === 'backend'){
        return '백엔드'
      }else if(title === 'publisher'){
        return '퍼블리셔'
      }else {
        return '모름'
      } 
    }
  }
}
</script>

<style scoped>
  .badge {
    background-color: #ccc;
    color: #252525;
    border-radius: 30px;
    padding: 0.5rem 1.5rem;
    display: inline-block;
    margin-right: 0.5rem;
  }

  .frontend {
    background-color: #3d008d;
    color: white;
  }

  .backend {
    background-color: #71008d;
    color: white;
  }

  .publisher {
    background-color: #8d006e;
    color: white;
  }
</style>