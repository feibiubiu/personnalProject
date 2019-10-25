<template>
  <div class="mod-recommend" id="xxx">
    <div 
      v-for="(item,index) in dataList" 
      :key="index">
      <!-- 用户信息卡片 -->
        <user-header :item="item" @showPupop="showPupop(index,item.username)">
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
        <!-- <dia-log 
          @close="onCLose"
          @closeAndCut="cutOne"
          :showDialog='showDialog'>
        </dia-log>   -->

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
      name:"recommend",
      page:2,   // 第一次数据请求函数写在index，所以这次初始化数据为2
      run:true ,  // 函数节流开关
      isShowPopup:false,
      makeToAuthorList:["不感兴趣","屏蔽作者","内容重复","内容引起不适"],
      doIndex:''
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
    this.run = false;
    // 防止bug： 当页面滚动条超过一定的长度后，切换页面，再切换回来，就会发生请求数据
    // 防止这个出现
    setTimeout(() => {
      this.run = true;
    }, 1000);
  },
  methods:{
    // 请求段子数据
    getData(){
      let _this = this;
      wx.request({
        url: 'https://www.apiopen.top/satinGodApi', 
        data: {
          type:1,
          page:_this.page
        },
        success(res){
          if(res && res.data.code == 200){
            console.log("水水水水")
            if(_this.page == 1){
              console.log("下拉刷新")
              _this.dataList = []; //下拉请求数据成功，清空旧数据
            }

           // _this.dataList =  res.data.data.slice(0,10);
            res.data.data.slice(0,10).map(item=>{
              _this.$set(item,'singleShowDialog',false)
              _this.dataList.push(item);
            })
            
            
            
            _this.page++;
            console.log("this.page",_this.page,_this.dataList)
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
        }
      })
    },
    showPupop(index,name){
      this.makeToAuthorList[1] = "屏蔽作者";
      let Noauthor = this.makeToAuthorList[1] + ':' + name;
      this.$set(this.makeToAuthorList,1,Noauthor);
      this.doIndex = index;
      this.isShowPopup = true;
    },
    //  无操作关闭弹窗  点击蒙版关闭弹窗
    closePopup(){
      
      this.$set(this.dataList[this.doIndex],'singleShowDialog',false)
      this.isShowPopup = false;
    },
    // 做作者做出评价，删除该作者
    shouUserDetail(){
      this.dataList.splice(this.doIndex,1);
    }
  },
  /// 下拉刷新
  onPullDownRefresh () {
    this.page = 1;
    
    this.getData()
  },
  // 触底刷新   
  // 这里要加一个函数节流，要不然会发生并发请求数据
  onReachBottom(){
    if(this.run == false){
      return
    }
    
    this.run = false;
    this.getData();
  }

 
}
</script>
<style lang="scss">
  @import './recommend.scss'
</style>