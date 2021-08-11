<template>
  <div
    class="list-item"
    @touchend="goTouchEnd"
    @touchmove="goTouchMove"
    @touchstart="goTouchStart"
    @click="handleClick">
    <div v-show="showLeftStatus" class="left-status">
      <span
        class="status-left-icon"
        :style="'background-color:' + statusIconColor[calcStatus]"
      ></span>
      {{ statusName }}
    </div>
    <slot name="title">
      <div class="list-item-title">
        <div :style="'width:' + (showStatus ? '80%' : '100%')" class="title">{{title}}</div>
        <div v-show="showStatus" class="status">
        <span
          class="status-icon"
          :style="'background-color:' + statusIconColor[calcStatus]"
        ></span>
          {{ statusName }}
        </div>
      </div>
    </slot>
    <div class="nc-list-item">
      <div class="nc-list-item-content">
        <div
          :style="'min-width:' + (item.width ? item.width : span) + '%'"
          v-show="!item.interlock ? true : detailItem[item.prop]"
          class="list-item-detail"
          v-for="(item, index) in detailProps"
          :key="index + item.prop"
        >
          <div class="label-value label-value-btn" v-if="item.type === 'btn'" @click.stop="handleLabelClick">
            <span class="lv-text-color">{{ item.label }}: </span>
            {{ detailItem[item.prop] }}
            {{item.separator || ''}}
            {{ item.propSecond ? detailItem[item.propSecond] : ''}}
          </div>
          <div class="label-value" v-else-if="item.type === 'date'">
            <span class="lv-text-color">{{ item.label }}: </span>
            {{formatDate(item)}}
          </div>
          <div :class="['label-value', item.showLineClamp && 'show-line-clamp' ]" v-else>
            <span v-if="!item.showLineClamp" class="lv-text-color">{{ item.label }}: </span>
            {{ detailItem[item.prop] }}
            {{item.separator || ''}}
            {{ item.propSecond ? detailItem[item.propSecond] : ''}}
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
export default {
  name: 'KcsListItem',
  props: {
    // 大标题
    title: {
      type: String,
      default: ''
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
    // 是否显示左状态
    showLeftStatus: {
      type: Boolean,
      default: false
    },
    // 状态颜色
    statusIconColor: {
      type: Array,
      default: () => ['#0099FF', '#0066FF', '#0033FF', '#0000FF']
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
  computed: {
    calcStatus () {
      if (Object.prototype.toString.call(this.status) === '[object Number]') {
        return this.status > this.statusIconColor.length ? 0 : this.status
      } else {
        return 0
      }
    }
  },
  methods: {
    moment,
    handleClick () {
      this.$emit('on-click', this.detailItem)
    },
    handleLabelClick () {
      this.$emit('on-label-click', this.detailItem)
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
    },
    formatDate (item) {
      return this.detailItem[item.prop]
        ? moment(+new Date(this.detailItem[item.prop])).format(item.format ? item.format : 'YYYY-MM-DD HH:mm')
        : ''
    }
  }
}
</script>

<style lang="less" scoped>
.list-item {
  margin: 1rem;
  padding: 1rem 1.5rem;
  color: rgb(120 120 120);
  background-color: white;
  border-radius: 0.8rem;

  .left-status {
    font-size: 1.2rem;
    padding-bottom: 0.8rem;

    .status-left-icon {
      content: " ";
      display: inline-block;
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 0.3rem;
      vertical-align: middle;
      margin-top: -0.15rem;
      margin-right: 0.5rem;
    }
  }

  .list-item-title {
    display: flex;
    justify-content: space-between;

    .title {
      text-align: left;
      font-size: 1.4rem;
      line-height: 2.4rem;
      font-weight: bolder;
      padding-right: 1.25rem;
      margin-bottom: .625rem;
      color: #1C2836;
      text-justify: newspaper;
      word-break: break-all;
      display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
      -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
      -webkit-line-clamp: 2; /** 显示的行数 **/
      overflow: hidden; /** 隐藏超出的内容 **/
    }

    .status {
      font-size: 1.2rem;
      width: 100px;
      text-align: right;
      .status-icon {
        content: " ";
        display: inline-block;
        width: 0.6rem;
        height: 0.6rem;
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
    .nc-list-item-content {
      width: 100%;
    }
    .nc-list-item-checkbox {
      padding-right: .5rem;
    }
  }

  .list-item-detail {
    width: auto;
    display: inline-block;

    .show-line-clamp {
      text-overflow: ellipsis;
      display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
      -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
      -webkit-line-clamp: 2; /** 显示的行数 **/
      overflow: hidden; /** 隐藏超出的内容 **/
    }
    .label-value {
      padding: 0.3rem 0;
      font-size: 1.2rem;
      color: #252525;
      word-break: break-all;
      .lv-text-color {
        display: inline-block;
        color: #6e7d93;
      }
    }
    .label-value-btn {
      color: #0079fe;
    }
  }
}
</style>
