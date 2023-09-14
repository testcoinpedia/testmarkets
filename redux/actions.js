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


const companySaveData=(data)=> {
    // console.log(data);
     return {
         type:reduxData.companySave,
         data:data
     }
 }
 
 const companyRemoveData=(data)=> {
     return {
         type:reduxData.companyRemove,
         data:data
     }
 }

 
const profileSaveData=(data)=> {
    // console.log(data);
     return {
         type:reduxData.profileSave,
         data:data
     }
 }
 
const profileRemoveData=(data)=> {
     return {
         type:reduxData.profileRemove,
         data:data
     }
} 

const eventsCountData=(data)=> {
    return {
        type:reduxData.eventsCount,
        data:data
    }
} 



export {loginAccount, logoutAccount, companySaveData, companyRemoveData, profileSaveData, profileRemoveData, eventsCountData}