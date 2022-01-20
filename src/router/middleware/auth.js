import axios from "axios";
import store from "@/store/store";
import {EventBus} from "@/main";

export default function auth ({ next }){
    // if not allowed
    if(!localStorage.getItem("access_token")){
        return next({
            name: 'login'
        })
    } else {
        // if allowed get token before entering
        axios.post(store.getters.API_baseURL + '/auth/refresh',
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }})
            .then(response => {
                localStorage.setItem("access_token", response.data.access_token);
                return next();

            }).catch(error => {
                if(error.response.data.message === "Unauthenticated."
                || error.response.data.message === "Token has expired"
                || error.response.data.message === "The token has been blacklisted"){
                    let message = localStorage.getItem("lang") === 'en' ?
                        "Session timeout! Please login." :
                        "Sesijos laikas baigėsi!";
                    EventBus.$emit('displayMessage', message );
                } else {
                    let message = localStorage.getItem("lang") === 'en' ? "Something went wrong..." : "Įvyko klaida...";
                    EventBus.$emit('displayMessage', message);
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