<template>
  <div class="wrapper">
    <div class="circonf-wrapper">
      <div class="circonf circonf-1"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.circonf-wrapper{
 text-align:center;
}
.circonf {
  margin: 1em;
  display:inline-block;
  width: 2em;
  height: 2em;
  border-radius:50%;
  border:4px solid silver;
  animation: circ-anim .7s linear infinite;
}
.circonf-1 {
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
