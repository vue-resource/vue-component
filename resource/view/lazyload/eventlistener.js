var EventListener = function(el,binding,vnode){
  this.el = el;
  this.binding = binding;
  this.vnode = vnode;
  this.$vm = vnode.context;
  this.imageBox = null;
  this.$lazyload = vnode.context.$lazyload;
  this.init()
}
EventListener.prototype = {
  constructor:EventListener,
  init:function(){
    if(typeof this.binding.value !== 'string'){
      throw new Error("您的图片源不是String类型，请重试!");return;
    }
    this.imageBox = this.$vm.imageBox;
    this.imageBox.add(this.el,this.binding.value)
    this.startListen()
    this.listenProcess()
  },
  //开始监听
  startListen:function(){
    document.addEventListener("scroll",this.listenProcess.bind(this),false)
  },
  //移除监听
  removeListen:function(){
    document.removeEventListener("scroll",this.listenProcess.bind(this),false)
  },
  // 监听进程
  listenProcess:function(){
    var self = this
    if(self.imageBox.item.length === 0){return;}
    self.imageBox.item.forEach(function(item){
      if(hasSeen(item)){//已出现在可视区范围内
        var image = new Image();
        image.src = item.src;
        self.addImgLoading(item.ele)
        self.imageBox.addPending(item.ele,item.src);
        image.onload = function(){
          if(image.complete){
            self.imageLoaded(item)
          }
        }
        image.onerror = function(){
          self.imageError(item)
        }
      }
    })
  },
  update:function(ele,src){
    this.imageBox.update(ele,src);
    this.listenProcess();
  },
  imageLoaded:function(item){
    this.removeImgLoading(item.ele)
    this.imageBox.addDone(item.ele,item.src)
    this.paintImg(item.ele,item.src)
  },
  imageError:function(item){
    this.removeImgLoading(item.ele)
    this.imageBox.addFailed(item.ele,item.src)
    this.paintImg(item.ele,this.$lazyload.errorUrl)
  },
  addImgLoading:function(ele){
    ele.style.background = "url("+this.$lazyload.loadUrl+") no-repeat 100% 100% center;"
  },
  removeImgLoading:function(ele){
    ele.style.background = ""
  },
  paintImg:function(ele,src){
    ele.src = src
  }
}
