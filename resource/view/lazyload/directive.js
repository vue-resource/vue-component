var listener = null;
var directives = {
  'lazyload':{
    inserted:function(el,binding,vnode){
      listener = new EventListener(el,binding,vnode)
    },
    update:function(el,binding,vnode){
      if(binding.value === binding.oldValue){//没有变化就返回
          return;
      }
      listener.update(el,binding.value);
    },
    unbind:function(el,binding,vnode){
      listener.removeListen()
    }
  }
};
