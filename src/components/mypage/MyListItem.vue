<template>
  <li class="my-list" @click="toListDetail">
    <img class="my-list__img" alt="유저 프로필" :src="img" />
    <div class="my-list__group">
      <p class="group__title" :title="title">{{ title }}</p>
      <base-badge
        class="group__badge"
        v-for="area in areas"
        :key="area"
        :type="area"
        :title="area"
      ></base-badge>
    </div>
    <!-- <p class="my-list__completed">{{listCompleted}}</p> -->
    <p>{{ listCreatedAt }}</p>
  </li>
</template>

<script>
import { toRefs, computed, inject } from "vue";
import { useRouter } from "vue-router";

export default {
  props: {
    id: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    areas: {
      type: Array,
    },
    thumbnail: {
      type: String,
    },
    createdAt: {
      type: String,
    },
    // completed:{
    //   type:Boolean,
    // }
  },
  setup(props) {
    const router = useRouter();
    const $moment = inject("$moment");
    const { thumbnail, createdAt, id } = toRefs(props);

    const img = computed(() => {
      return `${process.env.VUE_APP_API_URL}/images/${thumbnail.value}`;
    });

    const listCreatedAt = computed(() => {
      return $moment(createdAt.value).format("YYYY-MM-DD");
    });

    // const listCompleted= computed(()=>{
    //   return completed.value ? '구인 완료' : '구인 중'
    // })

    const toListDetail = () => {
      router.push({ name: "myListDetail", params: { id: id.value } });
    };

    return {
      img,
      listCreatedAt,
      // listCompleted,
      toListDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
.my-list {
  display: flex;
  margin: 1rem 0;
  border-bottom: 1px solid $color-grey-light;
  border-radius: 5px;
  padding: 1rem;
  cursor: pointer;

  &__img {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 5px;
  }

  &__group {
    margin-left: 0.9rem;
    margin-right: auto;
    width: 58%;

    .group__title {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;

      @include shortenText;
    }
  }

  &__completed {
    margin-left: 0.9rem;

    font-size: 0.9rem;
    font-weight: 600;
    color: $color-grey-dark-2;
  }
}
</style>
