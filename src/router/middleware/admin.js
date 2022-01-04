import axios from "axios";

export default function admin ({ next, store }){
    if(!store.getters.user.isAdmin) {
        return next({
            name: 'user-inventory'
        })
    }else {
        axios.post('https://inventor-system.herokuapp.com/api/auth/refresh',
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