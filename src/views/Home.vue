<template>
  <div class="home">
    <van-button type="default">默认按钮</van-button>
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-button type="warning" size="small">警告按钮</van-button>
    <van-button type="danger" size="mini">危险按钮</van-button>
    <HelloWorld msg="savour"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { Button } from 'vant'
export default {
  name: 'Home',
  components: {
    HelloWorld,
    VanButton: Button
  }
}
</script>
