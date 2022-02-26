<template>
 <div>
   <br>
   <br>
   <br>
   <br>

    <!-- actual upload which is hidden -->
    <input type="file" id="actual-btn" hidden @change="test"/>

    <!-- our custom upload button -->
    <label for="actual-btn">Choose File</label>

    <!-- name of file chosen -->
    <span id="file-chosen">{{chosenFileName}}</span>
 </div>
</template>

<script>
export default {
  data(){
    return{
      chosenFileName: '파일 첨부'
    }
  },

  methods:{
    test(e){
      this.chosenFileName = e.target.files[0].name
    }
  }
}
</script>

<style lang="scss" scoped>
  label {
    background-color: indigo;
    color: white;
    padding: 0.5rem;
    font-family: sans-serif;
    border-radius: 0.3rem;
    cursor: pointer;
    margin-top: 1rem;
  }

  #file-chosen{
    margin-left: 0.3rem;
    font-family: sans-serif;
  }
</style>