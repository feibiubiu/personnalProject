<template>
  <div class="mod-photo">
    <div 
      v-for="(item,index) in dataList"
      :key="index">
        <user-header :item="item">
        </user-header>
        <p class="content-text">
          {{item.text}}
        </p>
        <image 
          :src="item.images" 
          :lazy-load="true"
          @click="previewImage(item.images)" />
    </div>
  </div>
</template>
<script>
  import userHeader from '@/pages/components/userHeader/index.vue'

  export default {
    data(){
      return {
        name:'photo',  //图片段子 页面
        dataList:[]
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
        url: 'https://api.apiopen.top/getJoke', 
        data: {
          type:'image',
          page:1,
          count:5
        },
        success(res){
          if(res && res.data.code == 200){
            _this.dataList = []; //下拉请求数据成功，清空旧数据
            _this.dataList = res.data.result;
            console.log(res.data.result)
            
            console.log("xxx",_this.dataList)
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
      },
      previewImage(imgSrc){
        console.log("imgSrc",imgSrc)
        wx.previewImage({
          current: imgSrc, // 当前显示图片的http链接
          urls: [imgSrc] // 需要预览的图片http链接列表
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
  @import './photo.scss';
</style>