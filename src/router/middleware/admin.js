export default function admin ({ next, store }){
    if(!store.getters.isAdmin) {
        return next({
            name: 'user-inventory'
        })
    }
    return next();
}