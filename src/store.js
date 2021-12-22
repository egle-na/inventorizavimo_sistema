import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {}
    },
    mutations:{
        setUser(state, newUser) {
            // console.log(newUser);
            state.user = newUser;
            // console.log(state.user);
        }
    },
    getters: {
        user(state) {
            return state.user;
        },
        isAdmin(state) {
            // return state.user.role === 1;
            return state.user.isAdmin;
        }
    },

})