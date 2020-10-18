<template>
  <div class="hello">
    <van-cell-group>
      <van-field
        v-model="name"
        label="文本"
        left-icon="smile-o"
        right-icon="warning-o"
        placeholder="显示图标"
      />
      <van-field
        v-model="text"
        clearable
        label="文本"
        left-icon="music-o"
        placeholder="显示清除图标"
      />
    </van-cell-group>
  </div>
</template>

<script lang="ts">
import { Field, CellGroup } from 'vant'
import { Component, Provide, Vue } from 'vue-property-decorator'

@Component({
  components: {
    VanField: Field,
    VanCellGroup: CellGroup
  }
})
export default class About extends Vue {
  @Provide() private name = 'About'
  @Provide() public text = 'about'

  // created (): void {}

  mounted () {
    console.info('mounted')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
