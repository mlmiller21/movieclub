import react, {useReducer} from "react";
import { RegisterContext } from "./RegisterContext";
import { RegisterReducer } from "./RegisterReducer";
import { SET_ERROR, SET_LOADING } from "../../actionTypes"
import axios from "axios";
import { MOVIECLUB_API } from "../../config"


interface RegisterStateProps {
    children: any
}

interface RegisterForm {
    username: string,
    email: string,
    password: string
}


const RegisterState: react.FC<RegisterStateProps> = ({children}: {children: any}) => {
    
    const initialState = {
        loading: false,
        errors: {}
    }

    const [state, dispatch] = useReducer(RegisterReducer, initialState)

    //post user data to server
    const createUser = async (registerForm: RegisterForm) => {
        setLoading();
        try {
            const res = await axios.post(MOVIECLUB_API + '/auth/register', {
                username: registerForm.username,
                email: registerForm.email,
                password: registerForm.password
            },
            {withCredentials: true});

            let data = res.data;
            if (data.success){
                //redirect here, maybe do stuff
            }
        }
        catch(err){
            const error = err.response.data.err;
            if (error.status = 400){
                const errors = error.errors.reduce((acc, err) => {
                    //for each error message, errors have the form of {field, message}
                    acc[err.field] = err.message;
                    return acc;
                }, {})
                dispatch({type: SET_ERROR, payload: errors})
            }
        }
    }

    const setLoading = () => {
        dispatch({type: SET_LOADING});

    }

    const setErrors = (errors: object) => {
        dispatch({type: SET_ERROR, payload: errors});
    }

    return(
        <RegisterContext.Provider
            value={{
                errors: state.errors,
                loading: state.loading,
                createUser,
                setErrors
            }}
        >
            {children}
        </RegisterContext.Provider>
    )
}

export default RegisterState;