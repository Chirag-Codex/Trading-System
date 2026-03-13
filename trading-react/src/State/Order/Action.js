import api from "@/config/api";
import { GET_ALL_ORDERS_FAILURE, GET_ALL_ORDERS_REQUEST, GET_ALL_ORDERS_SUCCESS, PAY_ORDER_FAILURE, PAY_ORDER_REQUEST, PAY_ORDER_SUCCESS } from "./ActionType";

export const payOrder=({jwt,orderData,amount})=> async (dispatch)=>{
    dispatch({type:PAY_ORDER_REQUEST});
    try {
        const response = await api.post('/api/orders/pay',orderData,{
            headers:{
                Authorization: `Bearer ${jwt}`
            },
        });
        console.log("Order payed successfully",response.data,amount);
        
        dispatch({type:PAY_ORDER_SUCCESS,payload:response.data,amount});
    } catch (error) {
        console.log("Error",error);
        
        dispatch({type:PAY_ORDER_FAILURE,payload:error.message});
    }
};

export const getAllOrdersForUsers=({jwt,orderType,assetSymbol})=> async (dispatch)=>{
    dispatch({type:GET_ALL_ORDERS_REQUEST});
    try {
        const response = await api.get('/api/orders',{
            headers:{
                Authorization: `Bearer ${jwt}`
            },
            params:{
                order_type:orderType,
                asset_symbol:assetSymbol,
            }
        });
        console.log("All orders fetched successfully",response.data);
        
        dispatch({type:GET_ALL_ORDERS_SUCCESS,payload:response.data});
    } catch (error) {
        console.log("Error",error);
        
        dispatch({type:GET_ALL_ORDERS_FAILURE,payload:error.message});
    }
};