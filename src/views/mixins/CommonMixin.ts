import { Dialog } from 'vant'
const CommonMixin = {
  data () {
    return {
      title: '',
      action: '',
      barCtrlList: [],
      isChange: false
    }
  },
  methods: {
    // 回退
    handleRightClick () {
      // @ts-ignore
      if (this.isChange) {
        Dialog.confirm({
          title: '提示！',
          message: '信息还没有保存，是否确认退出？'
        }).then(() => {
          // @ts-ignore
          this.$router.go(-1)
        }).catch(() => {})
      } else {
        // @ts-ignore
        this.$router.go(-1)
      }
    }
  }
}

export default CommonMixin
