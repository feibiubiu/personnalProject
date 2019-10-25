<template>
  <div>
    <my-com :dataList="dataList" :num="num">

    </my-com>
    <p @click="sss">123</p>
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
import myCom from './myCom.vue'
export default {
  data(){
    return {
      makeToAuthorList:[1,2,3],
      num:1,
      isShowPopup:false
    }
  },
  components:{
    myCom
  },
  methods:{
    sss(){
      console.log("sss");
      this.isShowPopup = true;
    },
    closePopup(){
      console.log("hhhh")
    }
  }
}
</script>
<style lang="scss">
 
</style>