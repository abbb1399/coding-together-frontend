<template>
  <li class="article-item" @click.once="toDetail">
    <img :src="getListImage" alt="리스트 썸내일" />
    <div class="article-item__detail">
      <h4 class="item-title" :title="title">{{ title }}</h4>
      <base-badge
        class="item-badge"
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

    const { id, thumbnail } = toRefs(props)

    const getListImage = computed(() => {
      return `${process.env.VUE_APP_API_URL}/images/${thumbnail.value}`
    })

    const toDetail = () => {
      router.push(route.path + "/" + id.value)
    }

    return {
      getListImage,
      toDetail,
    }
  },
}
</script>

<style lang="scss" scoped>
.article-item {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 1rem;

  img {
    width: 100%;
    border-radius: 5px;
    height: 10.6rem;
  }

  &__detail {
    line-height: 1.6;

    .item-title{
      @include shortenText;
 
      /* 여러 줄 */
      /* display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-wrap: break-word; */
    }
  }
}
</style>
