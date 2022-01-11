import axios from "axios";
import store from "@/store/store";

export default function auth ({ next}){
    if(!localStorage.getItem("access_token")){
        return next({
            name: 'login'
        })
    } else {
        axios.post(store.getters.API_baseURL + '/auth/refresh',
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }})
            .then(response => {
                localStorage.setItem("access_token", response.data.access_token);
                return next();

            }).catch(() => {
                localStorage.clear();
                return next({
                    name: 'login'
                })
            }) // ar taip tinka?
    }
}