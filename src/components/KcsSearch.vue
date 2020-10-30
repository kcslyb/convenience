<template>
  <van-search
    :placeholder="placeholder"
    @input="handleSearch"
    @search="handleSearch"
  >
  </van-search>
</template>

<script>
import { Search } from 'vant'
export default {
  name: 'KcsSearch',
  components: {
    VanSearch: Search
  },
  props: {
    placeholder: {
      type: String,
      default: '请输入关键字搜索'
    },
    filters: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleSearch (value) {
      this.$emit('on-search', value)
    }
  }
}
</script>

<style scoped>

</style>
