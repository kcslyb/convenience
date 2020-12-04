<template>
  <common-page
    title="类型转换关系"
    :show-search="true"
    @on-left-click="onLeftClick"
    @on-right-click="onRightClick">
    <template slot="title-right">
      <van-icon v-show="!showChecked" class="ico-default" size="20" name="records" @click="handleAddRecord" />
      <van-icon v-show="showChecked" class="ico-default" size="20" name="passed" @click="handleChooseRecord" />
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
          :title="item.oneTypeNumber + item.oneTypeUnitName + '=' + item.twoTypeNumber + item.twoTypeUnitName"
          :detail-item="item"
          :show-status="true"
          :show-checked="showChecked"
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
import { ConvertApi } from '../../api/resources'
import Operations from '../../utils/Operations'
export default {
  name: 'StatisticalAnalysis',
  components: {
    CommonPage,
    KcsListItem,
    VanList: List,
    VanIcon: Icon,
    VanPullRefresh: PullRefresh
  },
  props: {
    showChecked: {
      type: Boolean,
      default: false
    },
    // 是否可多选checked
    checkedMultiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      dataList: [],
      currentItem: {},
      detailProps: [
        {
          prop: 'oneTypeNumber',
          label: '数量',
          width: 40
        }, {
          prop: 'oneTypeUnitName',
          label: '类型名',
          width: 60
        }, {
          prop: 'twoTypeNumber',
          label: '数量',
          width: 40
        }, {
          prop: 'twoTypeUnitName',
          label: '类型名',
          width: 60
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
      ConvertApi.queryPager({}).then(res => {
        this.total = res.data.total
        this.dataList = res.data.list
        console.info(res.data.list)
        this.finished = true
        this.loading = true
        this.refreshing = false
      })
    },
    handleClick (item) {
      if (this.showChecked) {
        if (!this.checkedMultiple) {
          this.dataList.map(value => {
            const flag = (value.id === item.id)
            this.$set(value, 'checked', flag)
          })
        }
      } else {
        this.$router.push({
          path: '/statistical/analysis/option',
          query: { id: item.id }
        })
      }
    },
    handleAddRecord () {
      this.$router.push({
        path: '/statistical/analysis/option'
      })
    },
    handleChooseRecord () {
      const temp = this.dataList.filter(value => {
        return value.checked
      })
      this.$emit('confirm', temp)
    },
    handleTouch (item) {
      const opt = new Operations(ConvertApi)
      opt.delete(item.id, () => {
        this.onLoadData()
      })
    },
    onLeftClick () {
      if (this.showChecked) {
        this.$emit('on-left-click')
      } else {
        this.$router.go(-1)
      }
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
