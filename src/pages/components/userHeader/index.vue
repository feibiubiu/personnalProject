<template>
  <div class="list-header">
    <img :src="item.header" alt="">
    <span>{{item.username}}</span>
    <span>{{item.name}}</span>
    <div class="iconfont-box">
      <!-- @click="showUserDetails(index)" -->
      <!-- 缺一个展示用户对作者发布内容的处理 -->
      <i 
        v-if="item.singleShowDialog == false"
        class="iconfont .icon-jiantou">
      </i>
      <i 
        v-if="item.singleShowDialog == true"
        class="iconfont .icon-jiantou_up">
      </i>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      singleShowDialog:false
    }
  },
  props:{
    item:{
      type:Object,
       required: true
    }
  },
  
}
</script>
<style lang="scss" scope>
  .list-header{
    margin-top:50rpx;
    height: 80rpx;
    position: relative;
    img{
      margin-left:30rpx;
      width:80rpx;
      height: 80rpx;
      float:left;
      border-radius: 50%;
    }
    span{
      display: block;
      margin-left:30rpx;
      float:left;
      line-height: 80rpx;
    }
    div{
      float:right;
      margin-right:30rpx;
      position: absolute;
      top:52%;
      right:0;
      transform: translate(0,-50%)
    }
  }
</style>
