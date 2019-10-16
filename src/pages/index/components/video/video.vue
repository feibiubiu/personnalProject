<template>
  <div class="mod-video">
    <div 
      v-for="(item,index) in dataList"
      :key="index">
      <user-header :item="item">
      </user-header>
      <div class="list-body">
        <p>{{item.text}}</p>
        <video 
          v-if="item.type == 'video'"
          :src="item.video" 
          object-fit="contain"
          show-mute-btn="true"
          controls="controls">
        </video>
      </div>
    </div>
  </div>
</template>
<script>
import userHeader from '@/pages/components/userHeader/index.vue'
export default {
  data(){
    return {
      name:'video',
      dataList:[]  //视频段子 页面
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
          type:5,
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
  @import './video.scss'
</style>