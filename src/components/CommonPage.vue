<template>
  <div class="page-container">
    <van-nav-bar :title="title" fixed>
      <template slot="left">
        <slot name="title-left">
          <van-icon class="ico-default" size="20" name="arrow-left" @click="handleClose" />
        </slot>
      </template>
      <template slot="right">
        <slot name="title-right">
          <van-icon class="ico-default" size="20" name="bars" @click="handleMore" />
        </slot>
      </template>
    </van-nav-bar>
    <van-sticky :offset-top="46" v-show="showSearch">
      <div class="search">
        <kcs-search
          :filters="filters"
          :show-right-icon="showRightIcon"
          :placeholder="`请输入${searchPlaceholder}查询`"
          @input="handleSearch"
          @search="handleSearch">
        </kcs-search>
      </div>
    </van-sticky>
    <kcs-loading :loading="loading"></kcs-loading>
    <slot></slot>
    <van-bar
      v-show="showBar && barCtrlList.length"
      :active="active"
      @change="onBarChange"
    >
      <van-bar-item
        :key="'bar-item-' + index"
        v-for="(item, index) of barItems"
        :class="{'bar-item': true,'active': active === item.name}"
        :name="item.name"
        v-show="barCtrlList.includes(item.action)"
        :icon="item.name"
        @click="onBarItemClick(item)">
        {{item.label}}</van-bar-item>
    </van-bar>
  </div>
</template>

<script>
import KcsLoading from '@/components/KcsLoading'
import KcsSearch from '@/components/KcsSearch'
import { Sticky, NavBar, Icon, TabbarItem, Tabbar } from 'vant'
export default {
  name: 'CommonPage',
  components: {
    KcsSearch,
    KcsLoading,
    VanBarItem: TabbarItem,
    VanNavBar: NavBar,
    VanSticky: Sticky,
    VanBar: Tabbar,
    VanIcon: Icon
  },
  props: {
    title: {
      type: String,
      default: '标题'
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    searchPlaceholder: {
      type: String,
      default: '关键字'
    },
    filters: {
      type: Array,
      default: () => []
    },
    showRightIcon: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    showBar: {
      type: Boolean,
      default: false
    },
    barItems: {
      type: Array,
      default: () => {
        return [
          {
            action: 'add',
            name: 'certificate',
            label: '保存'
          }, {
            action: 'edit',
            name: 'edit',
            label: '修改'
          }
        ]
      }
    },
    barCtrlList: {
      type: Array,
      default: () => {
        return ['add']
      }
    }
  },
  data () {
    return {
      active: ''
    }
  },
  methods: {
    handleSearch (query) {
      this.$emit('on-search', query)
    },
    handleClose () {
      this.$emit('on-left-click')
    },
    handleMore () {
      this.$emit('on-right-click')
    },
    onBarItemClick (item) {
      this.$emit('on-Bar-item-click', item.action)
    },
    onBarChange (event) {
      this.active = event
    }
  }
}
</script>

<style scoped lang="less">
  @import "../assets/style/common.less";
  .page-container {
    padding-top: 2.875rem;
    padding-bottom: 2.875rem;
    background-color: @common-page-background-color;
  }

  .ico-default {
    color: @common-color;
  }

  .bar-item {
    color: rgb(69 104 98);
  }

  .active {
    color: rgb(12 47 49);
  }
</style>
