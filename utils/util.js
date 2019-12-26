let isClick = false;
let clickFn = function () {
  if (!isClick) {
    isClick = true
    setTimeout(function () {
      isClick = false
    }, 500);
    return false;
  } else {
    return true;
  }
}
module.exports = {
  clickFn: clickFn
}