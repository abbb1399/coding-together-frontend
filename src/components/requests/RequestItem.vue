<template>
  <li>
    <div>
      <a :href="emailLink"> {{ email }} </a>
    </div>
    <p>{{message}}</p>
  </li>
</template>

<script>
export default {
  props:{
    email:{
      type:String,
      required:true
    },
    message:{
      type:String,
      required:true
    }
  },
  computed:{
    emailLink(){
      return 'mailto:' + this.email
    }
  },
  created(){
 
  }
}
</script>

<style lang="scss" scoped>
  li {
    margin: 1.6rem 0;
    border: 1px solid #ccc;
    padding: 1.6rem;
  }

  a {
    color: #3d008d;
    text-decoration: none;
    font-weight: bold;
  
    &:hover,
    &:active{
       color: #8d007a;
    }    
  }


  p {
    margin: .8rem 0 0 0;
  }
</style>