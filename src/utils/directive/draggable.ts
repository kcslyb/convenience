// 拖拽指令
const draggable = {
  inserted: function (el: any) {
    el.style.cursor = 'move'
    el.onmousedown = function (e: any) {
      const disX = e.pageX - el.offsetLeft
      const disY = e.pageY - el.offsetTop
      document.onmousemove = function (e) {
        let x = e.pageX - disX
        let y = e.pageY - disY
        const maxX = document.body.clientWidth - parseInt(window.getComputedStyle(el).width)
        const maxY = document.body.clientHeight - parseInt(window.getComputedStyle(el).height)
        if (x < 0) {
          x = 0
        } else if (x > maxX) {
          x = maxX
        }

        if (y < 0) {
          y = 0
        } else if (y > maxY) {
          y = maxY
        }

        el.style.left = x + 'px'
        el.style.top = y + 'px'
      }
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null
      }
    }
  }
}
export default draggable