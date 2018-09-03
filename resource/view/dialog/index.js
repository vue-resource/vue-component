/**
 * 1、消息提示
 *   参数说明：
 *    message:消息内容
 *    type：主题，默认info
 *    dangerouslyUseHTMLString:是否将 message 属性作为 HTML
 *    duration：显示时间, 毫秒。设为 0 则不会自动关闭 默认30
 *    showClose：是否显示关闭按钮，默认false
 *    center:文字是否居中,默认false
 *    onClose:关闭时的回调函数, 参数为被关闭的 message 实例
 */
var message_vue = {
  template:'<div :class="[\'sm-message\',themeCls,active?\'active\':\'\']" ref="message"><div :class="{\'center\':msgConfig.center}"></div><span v-if="msgConfig.showClose" class="icon icon-delete" @click="handleClose"></span></div>',
  data:function(){
    return {
      msgConfig:{
        message:"",
        type:"info",
        dangerouslyUseHTMLString:false,
        duration:3000,
        showClose:false,
        center:false,
        onClose:null
      },
      active:false,
      timer:null
    }
  },
  computed:{
    themeCls:function(){
      return "sm-message-"+this.msgConfig.type
    }
  },
  methods:{
    renderTmpl:function(){
      var self = this
      this.$nextTick(function(){
        if(this.msgConfig.dangerouslyUseHTMLString){//html字符串
          this.$refs.message.querySelector('div').innerHTML = this.msgConfig.message
        }else{//纯字符渲染
          this.$refs.message.querySelector('div').textContent = this.msgConfig.message
        }
        this.timer = setTimeout(function(){
         self.active = false
        },self.msgConfig.duration)
      })
    },
    setConfig:function(config){
      this.msgConfig = Object.assign(this.msgConfig,config)
      this.active = true
      this.renderTmpl()
    },
    handleClose:function(){
      if(this.msgConfig.onClose){
        this.msgConfig.onClose();
      }else{
        clearTimeout(this.timer)
        document.body.removeChild(this.$refs.message)
      }
    }
  }
}
/**
 * 2、loading 加载
 *   参数说明：
 *    message:提示内容
 */
var loading_vue = {
  template: '<div class="loading-box" v-show="canSee" ref="loading">'
                +'<div class="loading-content">'
                +'    <div class="loading-animate"></div>'
                +'    <div class="loading-text">{{text}}</div>'
                +'</div>'
            +'</div>',
  data:function(){
    return {
      text:"努力加载中",
      canSee:false
    }
  },
  methods:{
    show:function(text){
      this.text = text || this.text
      this.canSee = true
    },
    hide:function(){
      this.$refs.loading.remove()
    }
  }
}
/**
 * 3、tooltip 辅助性提示文字
 *   参数说明：
 *     content: 提示文案
 *     place: 展示位置，有：left,top,right,bottom4个。默认是top
 *     show:是否展示
 *     delay:延时显示
 *     theme: 提示主题
 */
var tooltip_vue = {
  template:'<div class="tip-box" ref="tipbox" v-show="visible" :class="[cls,baseOpt.theme]">{{baseOpt.content}}<span class="tip-arrow"></span></div>',
  data:function(){
    return {
      baseOpt:{
        content:"",
        place:"top",
        delay:300,
        theme:""
      },
      visible:false
    }
  },
  computed:{
    cls:function(){
      switch(this.baseOpt.place){
        case 'left':
          return 'tip-left';break;
        case 'right':
          return 'tip-right';break;
        case 'bottom':
          return 'tip-bottom';break;
        default:
          return 'tip-top';
      }
    }
  },
  methods:{
    show:function(config){
      var self = this;
      self.baseOpt = Object.assign(self.baseOpt,config)
      self.visible = true
      this.$nextTick(function(){
         var size = self.$refs.tipbox.getBoundingClientRect()
         switch(self.baseOpt.place){
            case 'left':
              self.$refs.tipbox.style.left = "-"+(size.width+5)+"px";break;
            case 'right':
              self.$refs.tipbox.style.right = "-"+(size.width+5)+"px";break;
            case 'bottom':
              self.$refs.tipbox.style.bottom = "-"+(size.height+5)+"px";break;
            default:
              self.$refs.tipbox.style.top = "-"+(size.height+5)+"px";
         }
      })
    },
    hide:function(e){
      e.target.removeChild(this.$refs.tipbox)
    }
  }
}
