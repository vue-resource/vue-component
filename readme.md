如何理解vue中的组件
##################

## 前言
  怎样注册一个组件？
  你知道extend,extends,component,mixins,install的区别吗？
  你知道他们之间的执行顺序吗？
  你知道他们之间的数据合并策略吗？
  你知道全局组件和局部组件吗？
  你知道如何提高组件的可复用性吗？
  你知道如何扩展组件吗？

## 组件的创建和注册
  1、Vue.extend()方法是对Vue构造器的扩展，调用Vue.extend()创建了一个组件构造器，而非一个组件实例
  2、Vue.extend()方法接受一个配置对象，里边的template属性是组件将要渲染的html结构，并且保证最外层标签只有一个；并可以在里边绑定各种的数据，属性，事件等操作
  3、Vue.component()接受2个参数，第一个是组件名（标签名）,另外一个参数是上述创造的组件构造器
  4、Vue.component()的第二个参数也可以直接接受配置对象，而非组件构造器，其内部会自动调用组件构造器
  5、组件必须挂载到某个vue实例上才会生效

## 如何创建组件

### Vue.extend
  实际上是创造了一个组件构造器，并将其挂载到对应的dom元素上。主要应用：是为了创造【`可复用的组件`】
``` javascript
  var Profile = Vue.extend({
    //template对应的标签最外层必须只有一个标签
    template: '<div>{{extendData}}<br/>{{propData}}</div>',
    data:function() {
      return {
        extendData:"我是extend的数据"
      }
    },
    props:['propData'],
    created:function(){
      console.log("我被创建了……")
    },
    mounted:function(){
      console.log("我被挂载了……")
    }
  })
  //创建 Profile 实例，并挂载到一个元素上。可以通过propsData传参.
  new Profile({propsData:{propData:"我是实际传入的数据。"}}).$mount('#wrap')
```
  通过运行以上代码，不难发现：当组件构造器实例不挂载到dom元素上之前，会输出`我被创建了……`，挂载之后会显示：`我被挂载了……`

### Vue.component
  两个参数,一个组件名,一个extend构造器或者对象。主要用途是：`创建全局组件，使用方便`
``` javascript
  var baseOpt = {
      template: '<div>{{extendData}}<br/>{{propData}}</div>',
      data:function(){
        return {
          extendData:"我是Vue.component引入的数据."
        }
      },
      props:['propData']
    }
    var Profile = Vue.extend(baseOpt);//创建组件构造器
    // 以下2种方法都可以创建组件
    Vue.component('my-component',Profile); // 传入构造器
    //Vue.component('my-component',baseOpt); //传入配置

    //挂载到实例上
    var vm = new Vue({el:'#wrap'})

    //获取组件构造器
    var Con = Vue.component('my-component');
    console.log(Con === Profile) //true
```
  可以发现，由于Vue.extend构造器是全局的。所以任何全局组件都可以通过Vue.component方法来获取器对应的构造器。

### mixins
  扩展组件功能。【可扩展多个指定组件，数组形式】
``` javascript
  var mixin_one = {
      data:{
        mixinData:"我是mixin_one的数据",
        num:0
      },
      computed:{
        calData:function(){
            return "mixin_one"
        }
      },
      watch:{
        num:function(nv,ov){
          console.log("mixin_one的num改变了")
        }
      },
      filters:{
        'percent':function(val){
          return val+"%"
        }
      },
      methods:{
        getInfo:function(){
          console.log("我是mixin_one的方法")
          this.num++;
        }
      },
      created:function(){
        console.log("我是在mixin_one中创建的")
      }
    }
    var mixin_two = {
      data:{
        mixinData:"我是mixin_two的数据",
        num:0
      },
      computed:{
        calData:function(){
            return "mixin_two"
        }
      },
      watch:{
        num:function(nv,ov){
          console.log("mixin_two的num改变了")
        }
      },
      filters:{
        'placeholder':function(val){
          return val.length>0?"^"+val+"^":"---"
        }
      },
      methods:{
        getInfo:function(){
          console.log("我是mixin_two的方法")
          this.num++;
        }
      },
      created:function(){
        console.log("我是在mixin_two中创建的")
      }
    }

    var vm = new Vue({
      el: '#wrap',
      data:{
        mixinData: '我是实例中的数据',
        num:0
      },
      computed:{
        calData:function(){
            return "vm"
        }
      },
      watch:{
        num:function(nv,ov){
          console.log("vm的num改变了")
        }
      },
      filters:{
        'percent':function(val){
          return val+"%%"
        }
      },
      mixins:[mixin_one,mixin_two],
      methods:{
        getInfo:function(){
          console.log("我是实例的方法");
          this.num++;
        }
      },
      created:function(){
        console.log("我是在实例中创建的")
      }
    })
```
  通过运行以上代码，我们得到如下结论：
  1、代码执行顺序为：mixin_one->mixin_two->vm实例
  2、mixin_one、mixin_two，vm实例中的生命周期函数都会执行
  3、子组件和父组件的watch会合并到一个数组里，父组件在前，子组件在后
  4、像data，computed，methods，props(待定)里的属性，后边的会覆盖掉前面的，即最终执行vm的方法
  5、像filters/components/directives等，首先会在子组件里查找，如果没有，才会沿着原型链向上，找父组件中对应的属性（相同则覆盖，不同则保留）

### extends
  扩展组件功能。【只能扩展一个指定的组件，对象或构造函数】
``` javascript
  var mixin = {
      data:{
        myData:"我是mixin的数据",
        num:0
      },
      computed:{
        calData:function(){
            return "mixin"
        }
      },
      watch:{
        num:function(nv,ov){
          console.log("mixin的num改变了")
        }
      },
      filters:{
        'percent':function(val){
          return val+"%"
        }
      },
      methods:{
        getInfo:function(){
          console.log("我是mixin的方法")
          this.num++;
        }
      },
      created:function(){
        console.log("我是在mixin中创建的")
      }
    }
    var extend = {
      data:{
        myData:"我是extends的数据",
        num:0
      },
      computed:{
        calData:function(){
            return "extends"
        }
      },
      watch:{
        num:function(nv,ov){
          console.log("extends的num改变了")
        }
      },
      filters:{
        'placeholder':function(val){
          return val.length>0?"^"+val+"^":"---"
        }
      },
      methods:{
        getInfo:function(){
          console.log("我是extends的方法")
          this.num++;
        }
      },
      created:function(){
        console.log("我是在extends中创建的")
      }
    }

    var vm = new Vue({
      el: '#wrap',
      data:{
        myData: '我是实例中的数据',
        num:0
      },
      computed:{
        calData:function(){
            return "vm"
        }
      },
      watch:{
        num:function(nv,ov){
          console.log("vm的num改变了")
        }
      },
      filters:{
        'percent':function(val){
          return val+"%%"
        }
      },
      mixins:[mixin],
      extends:extend,
      methods:{
        getInfo:function(){
          console.log("我是实例的方法");
          this.num++;
        }
      },
      created:function(){
        console.log("我是在实例中创建的")
      }
    })
```
  通过运行以上代码，我们得到如下结论：
  1、代码执行顺序为：extends->mixin->vm实例
  2、extends、mixin，vm实例中的生命周期函数都会执行
  3、子组件和父组件的watch会合并到一个数组里，父组件在前，子组件在后
  4、像data，computed，methods，props(待定)里的属性，后边的会覆盖掉前面的，即最终执行vm的方法
  5、像filters/components/directives等，首先会在子组件里查找，如果没有，才会沿着原型链向上，找父组件中对应的属性（相同则覆盖，不同则保留）

### components
  在组件中，我们可以通过components属性来注册局部组件或者子组件
``` javascript
  var obj = {
      template: '<div :title="title">我是子组件……</div>',
      props:['title'],
      created:function(){
        console.log("子组件已经创建")
      }
    }
    var Profile = Vue.extend(obj)
    var vm = new Vue({
      el: '#wrap',
      components:{
        'my-component-one':Profile,
        'my-component-two':obj
      },
      created:function(){
        console.log("实例已经创建")
      },
      mounted:function(){
        console.log("实例已经完成挂载")
      }
    })
```
  通过运行以上代码，我们得到如下结论：
  1、首先完成了父组件数据模型的创建
  2、依次完成子组件数据模型的创建（本实例中执行了两次子组件的挂载，故输出了2次`子组件已经创建`）
  3、父组件完成dom元素挂载

### install
  
``` javascript
  
```
  


