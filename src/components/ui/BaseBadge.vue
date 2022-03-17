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
  padding: 0.5rem 0.875rem;
  margin-right: 0.18rem;
  font-size: 0.625rem;
}

.frontend {
  background-color: #3d008d;
  color: white;
}

.backend {
  background-color: #71008d;
  color: white;
}

.publisher {
  background-color: #8d006e;
  color: white;
}
</style>
