<template>
  <common-page
    title="记事本"
    :show-search="true"
    :show-right-icon="true"
    :loading="pageLoading"
    @on-left-click="onLeftClick"
    @on-right-click="onRightClick">
    <template slot="title-right">
      <van-icon class="ico-default" size="20" name="records" @click="handleAddRecord" />
    </template>
    <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
      <van-list
        :offset="10"
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        finished-text="没有更多了"
        @load="onLoadData"
      >
        <kcs-list-item
          v-for="item in dataList"
          :key="item.id"
          :title="item.title"
          :detail-item="item"
          :show-status="true"
          :status-name="item.createByName"
          :detail-props="detailProps"
          @on-click="handleClick(item)"
          @on-touch-start="handleTouch"></kcs-list-item>
      </van-list>
    </van-pull-refresh>
  </common-page>
</template>

<script>
import CommonPage from '../../components/CommonPage'
import KcsListItem from '../../components/KcsListItem'
import { PullRefresh, List, Icon } from 'vant'
import { DayLogApi } from '../../api/resources'
import Operations from '../../utils/Operations'
export default {
  name: 'EntityRelevance',
  components: {
    CommonPage,
    KcsListItem,
    VanList: List,
    VanIcon: Icon,
    VanPullRefresh: PullRefresh
  },
  data () {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      pageLoading: true,
      dataList: [],
      detailProps: [
        {
          prop: 'createByName',
          label: '创建人',
          width: 40
        }, {
          type: 'date',
          prop: 'createTime',
          label: '创建时间',
          width: 60
        }, {
          type: 'date',
          prop: 'happenTime',
          label: '发生时间'
        }, {
          prop: 'remark',
          label: '备注'
        }
      ]
    }
  },
  created () {
    this.onLoadData()
  },
  methods: {
    onRefresh () {
      this.onLoadData()
    },
    onLoadData () {
      this.pageLoading = true
      DayLogApi.queryPager({}).then(res => {
        this.total = res.data.total
        this.dataList = res.data.list
        console.info(res.data.list)
        this.finished = true
        this.loading = true
        this.refreshing = false
        this.pageLoading = false
      }).catch(() => {
        this.pageLoading = false
      })
    },
    handleClick (item) {
      this.$router.push({
        path: '/record/notepad/option',
        query: { id: item.id }
      })
    },
    handleAddRecord () {
      this.$router.push({
        path: '/record/notepad/option'
      })
    },
    handleTouch (item) {
      const opt = new Operations(DayLogApi)
      opt.delete(item.id, () => {
        this.onLoadData()
      })
    },
    onLeftClick () {
      this.$router.go(-1)
    },
    onRightClick () {
      this.$emit('on-right-click')
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../assets/style/common";
  .ico-default {
    color: @common-color;
  }
</style>
