<template>
  <div :class="['custom-label', showBorder ? 'label-border' : '']">
    <div class="custom-label-title">
      <span class="custom-label-icon">
        <van-icon name="label"/>
      </span>
      {{title}}
    </div>
    <div class="custom-label-prompt">
      {{prompt}}
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant'
export default {
  name: 'KcsLabel',
  components: {
    VanIcon: Icon
  },
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 右侧提示
    prompt: {
      type: String,
      default: ''
    },
    // 是否需要border样式
    showBorder: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/style/common";
  .label-border {
    border: .8rem solid #e6e6e6;
  }

  .custom-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #F2F8FF;

    .custom-label-title {
      color: @common-color;
      font-size: 1rem;
      line-height: 2.6rem;
      font-weight: bolder;
      display: inline-block;

      .custom-label-icon {
        margin-left: .5rem;
        margin-right: .5rem;
        padding-right: .3rem;
        color: @common-second-color;
      }
    }

    .custom-label-prompt {
      color: #9CA6B5;
      font-size: 1rem;
      padding-right: 1rem;
    }
  }
</style>
