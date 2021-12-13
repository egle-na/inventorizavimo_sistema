import Vue from "vue";
import VueRouter from "vue-router";
import LogIn from "@/views/LogIn";

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
        }
    ]
})

export default router;