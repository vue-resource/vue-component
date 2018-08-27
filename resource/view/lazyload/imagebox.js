var ImageBox = function(){
  this.eleAll = [];//所有绑定指定的元素集合
  this.item = [];
  this.itemPending = [];
  this.itemDone = [];
  this.itemFailed = [];
}
ImageBox.prototype = {
  //insert插入的时候把所有的dom加入到数组中去初始化
  add:function(ele,src){
    this._add(this.item,ele,src)
  },
  addPending:function(ele,src){
    this._add(this.itemPending,ele,src)
    this._splice(this.item,ele)
  },
  addDone:function(ele,src){
    this._add(this.itemDone,ele,src)
    this._splice(this.itemPending,ele)
  },
  addFailed(ele,src){
    this._add(this.itemFailed,ele,src)
    this._splice(this.itemPending,ele)
  },
  update:function(ele,src){
    let index = this.itemDone.findIndex(item=>{
      return item.ele === ele;
    });
    if(index !== -1){
      this.itemDone.splice(index,1);
      this.add(ele,src);
      return;
    };

    let _index = this.itemFailed.findIndex(item=>{
      return item.ele === ele;
    });
    if(_index !== -1){
      this.itemFailed.splice(_index,1);
      this.add(ele,src);
      return;
    };
  },
  _add:function(arr,ele,src){
    var idx = arr.findIndex(function(item){
      return item.ele === ele
    })
    if(idx === -1){
      arr.push({
        ele:ele,
        src:src
      })
    }
  },
  _splice:function(arr,ele){
    var index = arr.findIndex((_item)=>{
        return _item.ele === ele;
    });
    if(index!=-1){
        arr.splice(index,1);
    }
  }
}
