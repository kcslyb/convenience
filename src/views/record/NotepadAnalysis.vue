<template>
 <div>
   <kcs-analysis-item></kcs-analysis-item>
 </div>
</template>

<script>
import KcsAnalysisItem from '../../components/KcsAnalysisItem'
export default {
  name: 'NotepadAnalysis',
  components: { KcsAnalysisItem },
  methods: {
    handleClick (item) {
      console.info(item)
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
