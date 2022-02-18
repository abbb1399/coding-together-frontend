<template>
  <base-card>
    <h2>동료 찾기</h2>
    <span class="filter-option">
      <input type="checkbox" id="frontend" checked @change="setFilter">
      <label for="frontend">프론트엔드</label>
    </span>
    <span class="filter-option">
      <input type="checkbox" id="backend" checked @change="setFilter"/>
      <label for="backend">백엔드</label>
    </span>
    <span class="filter-option">
      <input type="checkbox" id="publisher" checked @change="setFilter"/>
      <label for="publisher">퍼블리셔</label>
    </span>
  </base-card>
</template>

<script>
export default {
  emits:['change-filter'],
  data(){
    return{
      filters:{
        frontend:true,
        backend:true,
        publisher:true
      }
    }
  },
  methods:{
    setFilter(event){
      // console.log(event.target.id)
      // console.log(event.target.checked)

      const inputId = event.target.id   
      const isActive = event.target.checked
      const updatedFilters ={
        ...this.filters,
        [inputId]: isActive
      }
      this.filters = updatedFilters
      this.$emit('change-filter',updatedFilters)
    }
  }
}
</script>

<style lang="scss" scoped>
  h2 {
    margin: .8rem 0;
  }

  .filter-option {
    margin-right: 1.6rem;

    label,input{
      vertical-align: middle;
    }
  
    label{
      margin-left: .4rem;
    }
  
    &.active label{
      font-weight: bold;
    }
  }
</style>