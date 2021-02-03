<template>
  <div>
    <van-search
      :placeholder="placeholder"
      v-model="keyWord"
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
      <kcs-search-item
        :filterItems="filters"
        v-model="this.$attrs.value"
        @cancel-click="handleMoreClose"
        @confirm-click="handleMoreConfirm"
      ></kcs-search-item>
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
      timer: '',
      keyWord: '',
      showMore: false
    }
  },
  methods: {
    handleSearch (value) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      // 等待timeout的时间间隔后执行
      this.timer = setTimeout(() => {
        this.$emit('on-search', value)
      }, 2000)
    },
    searchRightClick () {
      this.showMore = true
      console.info('searchRightClick')
    },
    onPopupClose () {
      this.showMore = false
    },
    handleMoreClose () {
      const tempValue = this.$attrs.value
      if (tempValue || Object.keys(tempValue).length > 0) {
        Object.keys(tempValue).forEach(value => {
          this.$set(this.$attrs.value, value, null)
        })
      }
      this.handleMoreConfirm()
    },
    handleMoreConfirm () {
      this.showMore = false
      this.$emit('on-search-confirm', this.$attrs.value)
    }
  }
}
</script>

<style scoped lang="less">

</style>
