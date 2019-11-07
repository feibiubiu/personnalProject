<template>
  <div class="mod-map">
    <map 
      id="map" 
      :longitude="longitude"
      :latitude="latitude"
      :show-location="true"
      :scale="scaleNum"
      :show-scale="true"
      @regionchange="mapChange"
      @bigin="mapChangeBigin"
      @end="mapChangeEnd"
      :enable-satellite="satellite">
    </map>
    <cover-view class="all-btn-box">
      <!-- <cover-view @click="goSubway">
        地铁
      </cover-view> -->
      <cover-view @click="gotoPlace">
        GO
      </cover-view>
    </cover-view>
    <!-- 获取微信用户信息按钮 -->
    <cover-view class="show-details" v-if="false">
      <button 
        open-type="getUserInfo" 
        @getuserinfo="bindGetUserInfo" 
        @click="getUserInfo1">
          获取权限
      </button>
      <button @click="gotoPlace">
        猫猫
      </button>
    </cover-view>
    <!-- 复位按钮 -->
    <cover-image
      @click="resetPosition"
      class="position-image"
      src="/static/images/icon_dqwz.png">
    </cover-image>
    <!-- 放大 放小地图按钮 -->
    <cover-image
      @click="biggerMap"
      class="bigger-map"
      src="/static/images/icon_fd.png">
    </cover-image>
    <cover-image
      @click="smallMap"
      class="small-map"
      src="/static/images/icon_sx.png">
    </cover-image>
    <!-- 中间地图标志 -->
    <cover-image
      class="center-image" 
      src="/static/images/position2.png">
    </cover-image>
    <cover-image
      class="center-image2" 
      src="/static/images/icon_qu.jpg">
    </cover-image>
    <!-- 去的位置显示框 -->
    <cover-view class="go-place-name-box">
      <cover-view class="go-place-name">
        {{goplace}}
      </cover-view>
      <cover-view
        @click="gotoPlace" 
        class="go-place-name-btn">
        搜索
      </cover-view>
    </cover-view>
  </div>
</template>
<script>
import QQMapWX from '@/map/qqmap-wx-jssdk.js'
import { resolve } from 'q';

export default {
  
  data(){
    let plugin = requirePlugin('routePlan');
    return {
      longitude:116.324520,  // 应该要给一个初始值，不然地图会空白一片
      latitude:23.099994,
      satellite:false, //开启卫星实地图开关
      mapCtx:null,
      scaleNum:14, // 放大等级
      timer:null, // 放大缩小地图函数节流开关
      key:'6SNBZ-YSW6U-QS7VF-2Y72Y-HZJR6-A7BCO',
      referer:'修仙练武圣地',
      endPoint:JSON.stringify({  //终点
        'name': '',
        'latitude': '',
        'longitude': ''
      }),
      goplace:'',  // 将要去的地方具体名字
    }
  },
  mounted(){
    // 相当于获取地图节点
    this.mapCtx = wx.createMapContext('map');
    this.getSetting();
    this.getLocation();
  },
  
  methods:{
    getSetting(){
      wx.getSetting({
        success: function(res){
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function(res) {
                //打印用户信息
                //console.log(res.userInfo)
                //用户已经授权过
                console.log('用户已经授权过')
              }
            })
          }else{
            console.log('用户还未授权过')
          }
        }
      })
    },
    getUserInfo1(){
      console.log('click事件首先触发')
      // 判断小程序的API，回调，参数，组件等是否在当前版本可用。  为false 提醒用户升级微信版本
      // console.log(wx.canIUse('button.open-type.getUserInfo'))
      if(wx.canIUse('button.open-type.getUserInfo')){
        // 用户版本可用
      }else{
        console.log('请升级微信版本')
      }
    },
    bindGetUserInfo(e) {
       //console.log(e)
      if (e.mp.detail.rawData){
        //用户按了允许授权按钮
        console.log('用户按了允许授权按钮')
       // this.longitude = 
      } else {
        //用户按了拒绝按钮
        console.log('用户按了拒绝按钮')
      }
    },
    // 获取用户当前位置
     getLocation(){
      var qqmapsdk = new QQMapWX({
          key: '6SNBZ-YSW6U-QS7VF-2Y72Y-HZJR6-A7BCO'
      });
      let _this = this;
      wx.getSetting({
       success: (res) => {
        console.log("授权函数",res)
        console.log('初始',res.authSetting['scope.userLocation'])
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        //                                       == false    表示 非初始化进入该页面,且未授权
        //                                       == true    表示 地理位置授权
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
                          _this.addresscCompile(res)
                          
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
            success (res){
              _this.addresscCompile(res);
            },
            fail(){
              console.log("失败原因",res)
            }
          })
    
        }
      }
      })
    },
    // 利用经纬度逆向编译，得出地点的具体地名(异步函数),并设置为地图中心点
    addresscCompile(res){
      let _this = this;
      var qqmapsdk = new QQMapWX({
          key: '6SNBZ-YSW6U-QS7VF-2Y72Y-HZJR6-A7BCO'
      });
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            //获取当前地址成功
            
            let {lat,lng} = res.result.location;
            _this.longitude = lng;
            _this.latitude = lat;
            //   ！！！！注意注意注意 这里的this指的是地图节点（猜测），要用_this代表vue实例
            console.log(this.longitude,this.latitude,"llllsss",this,_this)
          }
      })
    },
    // 利用经纬度逆向编译，只得出地点的具体地名(异步函数)，修改endPoint（终点）注意与上面的区别 ！！！！！
    onlyAddresscCompile(res){
      let _this = this;
      var qqmapsdk = new QQMapWX({
          key: '6SNBZ-YSW6U-QS7VF-2Y72Y-HZJR6-A7BCO'
      });
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            //获取当前地址成功
            
            let {lat,lng} = res.result.ad_info.location;
            let obj = {};
            _this.$set(obj,'name',res.result.formatted_addresses.recommend);
            _this.$set(obj,'latitude',lat);
            _this.$set(obj,'longitude',lng);
            _this.endPoint = JSON.stringify(obj);
            _this.goplace = res.result.formatted_addresses.recommend;
          },
          fail(){
            _this.goplace = '未获取到地点';
            console.log("哦豁，完蛋")
          }
      })
    },
    // 复位地图回到中心点
    resetPosition(){
      this.mapCtx.moveToLocation();
    },
    // 放大地图 用函数节流
    biggerMap(){
      if(this.timer == false){
        return
      }
      this.timer = false;
      setTimeout(() => {
        this.scaleNum++;
        this.timer = true;
      }, 800);
    },
    // 缩小地图
    smallMap(){
      if(this.timer == false){
        return
      }
      this.timer = false;
      setTimeout(() => {
        this.scaleNum--;
        this.timer = true;
      }, 800);
    },
    // 三个函数，缺一不可，主要是mapChangeEnd
    mapChangeBigin(){
      console.log("移动了b")
    },
    mapChangeEnd(){
      let _this = this;
      this.mapCtx.getCenterLocation({
        success(res){
          _this.onlyAddresscCompile(res);
        },
        fail(res){
         
        }
      });
      
    },
    mapChange(){
      console.log("移动了")
    },

    // 查询非地铁接口
    gotoPlace(){
      
      wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + this.key + '&referer=' + this.referer + '&endPoint=' +this. endPoint
      });
    },
    // 查询地铁接口
    goSubway(){
      wx.navigateTo({
        url: 'plugin://subway/index?key=' + this.key + '&referer=' + this.referer
      });
    }
    
  }
}
</script>
<style lang="scss" scope>
 @import './index.scss';
</style>