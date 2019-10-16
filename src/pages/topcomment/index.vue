<template>
  <div>
    路由传来的参数{{soureid}}
  </div>
</template>
<script>
  export default{
    data(){
      return {
        soureid:''
      }
    },
    onLoad:function(option){
      console.log('option.query2',this.$root.$mp.query)
      this.soureid = this.$root.$mp.query.soureid
    } 
  }
</script>