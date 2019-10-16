<template>
  <div class="home-page">
    <!-- 首页头部导航栏 -->
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
      <!-- <div 
        v-for="(item,index) in dataList" 
        :key="index">
          <div class="list-header">
            <img :src="item.header" alt="">
            <span>{{item.username}}</span>
            <div class="iconfont-box">
              <i 
                @click="showUserDetails(index)"
                v-if="item.singleShowDialog == false"
                class="iconfont .icon-jiantou">
              </i>
              <i 
                v-if="item.singleShowDialog == true"
                class="iconfont .icon-jiantou_up">
              </i>
            </div>
          </div>
          <div 
            class="list-body">
              <div 
                class="img-box">
                <p 
                  @click.stop = "gotoComment(item.soureid)"
                  class="content-image"
                  v-if="item.type == 'image' || item.type == 'gif' || item.type == 'video'">
                    {{item.text}}
                </p>
                <p
                  @click.stop = "gotoComment(item.soureid)"
                  class="content-text"
                  v-if="item.type == 'text'">
                    {{item.text}}
                </p>
                <img 
                  v-if="item.type == 'image'"
                  :src="item.image" />
                <img 
                  v-if="item.type == 'gif'"
                  :src="item.gif" />  
                <video 
                  v-if="item.type == 'video'"
                  :src="item.video" 
                  object-fit="contain"
                  show-mute-btn="true"
                  initial-time="0.1"
                  controls="controls">
                </video>
              </div>
              
          </div>
          <div 
            class="top-comment" 
            v-if="item.top_commentsName">
              <div class="top-comment-header">
                <img :src="item.top_commentsHeader">
                <span>
                  {{item.top_commentsName}}
                </span>
              </div>
              <div class="top-comment-body">
                {{item.top_commentsContent}}
              </div>
          </div>
          <div class="list-footer">
              <div>
                <i class=".icon-zan iconfont">
                </i>
                <span v-if="item.up < 10000">
                  {{item.up}}
                </span>
                <span v-if="item.up >= 10000">
                  {{item.up.slice(0,-4) + 'k' }}
                </span>
              </div>
              <div>
                <i class=".icon-cai iconfont">
                </i>
                <span>
                  {{item.down}}
                </span>
              </div>
              <div>
                <i class=".icon-pinglun iconfont">
                </i>
                <span>
                  {{item.comment}}
                </span>
              </div>
              <div>
                <i class=".icon-fenxiang iconfont">
                </i>
                <span>分享</span>
              </div>
          </div>
          <dia-log 
            @close="onCLose"
            @closeAndCut="cutOne"
            :showDialog='showDialog'>
          </dia-log>  
      </div> -->
    <!-- 神评版本 -->
    
      <my-recommend 
        :data="dataList"
        v-if='index==0'>

      </my-recommend>
      <my-text v-if = 'index == 1'>

      </my-text>
      <my-video v-if = 'index == 2'>

      </my-video>
      <my-photo v-if = 'index == 3'>

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
      contentTypeList:['推荐（神评）','文字','视频','图片','关注','游戏','放映厅']  // 内容的类型  1 全部 2文字 3图片 4视频
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
    this.changeIndex();
  },
  methods:{
    changeIndex(index){
      console.log("index",index)
      this.index = index || 3
      index == 0?this.index = 0: 0
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
    }
  },
  
  

  
}
</script>
<style lang='scss'>
  @import './index.scss'
</style>