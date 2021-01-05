import { stopSubmit } from "redux-form"
import { authAPI, securityAPI } from "../api/api"

const SET_USER_DATA ='SET-USER-DATA'                             
const GET_CAPTCHA_URL_SUCCESS ='GET-CAPTCHA-URL-SUCCESS'                             

export type InitialStateType = typeof initialState

let initialState = {  
    id: null as number | null,                   
    email: null as string | null,
    login: null as string | null,
    isAuth: false as boolean,
    captchaUrl: null as string | null
}


const authReducer = (state = initialState, action: any): InitialStateType => {
    switch (action.type) {
        case SET_USER_DATA:
            return {
                ...state,
                ...action.payload
            }
        case GET_CAPTCHA_URL_SUCCESS:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
    
}

type SetAuthUserDataActionPayloadType = {
    id: number | null 
    email: string | null 
    login: string | null  
    isAuth: boolean
}
type SetAuthUserDataActionType = {
    type: typeof SET_USER_DATA
    payload: SetAuthUserDataActionPayloadType
}
export const setAuthUserData = (id: number | null, email: string | null , login: string | null , isAuth: boolean): SetAuthUserDataActionType => {
    return { type: SET_USER_DATA, payload: { id, email, login, isAuth } }
}


type GetCaptchaUrlSuccessType = {
    type: typeof GET_CAPTCHA_URL_SUCCESS
    payload: { captchaUrl: string }
}
export const getCaptchaUrlSuccess = (captchaUrl: string):GetCaptchaUrlSuccessType => {
    return { type: GET_CAPTCHA_URL_SUCCESS, payload: {captchaUrl} }
}

export const getAuthUserData = () => async (dispatch: any) => {
    let response = await authAPI.me()                        
       
        if (response.data.resultCode === 0) {
            let {id, email, login} = response.data.data
            dispatch (setAuthUserData(id, email, login, true) )   
        }
}
export const login = (email:string, password: string, rememberMe: boolean, captcha: string) => async (dispatch: any) => {
    let response = await authAPI.login(email, password, rememberMe, captcha);
                            
        if (response.data.resultCode === 0) {
            dispatch(getAuthUserData())      
        } else {
            if(response.data.resultCode === 10) {
                dispatch(getCaptchaUrl())
            }
            let message = response.data.messages.length > 0 ? response.data.messages[0] : 'some ERROR'; 
            dispatch(stopSubmit('login', {_error: message}))    
        }
};
export const getCaptchaUrl = () => async (dispatch: any) => {
    const response = await securityAPI.getCaptchaUrl();
    const captchaUrl = response.data.url
    dispatch(getCaptchaUrlSuccess(captchaUrl))
}

export const logout = () => async(dispatch: any) => {
    const response = await authAPI.logout();                  
        if (response.data.resultCode === 0) {
            dispatch(setAuthUserData(null, null, null, false))      
        }
}
export default authReducer;