(function (doc, win) {
  const docEl = doc.documentElement
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  const reCalc = function () {
    const clientWidth = docEl.clientWidth
    let widBase = 375
    if (!clientWidth) return
    else if (clientWidth >= 360 && clientWidth <= 500) {
      widBase = 375
    } else if (clientWidth > 500 && clientWidth < 720) {
      widBase = 480
    } else if (clientWidth > 720 && clientWidth < 1200) {
      widBase = 560
    } else if (clientWidth > 1200) {
      widBase = 640
    }
    docEl.style.fontSize = 16 * (clientWidth / widBase) + 'px'
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, reCalc, false)
  doc.addEventListener('DOMContentLoaded', reCalc, false)
})(document, window)
