var CreateAjax = function(){
  var xmlhttp = null;
  if(window.XMLHttpRequest){
    xmlhttp = new XMLHttpRequest();
  }
  if(window.ActiveXObject){
    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
  }
  return xmlhttp
}
/**
 * [Ajax 描述请求]
 * type:请求方式
 * url:请求地址 （get方式时需要把参数拼接地址栏上）
 * data:请求参数：在post方式时，需要传递
 * config
 *   async:是否异步 默认true
 *   contentType: 'application/json' 请求头
 *   dataType:数据类型 
 */
var Ajax = {
  install:function(Vue,option){
    Vue.prototype.$http = function(type,url,data,config){
      var http = CreateAjax();
      var _config = Object.assign({
        async:true,
        contentType: 'application/json',
        dataType:''
      },config)
      type = type.toLowerCase();
      //建立请求
      if(type === 'get'){
        http.open(type,url,_config.async) //注意get请求要加上一个随机数，避免走缓存请求
      }else if(type === 'post'){
        http.open(type,url,data,_config.async)
      }
      //设置的请求头
      http.setRequestHeader('Content-type',_config.contentType) //如果想像表单那样请求数据，设置请求头为：application/x-www-form-urlencoded

      return new Promise(function(resolve,reject){
        //发送请求
        http.send(type === 'post' ? data : null)
        //响应结果
        http.onreadystatechange = function(){
          if(http.readyState === 4 && http.status === 200){
            resolve(JSON.parse(http.response))
          }
        }
      })
    }
  }
}

Vue.use(Ajax)
