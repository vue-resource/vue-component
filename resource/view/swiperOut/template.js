var swiper_out = {
  template: '<ul class="swiper-out" ref="swiper"><slot></slot></ul>',
  data:function(){
    return {
      activeItem:null
    }
  },
  methods:{
    changeActiveItem:function(item){
      if(this.activeItem !== item){
        if(this.activeItem && this.activeItem.close){
          this.activeItem.close()
        }
        this.activeItem = item
      }
    },
    delItem:function(node){
      this.$refs.swiper.removeChild(node)
    }
  },
  created:function(){
    this.$on('changeActiveItem',this.changeActiveItem)
    this.$on('removeChild',this.delItem)
  }
};
var swiper_out_item = {
  template: '<li class="swiper-out-item" ref="swiperItem" :style="itemStyle" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">'
              +'<div class="swiper-out-item-content"><slot></slot></div>'
              +'<div class="swiper-out-item-btns">'
                +'<slot name="btns">'
                  +'<div class="swiper-out-item-btn" @click="handleDel">删除</div>'
                +'</slot>'
              +'</div>'
            +'</li>',
  data:function(){
    return {
      translateX:0,
      speed:0,
      start:null,
      end:null,
      btnWidth:0,
      sensitivity:30, //阈值
      isComplete:false//是否完全滑出
    }
  },
  computed:{
    itemStyle:function(){
      var self = this;
      return {
        transform:'translate3d('+self.translateX+'px,0,0)',
        transition:'all '+self.speed+'ms'
      }
    }
  },
  methods:{
    touchstart:function(e){
      this.speed = 0;
      this.start = e.touches[0]
    },
    touchmove:function(e){
      e.preventDefault();
      e.stopPropagation();
      this.end = e.touches[0];
      var dis_x = this.end.pageX - this.start.pageX;
      var dis_y = this.end.pageY - this.start.pageY;

      if(this.isComplete && dis_x<0){return false;}//如果完全滑出了还往左滑则不生效

      if(dis_x>=0){this.speed = 300;}
      if(Math.abs(dis_x) >= Math.abs(dis_y)){
        this.$parent.$emit('changeActiveItem',this)
        this.translateX = dis_x>0 ? 0 : Math.abs(dis_x)>this.btnWidth ? -this.btnWidth : dis_x
      }
    },
    touchend:function(e){
      this.translateX = this.translateX < -this.sensitivity ? -this.btnWidth : 0;
      this.speed = 300;
      this.isComplete = this.translateX < -this.sensitivity
    },
    close:function(){
      this.translateX = 0
    },
    handleDel:function(){
      this.$parent.$emit('removeChild',this.$el)
    }
  },
  mounted:function(){
    var self = this;
    self.$nextTick(function(){
      var btnBox = self.$refs.swiperItem.querySelector('.swiper-out-item-btns');
      self.btnWidth =btnBox.offsetWidth
      btnBox.style.lineHeight = btnBox.offsetHeight+"px"
    })
  }
}

Vue.component('swiper-out',swiper_out);
Vue.component('swiper-out-item',swiper_out_item)
