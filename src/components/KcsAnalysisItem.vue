<template>
  <div class="analysis-item-container">
    <div class="analysis-item" v-for="(item, index) of dataList" :key="`analysis-item-${index}`">
      <div class="analysis-item-content">
        <div class="label title">{{item[propObj.title]}}</div>
        <div class="label">{{item[propObj.label]}}</div>
      </div>
      <div class="analysis-item-sum" @click="handleClick(item)">{{item[propObj.count]}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KcsAnalysisItem',
  props: {
    dataList: {
      type: Array,
      default: () => {
        return [
          {
            title: '标题标题标题标题标题1',
            label: '时间：2020-09-09 ~ 2020-10-10',
            count: 199
          }, {
            title: '标题标题标题标题标题2',
            label: '时间：2020-09-09 ~ 2020-10-10',
            count: 1990
          }
        ]
      }
    },
    propObj: {
      type: Object,
      default: () => {
        return {
          title: 'title',
          label: 'label',
          count: 'count'
        }
      }
    }
  },
  methods: {
    handleClick (item) {
      this.$emit('on-click', item)
    }
  }
}
</script>

<style scoped lang="less">
  @import "../assets/style/common";
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
