import { reduxData } from '../constants'

var initialState = {
    userData:[],
    companyData:"",
    profieData:"",
    eventCount:[]
}

export default function reducer(state=initialState, action) 
{   
    // console.log(action)
    switch(action.type)
    {
        case reduxData.login:
            return {
                ...state,
                userData: action.data
            }
            break;
        case reduxData.logout:
            return {
                ...state,
                userData: action.data
            }
            break;
        case reduxData.companySave:
            return {
                ...state,
                companyData: action.data
            }
            break; 
        case reduxData.companyRemove:
        return {
            ...state,
            companyData: action.data
        }
        break; 
        case reduxData.profileSave:
            return {
                ...state,
                profieData:action.data
            }
            break; 
        case reduxData.profileRemove:
        return {
            ...state,
            profieData:action.data
        }
        case reduxData.eventsCount:
        return {
            ...state,
            eventCount:action.data
        }
        break; 
         default:
         return state   
    }
}
