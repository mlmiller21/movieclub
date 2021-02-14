import { SET_LOADING, SET_ERROR } from "../../actionTypes";

type RegisterState = any;
type RegisterAction = {
    type: 'SET_LOADING' | 'SET_ERROR' | 'test'
    payload?: any
    
}

export const RegisterReducer = function(state: RegisterState, action: RegisterAction): any{
    switch(action.type){
        //if loading, set loading to true
        case SET_LOADING:
            return{
                ...state,
                loading: true,
                errors: {}
            }
        //if error, set error passed in through payload
        case SET_ERROR:
            return{
                ...state,
                loading: false,
                errors: action.payload
            }
        default:
            return state;
    }
}