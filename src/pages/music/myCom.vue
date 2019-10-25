<template>
  <div>
    <button @click='add'>增</button>
    <button @click="cut">删</button>
    <button @click="change">修改</button>
    <button @click="pay">重新赋值</button>
    <button @click="changeNum">修改数字</button>
  </div>
</template>
<script>
export default {
  data(){
    return {

    }
  },
  props:{
    dataList:{
      type:Object
    },
    num:{
      type:Number
    }
  },
  created(){
    console.log('this.dataList',this.dataList)
    console.log('num',this.num,typeof num)
  },
  methods:{
    // 对传进来的数组直接增加
    add(){
      this.dataList.push("增加进来的");
      console.log('add',this.dataList)
    },
    // 对传进来的数组直接删除
    cut(){
      this.dataList.pop();
      console.log('cut',this.dataList)
    },
    // 对传进来的数组直接修改
    change(){
      this.dataList[0] = "我改变了"
      console.log('change',this.dataList)
    },
    // 对传进来的数组直接重新赋值
    pay(){
      this.dataList = ['2','5'];
      console.log('pay',this.dataList)
    },
    // 对传进来的number类型直接修改
    changeNum(){
      this.num = 5;
      console.log('this',this.num)
    }
  }

}
</script>
<style lang="scss">

</style>