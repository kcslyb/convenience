// 防抖指令
/**
 * func: 回调函数
 * flag: 可通过flag来标识是否立即执行； 默认值： true
 * timeout: 可通过timeout来设置等待时间； 默认值： 3000
 */
const debounce = {
  inserted: function (el: any, binding: any) {
    if (Object.prototype.toString.call(binding.value).slice(8, -1) !== 'Object') {
      throw new Error('binding.value需要为对象')
    }
    if (!Object.prototype.hasOwnProperty.call(binding.value, 'func')) {
      throw new Error('binding.value没有属性名为func的回调方法')
    }
    let timer: any
    const timeout = binding.arg ? Number(binding.value.arg) : 3000
    // 判断是否立即执行
    const flag = Object.prototype.hasOwnProperty.call(binding.value, 'flag') ? binding.value.flag : true
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer)
        el.style.opacity = 0.5
      }
      // 立即执行
      if (flag) {
        const noPerform = !timer
        // 等待wait的时间间隔后，timer设置为null，函数才可以继续执行
        timer = setTimeout(() => {
          timer = null
          el.style.opacity = 1
        }, timeout)
        // 执行
        if (noPerform) {
          binding.value.func()
          el.style.opacity = 0.5
        }
      } else { // 等待timeout的时间间隔后执行
        timer = setTimeout(() => {
          binding.value.func()
          el.style.opacity = 1
        }, timeout)
      }
    })
  }
}

export default debounce
