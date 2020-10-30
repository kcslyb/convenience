<template>
  <van-popup
    v-model="show"
    :position="position"
    :style="{height: '100%', width: '100%'}"
    @close="onPopupClose">
    <slot></slot>
  </van-popup>
</template>

<script>
import { Popup } from 'vant'
export default {
  name: 'KcsPopup',
  components: {
    VanPopup: Popup
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'right'
    }
  },
  methods: {
    onPopupClose () {
      this.$emit('on-close')
    }
  }
}
</script>

<style scoped>

</style>
