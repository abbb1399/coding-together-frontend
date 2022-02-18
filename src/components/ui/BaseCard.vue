<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped>
  .card{
    border-radius: 1.2rem;
    box-shadow:0 .2rem .8rem rgba(0, 0, 0, 0.26);
    /*  */
    padding: 1.6rem;
    /*  */
    margin: 3.2rem auto;
    
    max-width: 64rem;
    background: #fff;
  }
</style>