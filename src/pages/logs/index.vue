<template>
  <div>
    <van-cell is-link @click="showPopup">展示弹出层</van-cell>
    <van-notify
      :safe-area-inset-top="true" 
      id="van-notify" />
    <van-popup
      @close="onClose"
      :show="show">
        内容12
    </van-popup>
  </div>
</template>
<script>
import Notify from '@/../static/vant/notify/notify'
export default {
  data(){
    return {
      show:false
    }
  },
  methods:{
    showPopup(){
      Notify(
        { type: 'success',
          message: '操作成功，我们会减少相关推荐' 
        }
      );
      //this.show = true;
    },
    onClose(){
      console.log("点击了")
      this.show = false;
    }
  }
  
}
</script>
<style lang="scss">
  .van-transition{
   
  }
</style>