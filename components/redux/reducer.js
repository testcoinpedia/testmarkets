import { reduxData } from '../constants'

var initialState = {
    userData:[],
    companyData:"",
    profieData:"",
    active_currency:{},
    eventCount:[]
}

export default function reducer(state=initialState, action) 
{   
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
        case reduxData.converter:
            return {
                ...state,
                active_currency: action.data
            }
            break;
         default:
         return state   
    }
}
