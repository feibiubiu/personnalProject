<template>
  <div class="mod-search" :style="{'padding-top': statusBarHeight + 'px', 'background-color': navBarBackground}">
    <div class="title-search" :style="{height:titleBarHeight + 'px'}">
        <van-icon @click="toBack" name="arrow-left" 
          size="1.5em" 
          style="float:left"/>
          <input type="text" placeholder="搜索" />
        <span @click="searchSomething" style="float:left;display:block">搜索</span>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      name:'searchPage' , // 搜索页面
      statusBarHeight:wx.getSystemInfoSync()['statusBarHeight'], // 状态栏高度
      titleBarHeight :null,  // 标题栏高度
      searchContent:''  // 搜索内容
    }
  },
  // 
  beforeMount(){
    let _this = this;
    //  判断设备是ios还是Android系统来设定标题栏高度
    // wx.getSystemInfo({
    //   success (res) {  
    //     let platformReg = /ios/i;
    //     if(platformReg.test(res.system)){
    //       _this.titleBarHeight = 44;
    //     }else{
    //       _this.titleBarHeight = 48;
    //     }
    //   }
    // })
    let systemInfo = wx.getSystemInfoSync();
        let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null; //胶囊按钮位置信息
        wx.getMenuButtonBoundingClientRect()
        _this.titleBarHeight = (function() { //导航栏高度
          let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
          return 2 * gap + rect.height;
        })();
        
  },
  methods:{
    // 返回上一级页面
    toBack(){
      wx.navigateBack({
        delta: 1
      })
    },
    // 点击搜索，搜索内容，
    searchSomething(){
      console.log("搜索")
      this.searchContent = '';
    }
  }
}
</script>
<style lang="scss">
  @import './index.scss'
</style>