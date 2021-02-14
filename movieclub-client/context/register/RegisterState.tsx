import react, {useReducer} from "react";
import { RegisterContext } from "./RegisterContext";
import { RegisterReducer } from "./RegisterReducer";
import { SET_ERROR, SET_LOADING } from "../../actionTypes"
import axios from "axios";


interface RegisterStateProps {
    children: any
}

interface RegisterForm {
    username: string,
    email: string,
    password: string,
    password2: string
}


const RegisterState: React.FC<RegisterStateProps> = ({children}: {children: any}) => {

    const initialState = {
        loading: false,
        errors: {},
    }

    const [state, dispatch] = useReducer(RegisterReducer, initialState)

    const createUser = async () => {
        //validate here?
    }

    const setLoading = () => {
        dispatch({type: SET_LOADING});
    }

    const setErrors = (errors: object) => {
        dispatch({type: SET_ERROR, payload: errors})
    }

    return(
        <RegisterContext.Provider
            value={{
                loading: state.loading,
                createUser,
                setErrors
            }}
        >
            {children}
        </RegisterContext.Provider>
    )
}