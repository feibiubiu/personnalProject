<template>
  <div class="mod-video">
    <div 
      v-for="(item,index) in dataList"
      :key="index">
      <user-header :item="item" @showPupop="showPupop(index,item.name)">
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
export default {
  data(){
    return {
      name:'video',
      page:2,
      run:true, // 函数节流开关
      isShowPopup:false,
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
    this.timer = 1;
    console.log('video',this.$store.state.video.scrollDistance)
    // 滚动条跳转回离开时的大致位置
    wx.pageScrollTo({
      scrollTop: this.$store.state.video.scrollDistance,
      duration: 0
    })
    this.run = false;
    setTimeout(() => {
      this.run = true;
      this.timer = null;
    }, 1000);
  },
  methods:{
    getData(){
      let _this = this;
        wx.request({
        url: 'https://api.apiopen.top/getJoke', 
        data: {
          type:'video',
          page:_this.page,
          count:10
        },
        success(res){
          if(res && res.data.code == 200){
            if(_this.page == 1){
              _this.dataList = []; //下拉请求数据成功，清空旧数据
            }
            res.data.result.map(item =>{
              _this.$set(item,'singleShowDialog',false)
              _this.dataList.push(item)
            })
          _this.page++;
            wx.stopPullDownRefresh() // 终止下拉刷新
            wx.hideNavigationBarLoading() // 收起加载动画
          }else{
            wx.showToast({
              title: '数据请求有误，请刷新',
              icon: 'success',
              duration: 2000
            })
          }
          _this.run = true;
        },
        fail(res){
          _this.run = true;
          return
        }
      })
    },
    // 点击，使弹窗弹出
    showPupop(index,name){
      this.makeToAuthorList[1] = "屏蔽作者";
      let Noauthor = this.makeToAuthorList[1] + ':' + name;
      this.$set(this.makeToAuthorList,1,Noauthor);
      this.doIndex = index;
      this.isShowPopup = true;
    },
    // 做作者做出评价
    shouUserDetail(){
      this.dataList.splice(this.doIndex,1);
    },
    // 点击蒙版关闭弹窗
    closePopup(){
      this.isShowPopup = false;
      this.$set(this.dataList[this.doIndex],'singleShowDialog',false);
    }
  },
  // 下拉刷新
  onPullDownRefresh () {
    console.log('下拉')
    this.page = 1;
    this.getData()
  },
  // 触底刷新
  onReachBottom(){
    if(this.run == false){
      return
    }
    this.run = false;
    this.getData()
  },
  // 获取滚动条的位置
  onPageScroll:function(e){ // 获取滚动条当前位置 
    if(this.timer){
      clearTimeout(this.timer) 
      if(this.timer == 1){
        return
      }
    }
    this.timer = setTimeout(() => {
      this.$store.commit({
        type:'changeVideoScrollDistance',
        scrollDistance:e.scrollTop
      });
    }, 500);   
  },
}
</script>
<style lang="scss">
  @import './video.scss'
</style>