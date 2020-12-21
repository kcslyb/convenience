import debounce from './debounce'
import throttle from './throttle'
import draggable from './draggable'
import waterMarker from './waterMarker'
// 自定义指令
const directives: any = {
  throttle,
  debounce,
  draggable,
  waterMarker
}

export default {
  install (Vue: any) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}
