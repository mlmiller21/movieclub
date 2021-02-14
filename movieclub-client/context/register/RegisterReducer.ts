import { SET_LOADING, SET_ERROR, CLEAR_ERROR } from "../../actionTypes";

type RegisterState = any;
type RegisterAction = {
    type: 'SET_LOADING' | 'SET_ERROR' | 'CLEAR_ERROR',
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
        case CLEAR_ERROR:
            return{
                ...state,
                errors: {}
            }
        default:
            return state;
    }
}