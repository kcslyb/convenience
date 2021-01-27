<template>
  <div>
    <kcs-search show-right-icon></kcs-search>
    <h1>java</h1>
    <button v-throttle="handleClick">linux</button>
    <button v-debounce="{func: handleClick2}">linux2</button>
    <kcs-label prompt="test-debounce" v-debounce="{func: handLabel, event: 'on-prompt-click'}"></kcs-label>
    <kcs-label prompt="test-emit" @on-prompt-click="handPromptClick"></kcs-label>
    <button @click="handleClick3">button</button>
  </div>
</template>

<script>
import KcsLabel from '../components/KcsLabel'
import KcsSearch from '../components/KcsSearch'
import { Dialog } from 'vant'
export default {
  name: 'Test',
  components: { KcsSearch, KcsLabel },
  data () {
    return {
      arg: {
        flag: true,
        timeout: 3000
      }
    }
  },
  methods: {
    handleClick () {
      console.info('click-throttle')
    },
    handleClick2 () {
      console.info('click-debounce')
    },
    handLabel () {
      console.info('click-handLabel')
    },
    handPromptClick () {
      console.info('click-handPromptClick')
    },
    handleClick3 () {
      console.info('click-handPromptClick')
      // Dialog.confirm({
      //   title: '删除确认',
      //   message: '确认删除这条数据吗？'
      // }).then(() => {
      //   console.info('return in false')
      //   return false
      // }).catch(() => {
      //   console.info('return in true')
      //   return true
      // })
      // console.info('return out')
      this.con()
    },
    async con () {
      await Dialog.confirm({
        title: '删除确认',
        message: '确认删除这条数据吗？'
      }).then(() => {
        console.info('return in false')
        return false
      }).catch(() => {
        console.info('return in true')
        return true
      })
      console.info('con out')
    }
  }
}
</script>

<style scoped>

</style>
