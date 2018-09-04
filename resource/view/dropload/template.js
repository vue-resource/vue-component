var template = {
  template:'<div class="scroll" ref="scroll">'
              +'<div class="scroll-wrap">'
                +'<slot></slot>'
              +'</div>'
              +'<slot name="loading">'
                +'<div class="scroll-loading" v-if="isLoading">{{loadingTxt}}</div>'
              +'</slot>'
              +'<slot name="complete">'
                +'<div class="scroll-complete" v-if="isComplete">{{completeTxt}}</div>'
              +'</slot>'
            +'</div>',
  props:{
    loadingTxt:{
      type:String,
      default:'拼命加载中……'
    },
    completeTxt:{
      type:String,
      default:'TMD，做人要有底线！'
    },
    debounce:{
      type:[Number,String],
      default:50
    },
    initFn:{
      type:Function,
      default:function(o){console.warn(o)}
    }
  },
  data:function(){
    return {
      isLoading:false,
      isComplete:false,
      scroll:null
    }
  },
  mounted:function(){
    this.$nextTick(this.init)
  },
  watch:{
    isLoading:function(nv){
      if(nv){
        this.$emit('loadmore')
      }
    }
  },
  methods:{
    // 初始化组件，获取组件容器，并给组件容器节点绑定滚动事件
    init:function(){
      this.scroll = this.$refs.scroll
      this.scroll.addEventListener('scroll',this.handleScroll)
      //如果配置了初始化的处理函数则应处理初始化
      this.initFn("***********^~下拉查询组件初始化完成！~^*************")
    },
    handleScroll:function(){
      // 如果数据全部加载完成了，则再也不触发loadmore事件
      if(this.isComplete) return;
      var scrollTop = this.scroll.scrollTop
      var scrollHeight = this.scroll.offsetHeight
      var wrapHeight = this.scroll.querySelector('.scroll-wrap').offsetHeight
      // 组件容器滚的距离 + 组件容器本身距离大于或者等于正文容器高度 - 指定数值 则触发loadmore事件
      if(scrollTop + scrollHeight + this.debounce >= wrapHeight){
        this.isLoading = true
      }
    },
    complete:function(){
      this.isLoading = false
      this.isComplete = true
      this.scroll.removeEventListener('scroll',this.handleScroll)
    }
  }
}

var Dropload = Vue.extend(template)
Dropload.prototype.loaded = function(){
  this.isLoading = false
}


