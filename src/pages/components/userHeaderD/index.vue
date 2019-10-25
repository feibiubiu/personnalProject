<template>
  <div class="list-header">
    <img :src="item.header">
    <span class="username">{{item.username}}</span>
    <span class="username">{{item.name}}</span>
    <p>{{item.passtime}}</p>
    <span class="do-user-something">
      关注
    </span>
  </div>
</template>
<script>
export default {
  data(){
    return {
      name:''  // 段子详情页面 作者的头部
    }
  },
  props:{
    item:{
      type:Object,
      required: true
    }
  },
  mounted(){
    console.log('sss',this.item)
  }
}
</script>
<style lang="scss" scoped>
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
    span.username{
      display: block;
      margin-left:30rpx;
      float:left;
      line-height: 44rpx;
    }
    p{
      position: absolute;
      font-size: 20rpx;
      color:#ccc;
      left:140rpx;
      top:50rpx;
    }
    span.do-user-something{
      float:right;
      margin-right:30rpx;
      position: absolute;
      top:52%;
      right:0;
      font-size: 24rpx;
      transform: translate(0,-50%);
      color:white;
      font-weight: bold;
      display: block;
      padding:5rpx 8rpx;
      background: palevioletred;
    }
  }

</style>