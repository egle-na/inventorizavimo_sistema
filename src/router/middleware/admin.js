export default function admin ({ next, store }){
    if(!store.getters.user.isAdmin) {
        return next({
            name: 'user-inventory'
        })
    }
    return next();
}