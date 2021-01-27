<template>
  <div class="home">
    <van-nav-bar fixed class="main-nav-bar">
      <template slot="left">
        <span>{{active}}</span>
      </template>
    </van-nav-bar>
    <div v-show="active === '首页'" class="home-content">
      <div class="home-content-title"></div>
      <div v-for="(item, index) of currentMenus" :key="`system_menu_key_${index}`">
        <kcs-label :title="item.title"></kcs-label>
        <van-cell
          class="active"
          v-for="(menu, menu_index) of item.menus"
          :key="`menu_${index}_key_${menu_index}`"
          :title="menu.title"
          :icon="menu.icon"
          :url="menu.url"
          is-link />
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, Cell } from 'vant'
import KcsLabel from '@/components/KcsLabel'
import { FileApi } from '@/api/resources'
import SystemMenu from '@/config/menu'
export default {
  name: 'Home',
  components: {
    KcsLabel,
    VanCell: Cell,
    VanNavBar: NavBar
  },
  data () {
    return {
      active: '首页',
      tabActiveName: '',
      menus: [],
      avatarSrc: ''
    }
  },
  computed: {
    currentMenus () {
      return this.$store.getters.currentMenus || []
    },
    userAvatarId () {
      return this.$store.getters.avatar || ''
    }
  },
  watch: {
    userAvatarId () {
      this.initImage()
    },
    userPermissions: {
      handler () {
        this.initData()
      },
      deep: true
    }
  },
  methods: {
    initData () {
      this.menus = []
      this.judgeAuthority(SystemMenu)
    },
    // 权限判断
    judgeAuthority (menus) {
      this.menus = []
      const tempPerm = this.userPermissions || []
      menus.forEach(val => {
        this.menus.push(val)
      })
      this.menus.map(value => {
        if (value.menus) {
          const menusTemp = JSON.parse(JSON.stringify(value.menus || []))
          value.menus = menusTemp.filter(val => tempPerm.includes(val.perm))
        }
      })
    },
    initImage () {
      const id = this.userAvatarId
      if (id && !this.avatarSrc) {
        FileApi.accessFileBase64([id]).then(res => {
          console.info(res)
          if (res.status === 200) {
            if (Array.isArray(res.data) && res.data.length > 0) {
              this.avatarSrc = res.data[0].base64
            }
          }
        })
      }
    },
    onChange (event) {
      this.active = event
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

    .home-content {
      text-align: left;

      .home-content-title {
        height: 6rem;
        text-align: center;
        padding: 4rem 0;
        background-image: url("../../assets/img/background-login.jpeg");
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
