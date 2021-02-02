<template>
  <common-page
    title="记事本"
    :show-search="true"
    :show-right-icon="!this.$route.query.type"
    :loading="pageLoading"
    :filters="filterProps"
    v-model="searchData"
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
import { DayLogApi, DictApi } from '../../api/resources'
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
      searchData: {},
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
      ],
      filterProps: [
        {
          type: 'date',
          name: 'startTimeStamp',
          nameLabel: 'startTime',
          label: '开始时间'
        }, {
          type: 'date',
          name: 'endTimeStamp',
          nameLabel: 'endTime',
          label: '结束时间'
        }, {
          type: 'select',
          name: 'reservedKeyOne',
          nameLabel: 'reservedKeyOneLabel',
          label: '事件类型',
          optionProps: {
            value: 'key',
            label: 'label'
          },
          options: []
        }
      ]
    }
  },
  created () {
    this.dataList = []
    this.queryData()
    this.queryDictOptions()
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
      this.$store.dispatch('SET_NOTEPAD_PARAMS', searchData)
      this.condition = Object.assign(this.condition, searchData)
      this.onRefresh()
    },
    queryData () {
      this.pageLoading = true
      const params = this.$store.getters.notepadParams
      if (params && Object.keys(params).length > 0) {
        this.searchData = params
        this.condition = Object.assign({}, this.condition, params)
      }
      DayLogApi.queryPager(this.condition).then(res => {
        this.total = res.data.total
        this.dataList = this.dataList.concat(res.data.list)
        console.info(res.data)
        this.finished = this.condition.start * this.condition.size >= this.total
        this.loading = false
        this.refreshing = false
        this.pageLoading = false
      }).catch(() => {
        this.pageLoading = false
      })
    },
    queryDictOptions () {
      if (this.filterProps[2].options.length === 0) {
        DictApi.queryByDictGroupLabel('eventType').then(res => {
          console.info(res.data)
          this.filterProps[2].options = res.data
        })
      }
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
