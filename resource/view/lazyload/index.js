// Object.keys(directives).forEach(function(key){
//   Vue.directive(key,directives[key])
// })
var MyLazyload = {
  install:function(Vue,options){
    //定义全局属性
    Vue.prototype.$lazyload = new Lazyload(options)
    //定义混合
    Vue.mixin(mixin)
    //定义指令
    Vue.directive('lazyload',directives.lazyload)
  }
}

Vue.use(MyLazyload,{
 loadUrl : './image/loading.gif',
 errorUrl: './image/imgerror.png'
});

var vm = new Vue({
  el:'#wrap',
  data:{
    images:[
      "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
      "http://img.sccnn.com/bimg/338/24556.jpg",
      "http://img.zcool.cn/community/01b88659bb7903a801212fb7949ee0.jpg@2o.jpg",
      "http://img.zcool.cn/community/011d1159784366a8012193a3e7da5c.jpg@1280w_1l_2o_100sh.jpg",
      "http://img.zcool.cn/community/019f4e57207bc432f875a3990cbb6b.PNG@1280w_1l_2o_100sh.png",
      "http://img.sccnn.com/bimg/338/27467.jpg",
      "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
      "http://img.sccnn.com/bimg/338/24556.jpg",
      "http://img.zcool.cn/community/01b88659bb7903a801212fb7949ee0.jpg@2o.jpg",
      "http://img.zcool.cn/community/011d1159784366a8012193a3e7da5c.jpg@1280w_1l_2o_100sh.jpg",
      "http://img.zcool.cn/community/019f4e57207bc432f875a3990cbb6b.PNG@1280w_1l_2o_100sh.png",
      "http://img.sccnn.com/bimg/338/27467.jpg",
      "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
      "http://img.sccnn.com/bimg/338/24556.jpg",
      "http://img.zcool.cn/community/01b88659bb7903a801212fb7949ee0.jpg@2o.jpg",
      "http://img.zcool.cn/community/011d1159784366a8012193a3e7da5c.jpg@1280w_1l_2o_100sh.jpg",
      "http://img.zcool.cn/community/019f4e57207bc432f875a3990cbb6b.PNG@1280w_1l_2o_100sh.png",
      "http://img.sccnn.com/bimg/338/27467.jpg"
    ]
  }
})
