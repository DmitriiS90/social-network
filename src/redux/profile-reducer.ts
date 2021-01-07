import { AppStateType } from './redux-store';
import { PostsType, ProfileType, PhotosType } from './../types/types';
import { stopSubmit } from "redux-form";
import { profileAPI, usersAPI } from "../api/api";
import { ThunkAction } from 'redux-thunk';

const ADD_POST ='ADD-POST';                             
const SET_USER_PROFILE = 'SET-USER-PROFILE';
const SET_STATUS = 'SET-STATUS';
const DELETE_POST = 'DELETE-POST'
const SAVE_PHOTO_SUCCESS = 'SAVE-PHOTO-SUCCESS'


let initialState = {                     
    posts: [
        { id: 1, message: 'Hello', likesCount: 12 },
        { id: 2, message: 'Hi', likesCount: 32 },
        { id: 3, message: 'How are you?', likesCount: 23 }
    ] as Array<PostsType>,
    newPostText: "" as string | null,
    profile: null as ProfileType | null,
    status: ""
}
export type InitialStateType = typeof initialState

const profileReducer = (state = initialState, action: ActionTypes): InitialStateType => {
    switch (action.type) {
        case ADD_POST:{
            let newPost = {
                id: 7,
                message: action.newPostText,
                likesCount: 0
            };
            return{
                ...state,
                posts:[...state.posts, newPost],
                newPostText: ''
            }              
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
                profile: {...state.profile, photos: action.photos} as ProfileType
            }
        }
        default:
            return state;

    }
}
type ActionTypes = AddPostActionType | SetUserProfileActionType | SetStatusActionType | DeletePostActionType | SavePhotoSuccessActionType  

type AddPostActionType = {
    type: typeof ADD_POST
    newPostText: string
}
export const addPostActionCreator = (newPostText:string):AddPostActionType => {
    return { type: ADD_POST, newPostText }
}

type SetUserProfileActionType = {
    type: typeof SET_USER_PROFILE
    profile: ProfileType
}
export const setUserProfile = (profile: ProfileType): SetUserProfileActionType => {
    return { type: SET_USER_PROFILE, profile }
}

type SetStatusActionType = {
    type: typeof SET_STATUS
    status: string
}
export const setStatus = (status: string): SetStatusActionType => {
    return { type: SET_STATUS, status }
}

type DeletePostActionType = {
    type: typeof DELETE_POST
    postId: number
}
export const deletePost = (postId: number): DeletePostActionType => {
    return { type: DELETE_POST, postId }
}

type SavePhotoSuccessActionType = {
    type: typeof SAVE_PHOTO_SUCCESS
    photos: PhotosType
}
export const savePhotoSuccess = (photos: PhotosType): SavePhotoSuccessActionType => {
    return { type: SAVE_PHOTO_SUCCESS, photos }
}

type ThunkType = ThunkAction <Promise<void>, AppStateType, unknown, ActionTypes>

export const getUserProfile = (userId: number): ThunkType => async (dispatch) => {             
    let response = await usersAPI.getProfile(userId)            
    
    dispatch (setUserProfile(response.data)) 
}
export const getStatus = (userId: number): ThunkType => async (dispatch) => {         
    let response = await profileAPI.getStatus(userId)   
             
    dispatch (setStatus(response.data))
}
export const updateStatus = (status: string): ThunkType => async (dispatch) => {
    let response = await profileAPI.updateStatus(status);
        if (response.data.resultCode === 0) {
            dispatch(setStatus(status))
        }
};
export const savePhoto = (file: any): ThunkType => async (dispatch) => {
    let response = await profileAPI.savePhoto(file);
        if (response.data.resultCode === 0) {
            dispatch(savePhotoSuccess(response.data.data.photos))
        }
}
export const saveProfile = (profile: ProfileType) => async (dispatch: any, getState: any) => {
    const userId = getState().auth.id
    const response = await profileAPI.saveProfile(profile)
    if (response.data.resultCode === 0) {
        dispatch(getUserProfile(userId))
    } else {
        dispatch(stopSubmit('editProfile', {_error:response.data.messages[0]}))
        return Promise.reject(response.data.messages[0])
    }
}

export default profileReducer;