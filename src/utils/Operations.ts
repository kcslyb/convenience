import { Notify } from 'vant'
class Operations {
  private api: any

  constructor(api: any) {
    this.api = api
  }

  add (params: any, callback: Function) {
    this.api.post(params).then(() => {
      Notify({ type: 'success', message: '新增成功' })
      callback()
    })
  }
  edit (params: any, callback: Function) {
    this.api.put(params).then(() => {
      Notify({ type: 'success', message: '修改成功' })
      callback()
    })
  }
}

export default Operations
