export default function guest({ next }){
    if(localStorage.getItem("access_token")){
        return next({
            path: '/user-inventory'
        })
    }
    return next();
}