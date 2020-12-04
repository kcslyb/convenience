<template>
  <div class="home">
    <van-nav-bar fixed class="main-nav-bar">
      <template slot="left">
        <span>{{active}}</span>
      </template>
      <template slot="right">
        <van-icon class="bar-right-active" size="20" name="bars" @click="handleMore" />
      </template>
    </van-nav-bar>
    <div class="home-content">
      <div class="home-content-title">
        <van-image
          width="100"
          height="100"
          round
          :src="require('../assets/img/background-login.jpeg')"
        />
      </div>
      <kcs-label title="基础数据"></kcs-label>
      <van-cell class="active" url="/statistical/analysis" icon="points" title="类型池" is-link />
      <van-cell class="active" url="/entity/relevance" icon="desktop-o" title="类型转换关系" is-link />
      <kcs-label title="事件记录"></kcs-label>
      <van-cell class="active" url="#" icon="notes-o" title="事件记录统计" is-link />
    </div>
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
      <common-page title="更多">
        <template slot="title-left">
          <van-icon class="active" size="20" name="arrow-left" @click="handleClose" />
        </template>
        <template slot="title-right">
          <van-icon class="active" size="20" name="exchange" @click="handleLogout" />
        </template>
      </common-page>
    </van-popup>
  </div>
</template>

<script>
import { TabbarItem, Tabbar, NavBar, Icon, Popup, Cell, Image } from 'vant'
import CommonPage from '@/components/CommonPage'
import KcsLabel from '@/components/KcsLabel'
export default {
  name: 'Home',
  components: {
    KcsLabel,
    CommonPage,
    VanBarItem: TabbarItem,
    VanNavBar: NavBar,
    VanPopup: Popup,
    VanImage: Image,
    VanBar: Tabbar,
    VanIcon: Icon,
    VanCell: Cell
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
      this.show = true
    },
    handleLogout () {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push('/login')
      }).catch((e) => { console.info(e) })
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
<style scoped lang="less">
  @import "../assets/style/common";
  .home {
    padding-top: 2.875rem;

    .main-nav-bar {
      color: white;
      background-color: #0a323a;

      .bar-right-active {
        color: white;
      }
    }

    .home-content {
      text-align: left;

      .home-content-title {
        height: 6rem;
        text-align: center;
        padding: 4rem 0;
        background-image: url("../assets/img/background-login.jpeg");
        border-bottom: .1rem solid #F2F2F2;
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
