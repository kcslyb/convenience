// 节流指令
const throttle = {
  inserted: function (el: any, binding: any) {
    let timer: any = ''
    el.addEventListener('click', () => {
      if (!timer) {
        binding.value()
        timer = +new Date()
      } else {
        const timeout = binding.arg ? Number(binding.arg) : 3000
        const temp = +new Date()
        if (temp > timer + timeout) {
          timer = ''
        }
      }
    })
  }
}

export default throttle
