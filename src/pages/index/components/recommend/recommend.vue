<template>
  <div class="mod-recommend">
    <div 
      v-for="(item,index) in dataList" 
      :key="index">
      <!-- 用户信息卡片 -->
        <user-header :item="item">
        </user-header>
        
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
  import userHeader from '@/pages/components/userHeader/index.vue'
export default {
  data(){
    return {
      name:"recommend", 
      dataList:[] // 首页 推荐神评页面
    }
  },
  components:{
    userHeader
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
          if(res && res.data.code == 200){
            _this.dataList = []; //下拉请求数据成功，清空旧数据
            _this.dataList = res.data.data.slice(0,1);
            _this.dataList.map(item =>{
              _this.$set(item,'singleShowDialog',false)
            })
            console.log("pdd",_this.dataList)
            wx.stopPullDownRefresh() // 终止下拉刷新
            wx.hideNavigationBarLoading() // 收起加载动画
          }else{
            wx.showToast({
              title: '数据请求有误，请刷新',
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
    }
  },
  onPullDownRefresh () {
    console.log('下拉')
    this.getData()
  },
 
}
</script>
<style lang="scss">
  @import './recommend.scss'
</style>