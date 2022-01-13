import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/store";

import LogIn from "@/views/LogIn";
import UserItems from "@/views/UserGear";
import Users from "@/views/Users";
import Gear from "@/views/Gear";
import NotificationHistory from "@/views/NotificationHistory";
import GearInfo from "@/views/GearInfo";
import Companies from "@/views/Companies";
import RemindPassword from "@/views/RemindPassword";
import CreatePassword from "@/views/CreatePassword";
import ChangePassword from "@/views/ChangePassword";

import guest from "@/router/middleware/guest";
import auth from "@/router/middleware/auth";
import admin from "@/router/middleware/admin";
import jwt_decode from "jwt-decode";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: LogIn,
            meta: {
                middleware: [
                    guest
                ]
            }
        },
        {
            path: '/forgot-password',
            name: 'forgot-password',
            component: RemindPassword,
            meta: {
                middleware: [
                    guest
                ]
            },
        },
        {
            path: '/create-password',
            name: 'create-password',
            component: CreatePassword,
            meta: {
                middleware: [
                    guest
                ]
            },
        },
        {
            path: '/change-password',
            name: 'change-password',
            component: ChangePassword,
            meta: {
                middleware: [
                    auth
                ]
            },
        },
        {
            path: '/user-inventory',
            name: 'user-inventory',
            component: UserItems,
            meta: {
                middleware: [
                    auth
                ]
            },
            children: [
                {
                   path: ":user_id",
                    meta: {
                        middleware: [
                            admin
                        ]
                    },
                }
            ]
        },
        {
            path: '/all-users',
            name: 'all-users',
            component: Users,
            meta: {
                middleware: [
                    admin
                ]
            }
        },
        {
            path: '/all-companies',
            name: 'all-companies',
            component: Companies,
            meta: {
                middleware: [
                    admin
                ]
            }
        },
        {
            path: '/all-inventory',
            name: 'all-inventory',
            component: Gear,
            meta: {
                middleware: [
                    admin
                ]
            }
        },
        {
            path: '/notifications',
            name: 'notifications',
            component: NotificationHistory,
            meta: {
                middleware: [
                    auth
                ]
            }
        },
        {
            path: '/inventory/:inventory_id',
            name: 'inventory-info',
            component: GearInfo,
            meta: {
                middleware: [
                    auth
                ]
            }
        },
        {
            path: '/:catchAll(.*)*',
            name: 'not-found',
            redirect: '/login'
        }
    ]
})

router.beforeEach((to, from, next) => {
    if(localStorage.getItem("access_token")){
        const {email, first_name, last_name, id, role} = jwt_decode(localStorage.getItem("access_token"));
        store.commit('setUser', {id, first_name, last_name, email, isAdmin: !!role });
    }
    if (!to.meta.middleware) {
        return next();
    }
    const middleware = to.meta.middleware;

    const context = {
        to,
        from,
        next,
        store
    }

    return middleware[0]({
        ...context
    })

})

export default router;