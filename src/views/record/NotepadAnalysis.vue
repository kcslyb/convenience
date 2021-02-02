<template>
 <div>
   <common-page
     title="统计"
     :show-btn-right="false"
     @on-left-click="onLeftClick">
     <template slot="title-right">
       <van-icon class="ico-default" size="20" name="notes-o" @click.stop="handleNotes" />
     </template>
     <kcs-analysis-item :data-list="dataList" @on-click="handleClick"></kcs-analysis-item>
   </common-page>
   <van-calendar
     v-model="show"
     :min-date="minDate"
     :max-date="maxDate"
     :default-date="defaultData"
     color="#1989fa"
     type="range"
     @confirm="onConfirm"/>
 </div>
</template>

<script>
import { Icon, Calendar } from 'vant'
import CommonPage from '../../components/CommonPage'
import KcsAnalysisItem from '../../components/KcsAnalysisItem'
import { DayLogApi } from '../../api/resources'
import commonUtil from '../../utils/CommonUtil'
export default {
  name: 'NotepadAnalysis',
  components: {
    CommonPage,
    VanIcon: Icon,
    KcsAnalysisItem,
    VanCalendar: Calendar
  },
  data () {
    return {
      show: false,
      dataList: [],
      condition: {},
      dateLabel: '',
      defaultData: [],
      minDate: new Date(),
      maxDate: new Date()
    }
  },
  created () {
    const params = this.$store.getters.notepadParams
    let start = ''
    let end = ''
    if (params && Object.keys(params).length > 0) {
      end = new Date(params.endTime)
      start = new Date(params.startTime)
    } else {
      end = commonUtil.getMonthEndDate()
      start = commonUtil.getMonthStartDate()
    }
    this.minDate = new Date(new Date().getFullYear(), 0, 1)
    this.maxDate = new Date(new Date().getFullYear(), 12, 31)
    this.defaultData = [start, end]
    this.onConfirm([start, end])
  },
  methods: {
    queryCount () {
      const params = Object.assign({}, this.condition)
      DayLogApi.queryCount(params).then(res => {
        this.dataList = res.data.reduce((acc, current) => {
          const obj = {}
          obj.label = this.dateLabel
          obj.count = current.count
          obj.title = '事件类型：' + current.reservedKeyTwo
          obj.reservedKeyOne = current.reservedKeyOne
          obj.reservedKeyTwo = current.reservedKeyTwo
          acc.push(obj)
          return acc
        }, [])
      })
    },
    handleClick (item) {
      const endTime = commonUtil.formatDateToDateTime(this.condition.endTime)
      const startTime = commonUtil.formatDateToDateTime(this.condition.startTime)
      const condition = Object.assign({}, { startTime, endTime, reservedKeyOne: item.reservedKeyOne })
      this.$store.dispatch('SET_NOTEPAD_PARAMS', condition)
      this.$router.push({
        path: '/record/notepad',
        query: { type: 'analysis' }
      })
    },
    onLeftClick () {
      this.$router.push({
        path: '/home'
      })
    },
    handleNotes () {
      console.info('handleNotes')
      this.show = true
    },
    onConfirm (date) {
      this.show = false
      const [start, end] = date
      this.condition.endTime = end
      this.condition.startTime = start
      this.dateLabel = `时间段：${this.formatDate(start)} ~ ${this.formatDate(end)}`
      this.queryCount()
    },
    formatDate (date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
  }
}
</script>

<style scoped lang="less">
@import "../../assets/style/common";
.analysis-item-container {
  .analysis-item {
    margin: 1rem;
    padding: .8rem;
    display: flex;
    border-radius: .3rem;
    border: .1rem solid @common-border-color;
    justify-content: space-between;
    align-items: center;
    .analysis-item-content {
      text-align: left;
      font-size: 1rem;
      line-height: 1.6rem;
      .title {
        font-weight: bold;
      }
      .label {
        color: @common-color;
      }
    }
    .analysis-item-sum {
      width: 4rem;
      height: 4rem;
      border-radius: 4rem;
      box-sizing: border-box;
      border: .1rem solid @common-color;
      line-height: 3.8rem;
      text-align: center;
      font-weight: bold;
      font-size: 1.2rem;
    }
  }
}
</style>
