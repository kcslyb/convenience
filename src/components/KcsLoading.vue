<template>
  <van-overlay :z-index="100" :show="loading">
    <div class="wrapper" @click.stop>
      <van-loading class="block" type="spinner" color="0B2F30"/>
    </div>
  </van-overlay>
</template>

<script>
import { Loading, Overlay } from 'vant'

export default {
  name: 'KcsLoading',
  components: {
    VanLoading: Loading,
    VanOverlay: Overlay
  },
  props: {
    loading: [Boolean]
  }
}
</script>

<style scoped>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
