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
                v-if="showDialog == false"
                class="iconfont .icon-jiantou">
              </i>
              <i 
                v-if="showDialog == true"
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
          _this.dataList = res.data.data.slice(0,5)
          wx.stopPullDownRefresh() // 终止下拉刷新
          wx.hideNavigationBarLoading() // 收起加载动画
        }
      })
    },
    showUserDetails(index){
      
      this.showDialog = true
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
    onCLose(){
      this.showDialog = false
    },
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