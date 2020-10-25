<template>
  <div class="home">
    <van-nav-bar fixed>
      <template slot="left">
        <span>{{active}}</span>
      </template>
      <template slot="right">
        <van-icon class="active" size="20" name="bars" @click="handleMore" />
      </template>
    </van-nav-bar>
    <van-bar
      :active="active"
      @change="onChange"
    >
      <van-bar-item
        :class="{'bar-item': true,'active': active === '首页'}" name="首页" icon="home-o">首页</van-bar-item>
      <van-bar-item
        :class="{'bar-item': true,'active': active === '我的'}" name="我的" icon="friends-o">我的</van-bar-item>
    </van-bar>
    <van-popup
      v-model="show"
      position="right"
      :style="{height: '100%', width: '100%'}"
      @close="onPopupClose">
      <van-nav-bar title="更多" fixed>
        <template slot="left">
          <van-icon class="active" size="20" name="arrow-left" @click="handleClose" />
        </template>
        <template slot="right">
          <van-icon class="active" size="20" name="bars" @click="handleMore" />
        </template>
      </van-nav-bar>
    </van-popup>
  </div>
</template>

<script>
import { TabbarItem, Tabbar, NavBar, Icon, Popup } from 'vant'
export default {
  name: 'Home',
  components: {
    VanBarItem: TabbarItem,
    VanNavBar: NavBar,
    VanPopup: Popup,
    VanBar: Tabbar,
    VanIcon: Icon
  },
  data () {
    return {
      show: false,
      active: '首页',
      tabActiveName: ''
    }
  },
  methods: {
    onChange (event) {
      this.active = event
    },
    handleMore () {
      console.info('more')
      this.show = true
    },
    onPopupClose () {
      this.show = false
    },
    handleClose () {
      this.show = false
    }
  }
}
</script>
<style scoped>
  .home {
    padding-top: 2.875rem
  }
  .bar-item {
    color: rgb(69 104 98);
  }
  .active {
    color: rgb(12 47 49);
  }
</style>
