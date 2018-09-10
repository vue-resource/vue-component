var real_search = {
  template: '<div class="real-time-search-box">'
              +'<input type="text" v-model="keyword" :placeholder="placeholder" @blur="show=false" @focus="show=true" @input="handleChange"/>'
              +'<div class="data-box" v-show="show">'
                +'<slot>'
                  +'<ul v-if="dataList.length>0">'
                    +'<li v-for="(item,idx) in dataList" v-html="item[newConfig.label]" @click="handleSelect(item)"></li>'
                  +'</ul>'
                +'</slot>'
                +'<slot name="empty-til"><div v-if="dataList.length === 0" class="empty-til">暂无数据</div></slot>'
              +'</div>',
  props:{
    placeholder:{
      type:String,
      default:'请输入关键字'
    },
    config:{
      type:Object,
      default:function(){
        return {
          label:'name',
          value:'value'
        }
      }
    },
    url:{
      type:String,
      default:''
    },
    keyWord:{
      type:String,
      default:""
    },
    stress:{
      type:Boolean,
      default:false
    },
    source:{
      type:Array,
      default:function(){
        return [];
      }
    }
  },
  data:function(){
    return {
      show:false,
      keyword:this.keyWord,
      dataList:[]
    }
  },
  computed:{
    newConfig:function(){
      return Object.assign({label:'name',value:'value'},this.config)
    }
  },
  created:function(){
    this.init();
  },
  methods:{
    init:function(){
      var self = this;
      if(this.url.length>0){//实施请求数据
        this.goHttp()
      }else{
        this.filterKey()
      }
    },
    filterKey:function(){
      this.filterByKeyWord(this.source)
    },
    goHttp:function(){
      var self = this;
      this.$http('get',this.url+'?name='+self.keyword).then(function(res){
        self.filterByKeyWord(res)
      })
    },
    filterByKeyWord:function(arr){
      var self = this;
      self.dataList = arr.filter(function(item){
        return item[self.newConfig.label].indexOf(self.keyword) > -1
      });
      if(this.stress){
        var rule = new RegExp(self.keyword,'g');
        self.dataList.map(item => {
          item[self.newConfig.label] = item[self.newConfig.label].replace(rule,'<span class="font font-danger">'+self.keyword+'</span>')
        })
      }
    },
    handleChange:function(){
      this.$emit('change')
      this.init()
    },
    handleSelect:function(item){
      this.keyword = item[this.newConfig.label]
      this.init()
      this.$emit('select',item[this.newConfig.value])
    }
  }
}


Vue.component('real-time-search',real_search)
