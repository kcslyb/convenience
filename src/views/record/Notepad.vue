<template>
  <common-page
    title="记事本"
    :show-search="true"
    :show-right-icon="true"
    :loading="pageLoading"
    @on-search="handleSearch"
    @on-left-click="onLeftClick"
    @on-right-click="onRightClick"
    @on-search-confirm="handleSearchConfirm">
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
          :title="item.reservedKeyTwo"
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
      condition: {
        start: 1,
        size: 10
      },
      detailProps: [
        {
          prop: 'title',
          label: '标题'
        }, {
          prop: 'createByName',
          label: '创建人'
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
    this.dataList = []
    this.queryData()
  },
  methods: {
    onRefresh () {
      this.condition.start = 1
      this.dataList = []
      this.queryData()
    },
    onLoadData () {
      this.condition.start = this.condition.start + 1
      this.queryData()
    },
    handleSearch (keyWord) {
      this.condition.keyWord = keyWord
      this.onRefresh()
    },
    handleSearchConfirm (searchData) {
      this.condition = Object.assign(this.condition, searchData)
      this.onRefresh()
    },
    queryData () {
      this.pageLoading = true
      DayLogApi.queryPager(this.condition).then(res => {
        this.total = res.data.total
        this.dataList = this.dataList.concat(res.data.list)
        console.info(res.data.list)
        this.finished = this.condition.start * this.condition.size >= this.total
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
        this.onRefresh()
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
