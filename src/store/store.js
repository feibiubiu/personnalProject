// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const photo = {
  state:{  
    page:1,  //photo 页面的距离
    scrollDistance:0,   //photo页面的滚动距离
  },
  mutations :{
    changePage(state,payload){
      state.page = payload.page
      
    },
    changeScrollDistance(state,payload){
      state.scrollDistance = payload.scrollDistance;
      console.log("执行了",state.scrollDistance)
     
    }

  }
  
}

const store = new Vuex.Store({
  modules: {
    photo
  }
})

export default store