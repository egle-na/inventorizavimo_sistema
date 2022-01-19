import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {},
        allUsers: {},
        notifications: {},
        API_baseURL: "https://inventor-system.herokuapp.com/api",
    },
    mutations:{
        setUser(state, newUser) {
            state.user = newUser;
        },
        setAllUsers(state, newList) {
            state.allUsers = newList;
        },
        setNotifications(state, newRequests) {
            state.notifications = newRequests;
        }
    },
    getters: {
        user(state) {
            return state.user;
        },
        allUsers(state) {
            return state.allUsers;
        },
        notifications(state) {
            return state.notifications;
        },
        API_baseURL(state) {
            return state.API_baseURL;
        }
    },
})