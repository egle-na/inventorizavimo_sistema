import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {},
        allUsers: {},
        notifications: {},
    },
    mutations:{
        setUser(state, newUser) {
            state.user = newUser;
        },
        setAllUsers(state, newList) {
            console.log('got all Users')
            state.allUsers = newList;
        },
        setNotifications(state, newRequests) {
            console.log("new notifications list");
            state.notifications = newRequests;
        }
    },
    getters: {
        user(state) {
            return state.user;
        },
        // isAdmin(state) {
        //     // return state.user.role === 1;
        //     return state.user.isAdmin;
        // },
        allUsers(state) {
            return state.allUsers;
        },
        notifications(state) {
            return state.notifications;
        }
    },

})