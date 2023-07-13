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
        
         default:
         return state   
    }
}
