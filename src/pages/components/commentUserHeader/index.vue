<template>
  <div class="list-header">
    <img :src="item.top_comments_header" alt="">
    <span class="username">
      {{item.top_comments_name}} ·
    </span>
    <div class="icon-box">
      <div class="zan">
        <span>123</span>
        <i class="iconfont icon-zan"></i>
      </div>
      <div class="cai">
        <span>222</span>
        <i class="iconfont icon-cai"></i>
      </div>
      
    </div>
    <p>
      {{item.top_comments_content}} 
    </p>
  </div>
</template>
<script>
export default {
  data(){
    return {
      name:'', // 评论里评论者的用户头部
     
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
    span.username{
      display: block;
      margin-left:30rpx;
      float:left;
      line-height: 50rpx;
    }
    .icon-box{
      width:300rpx;
      height: 40rpx;
      float:right;
      div:last-child{
        margin-left:50rpx;
      }
      div{
        float:left;
        position: relative;
        height: 100%;
        width:100rpx;
        span{
          float:left;
          font-size: 22rpx;
          position: absolute;
          top:50%;
          transform: translate(0,-50%);
        }
        i{
          margin-left:50rpx;
          float:left;
          position: absolute;
          top:50%;
          transform: translate(0,-50%);
        }
      }
    }
    p{
      position: absolute;
      left:140rpx;
      top:60rpx;
      box-sizing: border-box;
      padding-right: 30rpx;

    }
    
  }
</style>
