import { createStore } from "vuex";

// Instantiate our Vuex store
export default createStore({

  // "State" is the application data your components
  // will subscribe to
  
  state () {
    return {
      google: null,
      maps: null,
    }

  },

  getters: {

    getGoogle (state) {
      return state.google;
    },
  },

    mutations: {

    initGoogle (state, item) {
      
      state.google = item;

      //console.log(state.google);

    }
  }
});