<template>
  <div class="mod-photo">
    <div 
      v-for="(item,index) in dataList"
      :key="index">
        <user-header :item="item" @showPupop="showPupop(index,item.name)">
        </user-header>
        <p 
          @click="goDetails(item.sid)"
          class="content-text">
          {{item.text}}
        </p>
        <image 
          :src="item.images" 
          :lazy-load="true"
          mode="aspectFill"
          @click="previewImage(item.images)" />
    </div>
    <div class="loading" v-if="tips != ''">
      <van-loading color="#ccc" type="spinner" size="36rpx" />
      加载中
    </div>
    <my-popup :show="isShowPopup" @closePopup="closePopup">
      <ul class="ul-li">
        <li v-for="(item,index) in makeToAuthorList" :key="index" @click="shouUserDetail(index)">
          {{item}}
        </li>
      </ul>
    </my-popup>
  </div>
</template>
<script>
  import userHeader from '@/pages/components/userHeader/index.vue'
  import myPopup from '@/pages/components/popup/index.vue'
  import store from '@/store/store.js'
  export default {
    data(){
      return {
        name:'photo',  //图片段子 页面
        page:2,
        run:true,  // 函数节流开关
        tips:"加载中",
        isShowPopup:false,  // 弹窗的开关
        makeToAuthorList:["不感兴趣","屏蔽作者","内容重复","内容引起不适"],
        doIndex:'',
        timer:null, // 函数防抖定时器
      }
    },
    
    
    components:{
      userHeader,
      myPopup
    },
    props:{
      dataList:{
        type:Array,
        required:true
      }
    },
    created(){
      //未清楚
      console.log(this.$store.state.photo.scrollDistance)
      // wx.pageScrollTo({
      //   scrollTop: this.$store.state.photo.scrollDistance,
      //   duration: 0
      // })


      // 将page页数存到vuex，每次进入页面，都是从vuex拿page
      // 这样就不会请求到相同page的数据，就不会出现相同的数据
      this.page = this.$store.state.photo.page;

      ///////////////////
      this.run = false;
      // 防止bug： 当页面滚动条超过一定的长度后，切换页面，再切换回来，就会发生请求数据
      // 防止这个出现
      setTimeout(() => {
        this.run = true;
      }, 1000);
      //////////////////
    },
    mounted(){
      this.page = this.$store.state.photo.page;
    },
    methods:{
      getData(){
        console.log("image请求")
        let _this = this;
        wx.request({
        url: 'https://api.apiopen.top/getJoke', 
        data: {
          type:'image',
          page:this.page,
          count:5
        },
        success(res){
          _this.run = true;
          if(res && res.data.code == 200){
             //下拉请求数据成功，清空旧数据
            if(_this.page == 1){
              _this.dataList = []; // 首次进来，为了保险清空数据
              _this.dataList = res.data.result;
              _this.dataList.map(item =>{
                _this.$set(item,'singleShowDialog',false)
              })
            }else{
              res.data.result.forEach(item=>{
                _this.$set(item,'singleShowDialog',false)
                _this.dataList.push(item)
              })
              console.log('xxxs',_this.dataList)
            }
            
            wx.stopPullDownRefresh() // 终止下拉刷新
            wx.hideNavigationBarLoading() // 收起加载动画
          }else{
            wx.showToast({
              title: '数据请求有误，请刷新',
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail(){
          _this.run = true;
        }
      })
      },
      // 预览图片 微信小程序Api
      previewImage(imgSrc){
        console.log("imgSrc",imgSrc)
        wx.previewImage({
          current: imgSrc, // 当前显示图片的http链接
          urls: [imgSrc] // 需要预览的图片http链接列表
        })
      },
      // 根据段子id跳转到详情页
      goDetails(sid){
        console.log('xxx',sid)
        wx.navigateTo({
          url: `../../../../duanziDetail/main?sid=${sid}`,
        })
      },
      // 对点击段子进行操作
      shouUserDetail(index){
        console.log("对段子操作",index,this.doIndex)
        this.dataList.splice(this.doIndex,1);
        console.log('this.dataList',this.dataList)
      },
      // 展开author操作弹窗
      showPupop(index,name){
        this.makeToAuthorList[1] = "屏蔽作者";
        let Noauthor = this.makeToAuthorList[1] + ':' + name;
        this.$set(this.makeToAuthorList,1,Noauthor);
        this.doIndex = index;
        this.isShowPopup = true;
      },
      //无操作点击蒙版关闭弹窗
      closePopup(){
        this.isShowPopup = false;
        this.$set(this.dataList[this.doIndex],'singleShowDialog',false)
      }

    },
    watch:{
      page:function(newt,old){
        this.$store.commit({
          type:'changePage',
          page:newt
        });
      }
    },
    // 下拉刷新
    onPullDownRefresh () {
      this.page = 1;
      this.$store.commit({
        type:'changePage',
        page:this.page
      });
      console.log("下拉刷新")
      this.getData()
    },
    // 触底刷新 （滚动条拉到底部后请求更多数据）
    async onReachBottom(){
      
      this.tips = '加载中'
      if(this.run == false){
        return
      }
      this.run = false;
      this.page += 1;
      console.log("触底刷新")
      await this.getData();
      this.tips = '';
    },
    // 获取滚动条的位置
    onPageScroll:function(e){ // 获取滚动条当前位置
      
      if(this.timer){
        clearTimeout(this.timer) 
      }
      this.timer = setTimeout(() => {
        this.$store.commit({
          type:'changeScrollDistance',
          scrollDistance:e.scrollTop
        });
      }, 200);
     
    },
    
  }
</script>
<style lang="scss">
  @import './photo.scss';
</style>