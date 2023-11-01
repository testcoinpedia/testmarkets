import { reduxData } from '../constants'

const loginAccount=(data)=> {
    return {
        type:reduxData.login,
        data:data
    }
}

const logoutAccount=(data)=> {
    return {
        type:reduxData.logout,
        data:data
    }
}


const currencyConverter=(data)=> {
    return {
        type:reduxData.converter,
        data:data
    }
}





export {loginAccount, logoutAccount, currencyConverter}