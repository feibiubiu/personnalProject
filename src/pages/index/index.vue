<template>
  <div 
    
    class="home-page">
      <div 
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
                  class="content-image"
                  v-if="item.type == 'image' || item.type == 'gif' || item.type == 'video'">
                    {{item.text}}
                </p>
                <p
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
          
          
      </div>
     
  </div>
</template>
<script>
 
import diaLog from './components/dialog'
export default {
  data(){
    return {
      dataList:[],
      showDialog:false,
      nowIndex:''
    }
  },
  components:{
    diaLog
  },
  created(){
    this.getData();
  },
  methods:{
    getData(){
      let _this = this;
      wx.request({
        url: 'https://www.apiopen.top/satinGodApi', 
        data: {
          type:1,
          page:1
        },
        success(res){
          console.log(res)
          _this.dataList = res.data.data.slice(0,1);
          _this.dataList.map(item =>{
            _this.$set(item,'singleShowDialog',false)
          })
          console.log("pdd",_this.dataList)

          wx.stopPullDownRefresh() // 终止下拉刷新
          wx.hideNavigationBarLoading() // 收起加载动画
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
    // 对author弹框做出相关操作，关闭弹框，并且使名字后的箭头恢复
    cutOne(){
      this.showDialog = false
      
      this.dataList.splice(this.nowIndex,1)
    }
  },
  

  // 下拉刷新
  onPullDownRefresh () {
    console.log('下拉')
    this.getData()
  },
}
</script>
<style lang='scss'>
  
  @import './index.scss'
</style>