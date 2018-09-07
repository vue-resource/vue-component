var pagination = {
  template: '<div class="pagination-box">'
              +'<slot name="total">'
                +'<div class="total-til">总计<span class="font font-danger">{{totalNum}}</span>条</div>'
              +'</slot>'
              +'<div class="pagination" v-if="pageCount>0">'
                +'<span class="page-btn" :class="{disabled:pageIndex===1}" @click="changePage(1,pageIndex===1)">{{label[0]}}</span>'
                +'<span class="page-btn" :class="{disabled:pageIndex===1}" @click="changePage(pageIndex-1,pageIndex===1)">{{label[1]}}</span>'
                +'<div class="page-num-box">'
                  +'<span v-if="page.num>0" class="page-btn square" :class="{active:page.num === pageIndex}" v-for="(page,idx) in model" @click="changePage(page.num,page.num===pageIndex)">{{page.num}}</span>'
                  +'<span v-else class="page-btn square">...</span>'
                +'</div>'
                +'<span class="page-btn" :class="{disabled:pageIndex===pageCount}" @click="changePage(pageIndex+1,pageIndex===pageCount)">{{label[2]}}</span>'
                +'<span class="page-btn" :class="{disabled:pageIndex===pageCount}" @click="changePage(pageCount,pageIndex===pageCount)">{{label[3]}}</span>'
                +'<div class="page-tools-box" v-if="showTools">'
                  +'每页：<select @change="handleSizeChange($event.target.value)"><option v-for="(page,idx) in pageLimt" :value="page" :selected="page===pageSize">{{page}}</option></select>条&nbsp;'
                  +'，第 <input type="text" class="page-go" v-model="toPage"/>&nbsp; 页&nbsp; <b class="btn btn-blue" @click="handleGo">跳转</b>'
                +'</div>'
              +'</div>'
            +'</div>',
  props:{
    label:{
      type:Array,
      default:function(){
        return ['<<','<','>','>>']
      }
    },
    totalNum:{
      type:Number,
      default:0
    },
    pageCount:{
      type:Number,
      default:0
    },
    pageIndex:{
      type:Number,
      default:0
    },
    pageSize:{
      type:Number,
      default:20
    },
    showTools:{
      type:Boolean,
      default:false
    }
  },
  data:function(){
    return {
      pageLimt:[10,20,50,100,1000],
      model:[], //分页数据模型  0代表...  其余代表具体页码值
      toPage:""
    }
  },
  created:function(){
    var self = this;
    if(this.pageCount < 8){ //总页数 小于7页的时候全部展示 如：1,2,3,4,5,6,7
      this.append(1,this.pageCount)
    }else{
      if(this.pageIndex<4){// 前面有省略号且中间页与首页重合（即：当前页小于4） 即：1,2,3,4,5...10 这种形式
        this.append(1,5)
        this.model.push({num:0},{num:self.pageCount})
      }else if(this.pageIndex<5){//前面有省略号且中间5页与首页不重合(即：中间页与首页的跨度为0,则：当前页只能为4或5) 即:1,2,3,4,5,6...10
        this.append(1,this.pageIndex+2)
        this.model.push({num:0},{num:self.pageCount})
      }else{
        this.model.push({num:1},{num:0})
        if(this.pageIndex< this.pageCount-3){//前面和后面都有省略号  即:中间5页距离末页的跨度》=2  如：1...4,5,6,7,8...10
          this.append(this.pageIndex-2,this.pageIndex+2)
          this.model.push({num:0},{num:self.pageCount})
        }else if(this.pageIndex<this.pageCount-2){//后面有省略号且中间5页与尾页不重合。即：中间5页与尾页没有交集。如：1...5,6,7,8,9,10
          this.append(this.pageIndex-2,this.pageCount)
        }else{//后面有省略号但是中间5页与尾页重合
          this.append(this.pageCount-4,this.pageCount)
        }
      }
    }
  },
  methods:{
    append:function(start,end){
      for(var i=start;i<=end;i++){
        this.model.push({num:i})
      }
    },
    changePage:function(pageTarget,isDisable){
      if(!isDisable){
        this.$emit('page-change',pageTarget)
      }
    },
    handleSizeChange:function(size){
      this.$emit('size-change',size)
    },
    handleGo:function(){
      this.$emit('go-page',this.toPage)
    }
  }
};

Vue.component('pagination',pagination)
