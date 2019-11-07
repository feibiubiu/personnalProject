<template>
  <div class="mod-photo">
    <user-header-d :item="dataObject">
    </user-header-d>
    <p class="content-text">
      {{dataObject.text}}
    </p>
    
    <image 
      :src="dataObject.images" 
      mode="widthFix" />

    <div class="all-comment" v-if="dataObject.top_comments_uid">
      <comment-user-header :item="dataObject">

      </comment-user-header>
    </div>
    
  </div>
</template>
<script>
import userHeaderD from '@/pages/components/userHeaderD/index'
import commentUserHeader from '@/pages/components/commentUserHeader/index'
  export default{
    data(){
      return {
        name:'duanziDetail',  // 图片段子详情页面内容
        sid:'',
        dataObject:{} //装载数据的对象
      }
    },
    components:{
      userHeaderD,
      commentUserHeader
    },
    methods:{
      getData(){
        let _this = this;
        wx.request({
          url: 'https://api.apiopen.top/getSingleJoke', 
          data: {
            sid: this.sid,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success (res) {
            console.log(res.data)
            _this.dataObject = res.data.result;
          }
        })
      }
    },
    onLoad:function(option){
      this.dataObject = {}; // 刚进来的时候，清空数据
      console.log('option.query2',this.$root.$mp.query)
      this.sid = this.$root.$mp.query.sid;
      this.getData()
    } 
  }
</script>
<style lang="scss">
  @import './index.scss'
</style>