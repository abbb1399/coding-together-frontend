<template>
  <li class="article-list" @click.once="toDetail">
    <img :src="getListImage" alt="리스트 썸내일" />
    <div class="list-detail">
      <h3>{{ articleTitle }}</h3>
      <base-badge
        class="badge"
        v-for="area in areas"
        :key="area"
        :type="area"
        :title="area"
      />
    </div>
  </li>
</template>

<script>
import { toRefs, computed } from "vue"
import { useRoute, useRouter } from "vue-router"

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true
    },
    areas: {
      type: Array,
      required: true,
    },
    thumbnail: {
      type: String,
    },
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()

    const { id, thumbnail, title } = toRefs(props)

    const articleTitle = computed(()=>{
      return title.value.length > 13 ? title.value.slice(0,12) + '...' : title.value
    })

    const getListImage = computed(() => {
      return `${process.env.VUE_APP_API_URL}/images/${thumbnail.value}`
    })

    const toDetail = () => {
      router.push(route.path + "/" + id.value)
    }

    return {
      articleTitle,
      getListImage,
      toDetail,
    }
  },
}
</script>

<style lang="scss" scoped>
.article-list {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 1rem;
  
  h3{
    @media screen and (min-width: 1201px) and (max-width: 1799px) {
      font-size: 17.9px;
    }

    @include respond(tab-land){
      font-size: 15.7px;
    }

    @media screen and (min-width: 601px) and (max-width: 692px) {
      font-size: 13.5px;
    }

    @include respond(phone){
      font-size: 17px;
    }
  }

  img {
    width: 100%;
    border-radius: 5px;
    height: 10.6rem;
  }

  .list-detail {
    line-height: 1.4;
    
    .badge {
      font-size: 2px;
    }
  }
}
</style>
