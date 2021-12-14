import Vue from "vue";
import VueRouter from "vue-router";
import LogIn from "@/views/LogIn";
import AddUser from "@/views/AddUser";
import AddItem from "@/views/AddItem";
import UserItems from "@/views/UserItems";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: '/log-in'
        },
        {
            path: '/log-in',
            name: 'login',
            component: LogIn,
        },
        {
            path: '/user-inventory',
            name: 'user-inventory',
            component: UserItems,
        },
        {
            path: '/add-user',
            name: 'add-user',
            component: AddUser,
        },
        {
            path: '/add-inventory',
            name: 'add-inventory',
            component: AddItem,
        },
    ]
})

export default router;