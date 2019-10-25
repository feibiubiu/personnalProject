<template>
  <div class="home-page">
    <!-- 导航栏头部 -->
      <div class="page-tabbar">
        <scroll-view class="scroll-view" :scroll-x="true" :enable-flex="true">
          <span
            :class="{'active':index==idx}"
            @click="changeIndex(idx)"
            class="scroll-view-item" 
            v-for="(item,idx) in contentTypeList"
            :key="idx">
              {{item}}
          </span>
        </scroll-view>
        <div class="search-box">
          <i class="iconfont icon-ai219"></i>
        </div>
      </div>

      <my-recommend v-if ='index == 0' :dataList="recommendList">
      </my-recommend>
      <my-text v-if = 'index == 1'>
      </my-text>
      <my-video v-if = 'index == 2'>
      </my-video>
      <my-photo v-if = 'index == 3' :dataList="imgList">
      </my-photo>

  </div>
 
 
</template>
<script>
import myRecommend from './components/recommend/recommend'
import myText from './components/text/text'
import myVideo from './components/video/video'
import myPhoto from './components/photo/photo'
import diaLog from './components/dialog'
export default {
  data(){
    return {
      name:'home',// 首页
      index:3,
      contentType:1,
      dataList:[],
      showDialog:false,
      nowIndex:'',
      contentTypeList:['推荐（神评）','文字','视频','图片','关注','游戏','放映厅'] , // 内容的类型  1 全部 2文字 3图片 4视频
      isConnected:null,  // 网络是否联网
      networkType:null,
      ////////
      imgList:[],
      recommendList:[]
    }
  },
  components:{
    diaLog,
    myRecommend,
    myText,
    myVideo,
    myPhoto
  },
  created(){
  
    let _this = this;
    this.changeIndex();
    // 刚进入页面的时候，获取网络状态
    wx.getNetworkType({
      success (res) {
        if(res.networkType=='none'){
          wx.showToast({
            title: '当前无网络连接',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    // 长期监听网络状态的改变
    wx.onNetworkStatusChange(function (res){
      console.log('res',res)
       _this.isConnected = res.isConnected;
       _this.networkType = res.networkType;
    })
  },
  methods:{
    // 改变index值，切换查看段子类型
    changeIndex(index){
      console.log("index",index)
      this.index = index || 3
      index == 0?this.index = 0: 0

        let _this = this;
        if(this.index == 3 && this.imgList.length == 0){
          
          this.imgRequest();
          console.log("执行index 3")
        }else if(this.index == 0 && this.recommendList.length == 0){
          
          this.recommendRequest();
          console.log("执行index 0")
        }
        
        /////////////
    },
    // 请求图片类型段子函数
    imgRequest(){
      let _this = this;
      wx.request({
        url: 'https://api.apiopen.top/getJoke', 
        data: {
          type:'image',
          page:1,
          count:5
        },
        success(res){
          _this.imgList = res.data.result;
          _this.imgList.map(item =>{
            _this.$set(item,'singleShowDialog',false)
          })
        }
      })
    },
    // 请求推荐（神评）类型段子函数
    recommendRequest(){
      let _this = this;
      wx.request({
        url: 'https://www.apiopen.top/satinGodApi', 
        data: {
          type:1,
          page:1
        },
        success(res){
          if(res && res.data.code == 200){
            _this.recommendList = []; //下拉请求数据成功，清空旧数据
            _this.recommendList =  res.data.data.slice(0,10);
            _this.recommendList.map(item =>{
              _this.$set(item,'singleShowDialog',false)
            })
          }else{
            wx.showToast({
              title: '数据请求有误，请刷新',
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
    },

    // 以下为保存
    gotoComment(soureid){
      console.log("ssss",soureid)
      wx.navigateTo({
        url: `../topcomment/main?soureid=${soureid}`,
        
        // events: {
        //   // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        //   acceptDataFromOpenedPage: function(data) {
        //     console.log(data)
        //   },
        //   someEvent: function(data) {
        //     console.log(data)
        //   }
        //   ...
        // },
        success: function(res) {
          console.log("成功了",res)
          // 通过eventChannel向被打开页面传送数据
          //res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test',soureid })
        }
      })
    },
    // 使对author评价弹框出现
    showUserDetails(index){
      this.showDialog = true
      this.$set(this.dataList[index],'singleShowDialog',true)
      this.nowIndex = index
      console.log("点击了")
        // 告知弹框
      // wx.showModal({
      //   title: '提示',
      //   content: '这是一个模态弹窗',
      //   success (res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })

      // 操作弹框 底部弹出
      // wx.showActionSheet({
      //   itemList: ['A', 'B', 'C'],
      //   success (res) {
      //     console.log(res.tapIndex)
      //   },
      //   fail (res) {
      //     console.log(res.errMsg)
      //   }
      // })
    },
    // 不对author弹框做操作，直接关闭
    onCLose(){
      this.showDialog = false
      this.$set(this.dataList[this.nowIndex],'singleShowDialog',false)
    },
    // 自定义函数
    // 对author弹框做出相关操作，关闭弹框，并且使名字后的箭头恢复,并删除当前条数据
    cutOne(){
      this.showDialog = false
      this.dataList.splice(this.nowIndex,1)
    },
  },
  watch:{
    isConnected:function(newt,old){
      
      if(newt == false){
        wx.showToast({
          title: '网络连接中断',
          icon: 'none',
          duration: 2000
        })
      }
    },
    networkType:function(newt,old){
      if(newt != 'wifi'){
        wx.showToast({
          title: "当前网络为非WiFi，请注意流量的使用",
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
  

  
}
</script>
<style lang='scss'>
  @import './index.scss'
</style>