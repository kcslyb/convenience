<template>
  <div class="info-container">
    <div class="info-title">
      <van-card class="custom-card" :thumb="avatarSrc">
        <template slot="num">
          <van-icon size="16" name="arrow" @click="show = !show"/>
        </template>
        <template slot="price">
          <span style="font-size: .8rem">{{userInfo.userPhone}}</span>
        </template>
        <template slot="title">
          <div style="padding: 1rem 0; font-size: 1.2rem; font-weight: bold">{{userInfo.userName}}</div>
        </template>
      </van-card>
    </div>
    <kcs-popup :show="show">
      <van-nav-bar title="账号详情" fixed>
        <template slot="left">
          <slot name="title-left">
            <div class="title-left-container" @click="show = !show">
              <van-icon class="ico-default" size="20" name="arrow-left" @click.stop="show = !show" />
              <span>返回</span>
            </div>
          </slot>
        </template>
      </van-nav-bar>
      <kcs-field-list
        v-model="userInfo"
        :field-props="fieldProps">
      </kcs-field-list>
      <div class="btn-item">
        <van-button plain block @click="handleLogout">切换账号</van-button>
      </div>
      <div class="btn-item">
        <van-button plain block @click="handleLogout">注销</van-button>
      </div>
    </kcs-popup>
  </div>
</template>

<script>
import { Card, Icon, Button, NavBar } from 'vant'
import { FileApi } from '@/api/resources'
import KcsFieldList from '@/components/KcsFieldList'
import KcsPopup from '@/components/KcsPopup'

export default {
  name: 'info',
  components: {
    KcsPopup,
    KcsFieldList,
    VanIcon: Icon,
    VanCard: Card,
    VanButton: Button,
    VanNavBar: NavBar
  },
  data () {
    return {
      show: false,
      avatarSrc: '',
      fieldProps: [
        {
          readonly: true,
          name: 'userName',
          label: '用户名'
        },
        {
          readonly: true,
          name: 'roleName',
          label: '角色'
        },
        {
          readonly: true,
          name: 'userPhone',
          label: '手机号'
        },
        {
          readonly: true,
          name: 'userEmail',
          label: '邮箱'
        }
      ]
    }
  },
  computed: {
    userAvatarId () {
      return this.$store.getters.avatar || ''
    },
    userInfo () {
      return this.$store.getters.userInfo || {}
    }
  },
  watch: {
    userAvatarId () {
      this.initImage()
    }
  },
  mounted () {
    this.initImage()
  },
  methods: {
    initImage () {
      const id = this.userAvatarId
      if (id && !this.avatarSrc) {
        FileApi.accessFileBase64([id]).then(res => {
          if (res.status === 200) {
            if (Array.isArray(res.data) && res.data.length > 0) {
              this.avatarSrc = res.data[0].base64
            }
          }
        })
      }
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
  .info-container {
    .info-title {
      .custom-card {
        margin: 0;
        padding: .5rem;
        text-align: left;
      }
    }
  }
  .title-left-container {
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .ico-default {
    color: @common-color;
  }

  .bar-item {
    color: rgb(69 104 98);
  }

  .btn-item {
    padding: 1rem 0;
  }
  /deep/.van-overlay {
    background-color: white !important;
  }
</style>
