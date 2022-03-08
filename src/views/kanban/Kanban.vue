<template>
  <div class="boards-container">
    <div class="boards-container__board">
      <h1>Board One</h1>
      
      <div class="boards-container__board__card">Card #1</div>
      <div class="boards-container__board__card">Card #2</div>
      <div class="boards-container__board__card">Card #3</div>
      <div class="boards-container__board__card">Card #4</div>
    </div>
    <div class="boards-container__board">
      <h1>Board Two</h1>
      
      <div class="boards-container__board__card">Card #1</div>
      <div class="boards-container__board__card">Card #3</div>
      <div class="boards-container__board__card">Card #4</div>
    </div>
    <div class="boards-container__board">
      <h1>Board Three</h1>
      
      <div class="boards-container__board__card">Card #1</div>
    </div>
     <div class="boards-container__board">
      <h1>Board Four</h1>
      
      <div class="boards-container__board__card">Card #1</div>
      <div class="boards-container__board__card">Card #2</div>
      <div class="boards-container__board__card">Card #3</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .boards-container {
    display: grid;
    grid-auto-columns: 272px;
    grid-auto-flow: column;
    grid-gap: 8px;
    height: 100vh;
    overflow: auto;
    padding: .5rem;

    &__board{
      background: #EBECF0;
      border-radius: 3px;
      display: grid;
      grid-auto-rows: max-content;
      grid-gap: 10px;
      padding: 10px;

      h1 {
        font-size: 1rem;
        margin: 0 0 12px 0;
      }

      &__card{
        background: #FFF;
        box-shadow: 0 1px 0 rgba(9,30,66,.25);
        border-radius: 3px;
        padding: 10px;    
      }
    }   
  }

</style>