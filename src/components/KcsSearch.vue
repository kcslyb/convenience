<template>
  <div>
    <van-search
      :placeholder="placeholder"
      @input="handleSearch"
      @search="handleSearch"
    >
      <template #right-icon>
        <van-icon v-show="showRightIcon" size="16" color="#0B2F30" name="weapp-nav" @click="searchRightClick"/>
      </template>
    </van-search>
    <van-popup
      v-model="showMore"
      position="right"
      :style="{height: '100%', width: '80%'}"
      @close="onPopupClose">
      <kcs-search-item v-model="searchData"></kcs-search-item>
    </van-popup>
  </div>
</template>

<script>
import { Search, Icon, Popup } from 'vant'
import KcsSearchItem from '@/components/KcsSearchItem'
export default {
  name: 'KcsSearch',
  components: {
    KcsSearchItem,
    VanSearch: Search,
    VanPopup: Popup,
    VanIcon: Icon
  },
  props: {
    showRightIcon: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入关键字搜索'
    },
    filters: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showMore: false,
      searchData: {}
    }
  },
  methods: {
    handleSearch (value) {
      this.$emit('on-search', value)
    },
    searchRightClick () {
      this.showMore = true
      console.info('searchRightClick')
    },
    onPopupClose () {
      this.showMore = false
    }
  }
}
</script>

<style scoped lang="less">

</style>
