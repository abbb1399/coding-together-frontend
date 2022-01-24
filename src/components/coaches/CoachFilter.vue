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

<style scoped>
  h2 {
    margin: 0.5rem 0;
  }

  .filter-option {
    margin-right: 1rem;
  }

  .filter-option label,
  .filter-option input{
    vertical-align: middle;
  }

  .filter-option label{
    margin-left: 0.25rem;
  }

  .filter-option.active label{
    font-weight: bold;
  }
</style>