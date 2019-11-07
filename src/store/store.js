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
    changePhotoScrollDistance(state,payload){
      state.scrollDistance = payload.scrollDistance;
      console.log("执行了photo",state.scrollDistance)
    }
  }
}
const text = {
  state:{
    scrollDistance:0,
  },
  mutations:{
    changeTextScrollDistance(state,payload){
      state.scrollDistance = payload.scrollDistance;
      console.log("执行了text",state.scrollDistance)
    }
  }
}

const video = {
  state:{
    scrollDistance:0,
  },
  mutations:{
    changeVideoScrollDistance(state,payload){
      state.scrollDistance = payload.scrollDistance;
      console.log("执行了video",state.scrollDistance)
    }
  }
}

const recommend = {
  state:{
    scrollDistance:0,
  },
  mutations:{
    changeRecommendScrollDistance(state,payload){
      state.scrollDistance = payload.scrollDistance;
      console.log("执行了recommend",state.scrollDistance)
    }
  }
}

const store = new Vuex.Store({
  modules: {
    photo,
    text,
    video,
    recommend
  }
})

export default store