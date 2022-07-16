<template>
  <span class="badge" :class="type">
    {{ badgeText }}
  </span>
</template>

<script>
import { computed, toRefs } from "vue"

export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const {title} = toRefs(props)

    const badgeText = computed(() => {
      if (title.value === "frontend") {
        return "프론트엔드"
      } else if (title.value === "backend") {
        return "백엔드"
      } else if (title.value === "publisher") {
        return "퍼블리셔"
      } else {
        return "모름"
      }
    })
    return {
      badgeText
    }
  },
}
</script>

<style scoped>
.badge {
  display: inline-block;
  border-radius: 30px;
  padding: 0.3rem 0.5rem;
  margin-right: 0.18rem;
  font-size: 0.625rem;
}

.frontend {
  background-color: #00B8A9;
  color: white;
}

.backend {
  background-color: #F6416C;
  color: white;
}

.publisher {
  background-color: #FEB139;
  color: white;
}
</style>
