<template>
  <li>
    <div>
      <a :href="emailLink"> {{ email }} </a>
    </div>
    <p>{{name}}</p>
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
    },
    name:{
      type:String,
      required: true
    }
  },
  computed:{
    emailLink(){
      return 'mailto:' + this.email
    }
  },
  async created(){
   
  
  }
}
</script>

<style lang="scss" scoped>
  li {
    margin: 1rem 0;
    border: 1px solid #ccc;
    padding: 1rem;
  }

  a {
    color: $primary-color;
    text-decoration: none;
    font-weight: bold;
  
    &:hover,
    &:active{
       color: $primary-color-dark-1;
    }    
  }

  p {
    margin: .8rem 0 0 0;
  }
</style>