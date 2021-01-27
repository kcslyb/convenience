<template>
  <div class="home">
    <component :is="active"></component>
    <van-bar
      :active="active"
      @change="onChange">
      <van-bar-item
        :class="{'bar-item': true,'active': active === 'Index'}" name="Index" icon="home-o">首页</van-bar-item>
      <van-bar-item
        :class="{'bar-item': true,'active': active === 'Info'}" name="Info" icon="friends-o">我的</van-bar-item>
    </van-bar>
  </div>
</template>

<script>
import { TabbarItem, Tabbar, NavBar, Cell } from 'vant'
import Info from './info'
import Index from './index'
import KcsLabel from '@/components/KcsLabel'
export default {
  name: 'Home',
  components: {
    Info,
    Index,
    KcsLabel,
    VanBarItem: TabbarItem,
    VanNavBar: NavBar,
    VanBar: Tabbar,
    VanCell: Cell
  },
  data () {
    return {
      menus: [],
      active: 'Index',
      avatarSrc: ''
    }
  },
  methods: {
    onChange (activeName) {
      this.active = activeName
    },
    handleLogout () {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push('/login')
      }).catch((e) => { console.info(e) })
    }
  }
}
</script>
<style scoped lang="less">
  @import "../../assets/style/common";
  .home {
    padding-bottom: 2.875rem;

    .main-nav-bar {
      color: white;
      background-color: #0a323a;

      .bar-right-active {
        color: white;
      }
    }
  }
  .bar-item {
    color: rgb(69 104 98);
  }
  .active {
    color: rgb(12 47 49);
  }
</style>
