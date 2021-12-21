export default function auth ({ next}){
    if(!localStorage.getItem("access_token")){
        return next({
            name: 'login'
        })
    }
    return next();
}