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

