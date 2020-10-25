<template>
  <div class="page-container">
    <van-nav-bar :title="title" fixed>
      <template slot="left">
        <slot name="title-left"></slot>
      </template>
      <template slot="right">
        <slot name="title-left"></slot>
      </template>
    </van-nav-bar>
    <solt></solt>
  </div>
</template>

<script>
export default {
  name: 'CommonPage',
  props: {
    title: {
      type: String,
      default: '标题'
    }
  }
}
</script>

<style scoped>
.page-container {
  padding-top: 2.875rem;
}
</style>
