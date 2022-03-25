<template>
  <li class="article-list" @click.once="toDetail" >
    <img :src="getListImage" alt="리스트 썸내일">
    <div>
      <h3>{{ name }} by {{owner.name}} </h3>
      <base-badge v-for="area in areas" :key="area" :type="area" :title="area"></base-badge>
    </div>
  </li>
</template>

<script>
import {toRefs, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'

export default {
  props:{
    id:{
      type:String,
      required:true
    },
    name:{
      type:String,
      required:true
    },
    areas:{
      type:Array,
      required:true
    },
    owner:{
      type:Object,
    },
    thumbnail:{
      type:String,
    },
  },
  setup(props){
    const route = useRoute()
    const router = useRouter()

    const {id,thumbnail} = toRefs(props)

    const getListImage = computed(() => {
      return `http://localhost:3000/images/${thumbnail.value}`
    })

    const toDetail = () =>{
      router.push(route.path + '/' + id.value)
    }
 
    return{
      getListImage,
      toDetail
    }
  }
}
</script>

<style lang="scss" scoped>
  .article-list{
    display: flex;
    flex-direction: column;

    border-radius: 5px;
    cursor:pointer;

    margin-bottom: 1rem;

    h3{
      font-size: 1rem;
      margin: 0.625rem 0;
      line-height: 1.3;
    }

    img{
      width: 100%;
      border-radius: 5px;
      height: 10.6rem;
    }
  }
</style>