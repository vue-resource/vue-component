/**
 * 走马灯效果
 * 
 */
var swiper_item = {
  template: '<div class="swiper-item">'
              +'<slot></slot>'
            +'</div>',
  mounted:function(){
    var self = this
    this.$nextTick(function(){
      self.$parent.init()
    })
  },
  beforeDestroy:function(){
    var self = this
    this.$nextTick(function(){
      self.$parent.destroy()
    })
  }
}

var swiper = {
  template:'<div class="swiper" ref="swiper" :style="{height: height+\'px\'}" @touchstart="moveStart" @touchmove="moving" @touchend="moveEnd">'
              +'<slot></slot>'
              +'<slot name="indicator">'
                +'<div class="indicator"><span class="font font-danger">{{active+1}}</span>/{{nodes.length}}</div>'
              +'</slot>'
            +'</div>',
  props:{
    height:{
      type:Number,
      default:0
    }
  },
  data:function(){
    return {
      container:null,//操作容器
      _width:0,//走马灯的单元宽度
      nodes:[],//子节点列表
      isMoving:false,//手指是否正在移动
      duration:300,//手指移动时，滚动元素动画过度时间
      sensitivity:60,//触发切换的阈值
      resistance:0.2,// 阻力系数:只在开始和结束得时候有效果，像弹簧一样的效果  值越小阻力越大
      active:0,// 当前在视图范围内的索引
      start:{//鼠标开始移动的坐标
        x:0,
        y:0
      },
      end:{//鼠标移动过程中的坐标
        x:0,
        y:0
      }
    }
  },
  methods:{
    init:function(){
      this.container = this.$refs.swiper
      this._width = this.container.offsetWidth || document.documentElement.offsetWidth
      this.nodes = this.container.querySelectorAll('.swiper-item')
      this.setTransform()
      this.setTransition()
    },
    setTransform:function(offset){
      var self = this;
      offset = offset || 0;
      [].forEach.call(self.nodes,function(node,idx){
        var distance = (idx-self.active) * self._width + offset;
        var transform = 'translate3d('+distance+'px,0,0)';
        node.style.webkitTransform = transform;
        node.style.transform = transform;
      })
    },
    setTransition:function(duration){
      var self = this;
      duration = duration || self.duration;
      duration = typeof duration === 'number'?duration+'ms':duration;
      [].forEach.call(self.nodes,function(node,idx){
        node.style.transition = duration;
        node.style.webkitTransition = duration;
      })
    },
    moveStart:function(e){
      this.start.x = e.changedTouches[0].pageX;
      this.start.y = e.changedTouches[0].pageY;
      this.setTransition("none")
    },
    moving:function(e){
      e.preventDefault();
      e.stopPropagation();
      var dis_x = e.changedTouches[0].pageX - this.start.x;
      var dis_y = e.changedTouches[0].pageY - this.start.y;
      if(Math.abs(dis_x) >= Math.abs(dis_y)){
        this.isMoving = true;
        //首尾增加阻力系数
        if((this.active === 0 && dis_x>0)||(this.active === this.nodes.length-1 && dis_x<0)){
          dis_x = dis_x * this.resistance
        }
        this.setTransform(dis_x)
      }
    },
    moveEnd:function(e){
      if(!this.isMoving) return;
      this.end.x = e.changedTouches[0].pageX;
      this.end.y = e.changedTouches[0].pageY;
      var dis_x = this.end.x - this.start.x;
      if(Math.abs(dis_x) > this.sensitivity){
        if(dis_x<0){
          this.active ++;
        }else{
         this.active --;
        }
        this.go();
      }else{
        this.back()
      }
      this.reset();
    },
    back:function(){
      this.setTransition()
      this.setTransform()
    },
    reset:function(){
      this.isMoving = false;
      this.start.x = 0
      this.start.y = 0
      this.end.x = 0
      this.end.y = 0
    },
    go:function(){
      if(this.active < 0){
        this.active = this.isMoving ? 0 :this.nodes.length -1
      }
      if(this.active>this.nodes.length -1){
        this.active = this.isMoving ? this.nodes.length-1:0
      }
      this.$emit('change', this.active)
      this.setTransform()
      this.setTransition()
    },
    destroy:function(){
      this.setTransition('none')
    }
  }
}

Vue.component('swiper',swiper)
Vue.component('swiper-item',swiper_item)

