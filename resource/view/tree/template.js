var tree = {
  template: '<div class="tree-wrap">'
              +'<div class="trunk" v-for="(item,idx) in source">'
                +'<div class="tree-label">'
                  +'<span class="arrow arrow-right"></span>'
                  +'<span class="checkbox" v-if="showCheckbox"><input type="checkbox" /></span>'
                  +'<span class="label">{{item[_config.label]}}</span>'
                +'</div>'
                +'<div class="sub-tree" v-if="item[_config.children] && item[_config.children].length>0">'
                 +'<tree :source="item[_config.children]" :config="_config"></tree>'
                +'</div>'
              +'</div>'
            +'</div>',
  props:{
    source:{
      type:Array,
      default:function(){
        return []
      }
    },
    config:{
      type:Object,
      default:function(){
        return {}
      }
    },
    showCheckbox:{
      type:Boolean,
      default:true
    },
    expand:{
      type:String,
      default:"none" //有 none,all,first  分别对应：全部折叠，全部展开，只展开第一层级
    }
  },
  data:function(){
    return {
      defaultConfig:{
        label:'name',
        value:'value',
        children:'children'
      }
    }
  },
  computed:{
    _config:function(){
      return Object.assign(this.defaultConfig,this.config)
    }
  },
  methods:{

  }
}

Vue.component('tree',tree)
