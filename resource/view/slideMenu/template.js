var slide_menu = {
  template: '<div class="slide-menu absolute-full">'
              +'<div class="slide-menu-wrap absolute-full" :class="transitionCls" :style="wrapStyle">'
                +'<slot name="slide-menu"></slot>'
              +'</div>'
              +'<div class="slide-menu-content absolute-full" :class="transitionCls" :style="commentStyle" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">'
                +'<slot></slot>'
              +'</div>'
            +'</div>',
  props:{
    width:{
      type:String,
      default:'150'
    }
  },
  computed:{
    wrapStyle:function(){
      var self = this;
      return {
        width:self.width.indexOf('%')>-1 ? self.width : self.width+'px',
        left:self.width.indexOf('%')>-1 ? "-"+(parseInt(self.width)/self.radio+"%") : "-"+(self.width/self.radio)+'px',
        transform:'translate3d('+(self.transformX/self.radio)+'px,0,0)',
        webkitTransform:'translate3d('+(self.transformX/self.radio)+'px,0,0)'
      }
    },
    commentStyle:function(){
      var self = this;
      return {
        transform:'translate3d('+self.transformX+'px,0,0)',
        webkitTransform:'translate3d('+self.transformX+'px,0,0)'
      }
    }
  },
  data:function(){
    return {
      transitionCls: '',
      radio:2,//内容区移动速度/菜单移动速度
      start:null,
      end:null,
      transformX:0,
      isMoving:false, //是否正在移动
      sensitivity:80 //超过100px时全部展示
    }
  },
  methods:{
    touchstart:function(e){
      this.start = e.touches[0]
      this.transitionCls = ""
    },
    touchmove:function(e){
      e.preventDefault();
      e.stopPropagation();
      this.end = e.touches[0];
      var dis_x = this.end.pageX - this.start.pageX;
      var dis_y = this.end.pageY - this.start.pageY;
      if(Math.abs(dis_x) >= Math.abs(dis_y)){
        if(this.isMoving && dis_x>0){return;}
        this.transformX = dis_x<=0 ? 0 : dis_x >= this.width ? this.width : dis_x
      }
    },
    touchend:function(e){
      this.transitionCls = 'transition'
      this.isMoving = this.transformX > this.sensitivity;
      this.transformX = this.transformX > this.sensitivity ? this.width : 0
    }
  }
}

Vue.component('slide-menu',slide_menu);
