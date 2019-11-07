<template>
  <div class="mod-text"  >
    <div 
      v-for="(item,index) in dataList"
      :key="index">
        <user-header :item="item"  @showPupop="showPupop(index,item.name)">
        </user-header>
        <p
          class="content-text"
          v-if="item.type == 'text'">
            {{item.text}}
        </p>
    </div>
    <my-popup :show="isShowPopup" @closePopup="closePopup" v-if="isShowPopup">
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
  import QQMapWX from '@/map/qqmap-wx-jssdk.js'


 



  export default {
    data(){
      return {
        name:'text',  //文字笑话 页面
        page:2,
        run:true, // 函数节流开关
        isShowPopup:false,
        makeToAuthorList:["不感兴趣","屏蔽作者","内容重复","内容引起不适"],
        doIndex:'',
        timer:null, // 函数防抖定时器
        
      }
    },
    props:{
      dataList:{
        type:Array,
        required:true
      },
      index1:{
        type:String || Number,
        required:true
      }
    },
    components:{
      userHeader,
      myPopup
    },
    created(){
      this.timer = 1;
      console.log('text',this.$store.state.text.scrollDistance)
      // 滚动条跳转回离开时的大致位置
      wx.pageScrollTo({
        scrollTop: this.$store.state.text.scrollDistance,
        duration: 0
      })
      this.run = false;
      setTimeout(() => {
        this.run = true;
        this.timer = null;
      }, 1000);
    },
    mounted(){
      
      // 实例化API核心类
      var qqmapsdk = new QQMapWX({
          key: '6SNBZ-YSW6U-QS7VF-2Y72Y-HZJR6-A7BCO'
      });
      let _this = this;
      wx.getSetting({
      success: (res) => {
        console.log("授权函数",res)
        console.log('初始',res.authSetting['scope.userLocation'])
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] == false) {
           
          wx.showModal({
            title: '请求授权当前位置',
            content: '李大人获取您的地理位置，请确认授权',
            success: function (res) {
              console.log("res",res)
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                // 打开设置界面进行设置
                wx.openSetting({
                  success: function (dataAu) {
                    console.log('dataAu',dataAu)
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      wx.getLocation({
                        type: 'gcj02',
                        success (res) {
                          console.log("结果授权成功",res)
                          // const latitude = res.latitude
                          // const longitude = res.longitude
                          // const speed = res.speed
                          // const accuracy = res.accuracy
                        },
                        fail(){
                          console.log("失败原因",res)
                        }
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          
          wx.getLocation({
            type: 'gcj02',
            success (res) {
              console.log("结果",res)
              
            },
            fail(){
              console.log("失败原因",res)
            }
          })

        }
        else if(res.authSetting['scope.userLocation'] == true) {
           console.log("等于true")
           wx.getLocation({
            type: 'gcj02',
            success (res) {
              console.log("结果",res)
              qqmapsdk.reverseGeocoder({
                location: {
                  latitude: res.latitude,
                  longitude: res.longitude
                },
                success: function (res) {
                  //获取当前地址成功
                  console.log('成功res',res);

                },
                fail: function (res) {
                  console.log('失败res',res);
                  console.log('获取当前地址失败');
                }
              });

            },
            fail(){
              console.log("失败原因",res)
            }
          })
          //调用wx.getLocation的API
        }
      }
      })
    },
    methods:{
      
      // 获取数据列表
      getData(){
        let _this = this;
        wx.request({
          url: 'https://api.apiopen.top/getJoke', 
          data: {
            type:'text',
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
      //
    },
    // 下拉刷新
    onPullDownRefresh () {
      console.log('下拉')
      this.page = 1;
      if(this.run == false){
        console.log("跳过")
        return
      }
      this.run = false;
      this.getData()
    },
    // 触底刷新
    onReachBottom(){
      console.log("处处第")
      if(this.run == false){
        console.log("跳过")
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
          type:'changeTextScrollDistance',
          scrollDistance:e.scrollTop
        });
      }, 500);
     
    },
    // 申请获取允许小程序使用地理位置权限
    getPosition(){

    }
  }
</script>
<style lang="scss" scope>
  @import './text.scss';
</style>