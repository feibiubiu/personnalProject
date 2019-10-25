<template>
  <div class="my-popup" v-if="show" @click="closePopup" @touchmove.prevent.stop="xx">
    <div class="in-center-div">
      <slot>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      name:"popup"
    }
  },
  props:{
    show:{
      type:Boolean,
      default:false
    }
  },
  
  methods:{
    closePopup(){
      console.log("dia")
      this.$emit("closePopup")
    },
    xx(){
      return
    }
  }

}
</script>
<style lang="scss" scope>
  //左右居中
  .tocenter{
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
  }
  .my-popup{
    position: fixed;
    @extend .tocenter;
    width:100%;
    height: 100%;
    background:rgba(0,0,0,0.3);
    z-index:101;
    .in-center-div{
      width:100%;
      position:absolute;
      @extend .tocenter;
    }
  }
  
</style>