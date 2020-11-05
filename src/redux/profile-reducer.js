import { stopSubmit } from "redux-form";
import { profileAPI, usersAPI } from "../api/api";

const ADD_POST ='ADD-POST';                             
const SET_USER_PROFILE = 'SET-USER-PROFILE';
const SET_STATUS = 'SET-STATUS';
const DELETE_POST = 'DELETE-POST'
const SAVE_PHOTO_SUCCESS = 'SAVE-PHOTO-SUCCESS'

let initialState = {                     
    posts: [
        { id: 1, message: 'Hello', likesCount: '12' },
        { id: 2, message: 'Hi', likesCount: '32' },
        { id: 3, message: 'How are you?', likesCount: '23' }
    ],
    newPostText: "",
    profile: null,
    status: ""
}


const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST:{
            let newPost = {
                id: 7,
                message: action.newPostText,
                likesCount: 0
            };
            let stateCopy = {
                ...state,
                posts:[...state.posts, newPost],
                newPostText: ''
            }              
            return stateCopy;
        }
        case SET_USER_PROFILE :{
            return{
                ...state,
                profile: action.profile
            }
        }
        case SET_STATUS :{
            return{
                ...state,
                status: action.status
            }
        }
        case DELETE_POST :{
            return{
                ...state,
                posts: state.posts.filter(p => p.id != action.postId)
            }
        }
        case SAVE_PHOTO_SUCCESS :{
            return{
                ...state,
                profile: {...state.profile, photos: action.photos}
            }
        }
        default:
            return state;

    }
}
export const addPostActionCreator = (newPostText) => {
    return { type: ADD_POST, newPostText }
};
export const setUserProfile = (profile) => {
    return { type: SET_USER_PROFILE, profile }
};
export const setStatus = (status) => {
    return { type: SET_STATUS, status }
};
export const deletePost = (postId) => {
    return { type: DELETE_POST, postId }
};
export const savePhotoSuccess = (photos) => {
    return { type: SAVE_PHOTO_SUCCESS, photos }
};


export const getUserProfile = (userId) => async (dispatch) => {             
    let response = await usersAPI.getProfile(userId)            
    
    dispatch (setUserProfile(response.data)) 
};
export const getStatus = (userId) => async (dispatch) => {         
    let response = await profileAPI.getStatus(userId)   
             
    dispatch (setStatus(response.data))
};
export const updateStatus = (status) => (dispatch) => {
    profileAPI.updateStatus(status).then(response => {
        if (response.data.resultCode === 0) {
            dispatch(setStatus(status))
        }
    })
};
export const savePhoto = (file) => (dispatch) => {
    profileAPI.savePhoto(file).then(response => {
        if (response.data.resultCode === 0) {
            dispatch(savePhotoSuccess(response.data.data.photos))
        }
    })
};
export const saveProfile = (profile) => async (dispatch, getState) => {
    const userId = getState().auth.userId
    const response = await profileAPI.saveProfile(profile)
    if (response.data.resultCode === 0) {
        dispatch(getUserProfile(userId))
    } else {
        dispatch(stopSubmit('editProfile', {_error:response.data.messages[0]}))
        return Promise.reject(response.data.messages[0])
    }
};

export default profileReducer;