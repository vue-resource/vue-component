var hasSeen = function (item) {
    var ele = item.ele;
    var src = item.src;
    //图片距离页面顶部的距离
    var top = ele.getBoundingClientRect().top;
    //页面可视区域的高度
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    //top + 10 已经进入了可视区域10像素
    return windowHeight - top >= 20
}
