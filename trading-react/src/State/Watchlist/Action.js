import api from "@/config/api";
import { ADD_COIN_TO_WATCHLIST_FAILURE, ADD_COIN_TO_WATCHLIST_REQUEST, ADD_COIN_TO_WATCHLIST_SUCCESS, GET_USER_WATCHLIST_FAILURE, GET_USER_WATCHLIST_REQUEST, GET_USER_WATCHLIST_SUCCESS } from "./ActionType";

export const getUserWatchList=(jwt)=>async(dispatch)=>{
    dispatch({type:GET_USER_WATCHLIST_REQUEST})
    try {
        const response=await api.get("/api/watchlist/user",{
            headers:{
               Authorization:`Bearer ${jwt}`
            }
        });
        console.log("User Watchlist----",response.data);
        dispatch({type:GET_USER_WATCHLIST_SUCCESS,payload:response.data})
    } catch (error) {
        dispatch({type:GET_USER_WATCHLIST_FAILURE,payload:error.message})
    }  }

export const addItemToWatchList=({coinId,jwt})=>async(dispatch)=>{
    dispatch({type:ADD_COIN_TO_WATCHLIST_REQUEST})
    try {
        const response=await api.patch(`/api/watchlist/add/coin/${coinId}`,{},{
            headers:{
               Authorization:`Bearer ${jwt}`
            }
        });
        console.log("Added to Watchlist----",response.data);
        dispatch({type:ADD_COIN_TO_WATCHLIST_SUCCESS,payload:response.data})
    } catch (error) {
        console.log(error,error.message);
        
        dispatch({type:ADD_COIN_TO_WATCHLIST_FAILURE,payload:error.message})
    }  }