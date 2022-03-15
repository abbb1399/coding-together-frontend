<template>
  <div class="text-center">
    <div class="circonf"></div>
  </div>
</template>

<style lang="scss" scoped>
  .circonf {
    margin: 0 auto;
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid silver;
    animation: circ-anim 0.7s linear infinite;
    border-bottom-color: grey;
  }

  @keyframes circ-anim {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
