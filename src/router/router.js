import Vue from "vue";
import VueRouter from "vue-router";
import LogIn from "@/views/LogIn";
import AddUser from "@/views/AddUser";
import AddItem from "@/views/AddItem";
import UserItems from "@/views/UserItems";
import AllUsers from "@/views/AllUsers";
import AllItems from "@/views/AllItems";
import NotificationHistory from "@/views/NotificationHistory";
import InventoryInfo from "@/views/InventoryInfo";

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
            path: '/all-users',
            name: 'all-users',
            component: AllUsers,
        },
        {
            path: '/add-inventory',
            name: 'add-inventory',
            component: AddItem,
        },
        {
            path: '/all-inventory',
            name: 'all-inventory',
            component: AllItems,
        },
        {
            path: '/notifications',
            name: 'notifications',
            component: NotificationHistory,
        },
        {
            path: '/inventory/:inventory_id',
            name: 'inventory-info',
            component: InventoryInfo,
        },
    ]
})

export default router;