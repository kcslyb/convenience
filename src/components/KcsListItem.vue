<template>
  <div
    class="list-item"
    @touchend="goTouchEnd"
    @touchmove="goTouchMove"
    @touchstart="goTouchStart"
    @click="handleClick">
    <div class="list-item-title">
      <div :style="'width:' + (showStatus ? '80%' : '100%')" class="title">{{title}}</div>
      <div v-show="showStatus" class="status">
        <span
          class="status-icon"
          :style="'background-color:' + statusIconColor[status]"
        ></span>
        {{ statusName }}
      </div>
    </div>
    <div class="nc-list-item">
      <div class="nc-list-item-container">
        <div
          :style="'min-width:' + (item.width ? item.width : span) + '%'"
          class="list-item-detail"
          v-for="(item, index) in detailProps"
          :key="index + item.prop"
        >
          <div class="label-value" v-if="item.type === 'date'">
            <span class="lv-text-color">{{ item.label }}: </span>
            {{
              detailItem[item.prop]
                ? moment(parseInt(detailItem[item.prop])).format(
                    item.format ? item.format : "YYYY-MM-DD HH:mm:ss"
                  )
                : ""
            }}
          </div>
          <div class="label-value" v-else>
            <span class="lv-text-color">{{ item.label }}: </span>
            {{ detailItem[item.prop] }} {{ item.propSecond ? detailItem[item.propSecond] : ''}}
          </div>
        </div>
      </div>
      <van-checkbox
        v-if="showChecked"
        class="nc-list-item-checkbox"
        v-model="detailItem.checked"
      />
      <slot class="nc-list-item-checkbox"></slot>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { Checkbox } from 'vant'
export default {
  name: 'KcsListItem',
  components: {
    VanCheckbox: Checkbox
  },
  props: {
    // 大标题
    title: {
      type: String,
      default: '大标题'
    },
    // 右侧状态
    status: {
      type: [String, Number],
      default: 0
    },
    // 右侧状态名
    statusName: {
      type: String,
      default: ''
    },
    // 数据对象
    detailItem: {
      type: Object,
      default: () => {
        return {
          substationName: '变电站',
          startTime: '开始时间',
          endTime: '结束时间'
        }
      }
    },
    // 数据对象映射数组 eg: [{label: '发令人', prop: 'was'}, ...]
    detailProps: {
      type: Array,
      default: () => [
        {
          prop: 'substationName',
          label: '变电站'
        },
        {
          prop: 'startTime',
          label: '开始时间'
        },
        {
          prop: 'endTime',
          label: '结束时间'
        }
      ]
    },
    // 是否显示状态
    showStatus: {
      type: Boolean,
      default: true
    },
    // 状态颜色
    statusIconColor: {
      type: Array,
      default: () => ['#4BD863', '#297FF6', '#297FF6']
    },
    // 单个字段宽的占比
    span: {
      type: Number,
      default: 100
    },
    // 是否显示选择checked
    showChecked: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      timeOutEvent: 0
    }
  },
  methods: {
    moment,
    handleClick () {
      this.$set(this.detailItem, 'checked', !this.detailItem.checked)
      this.$emit('on-click', this.detailItem)
    },
    goTouchStart () {
      clearTimeout(this.timeOutEvent)// 清除定时器
      this.timeOutEvent = 0
      this.timeOutEvent = setTimeout(() => {
        // 执行长按要执行的内容，
        this.$emit('on-touch-start', this.detailItem)
      }, 800)
    },
    goTouchEnd () {
      clearTimeout(this.timeOutEvent)
      if (this.timeOutEvent !== 0) {
        // 这里写要执行的内容
        this.$emit('on-touch-end', this.detailItem)
      }
    },
    // 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    goTouchMove () {
      clearTimeout(this.timeOutEvent)// 清除定时器
      this.timeOutEvent = 0
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/style/common";

  .list-item {
    padding: .8rem;
    margin: .8rem .4rem;
    border-radius: 0.6rem;
    color: rgb(120 120 120);
    background-color: white;

    .list-item-title {
      display: flex;
      justify-content: space-between;

      .title {
        text-align: left;
        font-size: 1rem;
        line-height: 2rem;
        font-weight: bolder;
        padding-right: .7rem;
        margin-bottom: .425rem;
        color: @common-color;
        text-justify: newspaper;
        word-break: break-all;
      }

      .status {
        font-size: .82rem;

        .status-icon {
          content: " ";
          display: inline-block;
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 0.3rem;
          vertical-align: middle;
          margin-top: -0.15rem;
          margin-right: 0.5rem;
        }
      }
    }

    .nc-list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .nc-list-item-container {
        width: 100%;
      }

      .nc-list-item-checkbox {
        padding-right: 1.5rem;
      }
    }

    .list-item-detail {
      width: auto;
      text-align: left;
      display: inline-block;
      font-size: .78rem;

      .label-value {
        padding: 0.3rem 0;
        color: @common-color;

        .lv-text-color {
          color: @common-second-color;
        }
      }
    }
  }
</style>
