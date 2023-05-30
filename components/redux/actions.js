import { reduxData } from '../constants'

const loginAccount=(data)=> {
   //console.log(data);
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






export {loginAccount, logoutAccount, }