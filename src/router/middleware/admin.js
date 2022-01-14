import axios from "axios";
import {EventBus} from "@/main";

export default function admin ({ next, store }){
    // if not allowed
    if(!store.getters.user.isAdmin) {
        return next({
            name: 'user-inventory'
        })
    }else {
        // if allowed get token before entering
        axios.post(store.getters.API_baseURL +'/auth/refresh',
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }})
            .then(response => {
                localStorage.setItem("access_token", response.data.access_token);
                return next();

            }).catch(error => {
                if(error.response.status === 401){
                    EventBus.$emit('displayMessage', "Sesijos Laikas baigėsi!")
                } else {
                    EventBus.$emit('displayMessage', "Įvyko klaida.")
                }
                localStorage.clear();
                store.commit("setUser", {});
                store.commit("setAllUsers", {});
                store.commit("setNotifications", {});
                return next({
                    name: 'login'
                })
        })
    }
}