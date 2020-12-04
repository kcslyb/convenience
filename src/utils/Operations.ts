import { Notify, Dialog } from 'vant'
class Operations {
  private api: any

  constructor(api: any) {
    this.api = api
  }

  add (params: any, callback = () => { }) {
    this.api.post(params).then(() => {
      Notify({ type: 'success', message: '新增成功' })
      callback()
    })
  }

  edit (params: any, callback = () => { }) {
    this.api.put(params).then(() => {
      Notify({ type: 'success', message: '修改成功' })
      callback()
    })
  }

  delete (params: any, callback = () => { }) {
    Dialog({ title: '提示！', message: '确认进行删除吗？', showCancelButton: true }).then(() => {
      this.api.delete(params).then(() => {
        Notify({ type: 'success', message: '删除成功' })
        callback()
      })
    }).catch(() => {
      Notify({ type: 'success', message: '已取消删除' })
    })
  }
}

export default Operations
