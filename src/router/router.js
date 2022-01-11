import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/store";

import LogIn from "@/views/LogIn";
// import AddUser from "@/components/AddUser";
// import AddItem from "@/components/AddItem";
import UserItems from "@/views/UserItems";
import AllUsers from "@/views/AllUsers";
import AllItems from "@/views/AllItems";
import NotificationHistory from "@/views/NotificationHistory";
import InventoryInfo from "@/views/InventoryInfo";
import AllCompanies from "@/views/AllCompanies";
import RemindPassword from "@/views/RemindPassword";

import guest from "@/router/middleware/guest";
import auth from "@/router/middleware/auth";
import admin from "@/router/middleware/admin";
import CreatePassword from "@/views/CreatePassword";
import jwt_decode from "jwt-decode";
// import axios from "axios";

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
            // meta: {
            //     middleware: [
            //         guest
            //     ]
            // },
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
        // {
        //     path: '/add-user',
        //     name: 'add-user',
        //     component: AddUser,
        //     meta: {
        //         middleware: [
        //             admin
        //         ]
        //     }
        // },
        {
            path: '/all-users',
            name: 'all-users',
            component: AllUsers,
            meta: {
                middleware: [
                    admin
                ]
            }
        },
        {
            path: '/all-companies',
            name: 'all-companies',
            component: AllCompanies,
            meta: {
                middleware: [
                    admin
                ]
            }
        },
        // {
        //     path: '/add-inventory',
        //     name: 'add-inventory',
        //     component: AddItem,
        //     meta: {
        //         middleware: [
        //             auth // admin?
        //         ]
        //     }
        // },
        {
            path: '/all-inventory',
            name: 'all-inventory',
            component: AllItems,
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
            component: InventoryInfo,
            meta: {
                middleware: [
                    auth
                ]
            }
        },
    ]
})

router.beforeEach((to, from, next) => {
    if(localStorage.getItem("access_token")){
        const {email, first_name, last_name, id, role} = jwt_decode(localStorage.getItem("access_token"));
        store.commit('setUser', {id, first_name, last_name, email, isAdmin: !!role });
    }
    // refreshUsersToken();
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