<template>
  <div>
    
    <van-popup 
      :show="showDialog"
      @close="onCLose(e)"
      overlay-style="backgroundColor:black;opacity:0.3;"
      duration="0">
        <ul>
          <li
            @click="doAuthor(item)"
            v-for="(item,index) in authorCom"
            :key="index">
            {{item}}
          </li>
        </ul>
    </van-popup>
   
  </div>
</template>
<script>

export default {
  data(){
    return {
      authorCom:['不感兴趣','屏蔽作者','内容重复','内容引起不适'] 
    }
  },
  props:['showDialog'],
  methods:{
    showPopup() {
      this.showDialog = true;
    },
    onCLose(e){
      this.$emit("close")
    },
    doAuthor(index){
      
      this.$emit("closeAndCut");
    }
  },
 
  
}
</script>
<style lang="scss" scope>
  *{
    margin:0;
    padding:0;
  }
  ._van-popup{
    .van-popup{
      width:90%;
      border-radius: 25rpx;
      ul{
        width:100%;
        box-sizing: border-box;
        li{
          text-align: center;
          height: 50rpx;
          line-height: 50rpx;
          border-bottom:1px solid #ddd
        }
      }
    }
  }
  
</style>