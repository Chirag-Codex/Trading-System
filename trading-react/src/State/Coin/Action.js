import axios from "axios";
import {
  FETCH_COIN_BY_ID_FAILURE,
  FETCH_COIN_BY_ID_REQUEST,
  FETCH_COIN_BY_ID_SUCCESS,
  FETCH_COIN_DETAILS_FAILURE,
  FETCH_COIN_DETAILS_REQUEST,
  FETCH_COIN_DETAILS_SUCCESS,
  FETCH_COIN_LIST_FAILURE,
  FETCH_COIN_LIST_REQUEST,
  FETCH_COIN_LIST_SUCCESS,
  FETCH_MARKET_CHART_FAILURE,
  FETCH_MARKET_CHART_REQUEST,
  FETCH_MARKET_CHART_SUCCESS,
  SEARCH_COIN_FAILURE,
  SEARCH_COIN_REQUEST,
  SEARCH_COIN_SUCCESS,
  TOP_50_COINS_FAILURE,
  TOP_50_COINS_REQUEST,
  TOP_50_COINS_SUCCESS,
} from "./ActionType";
import api from "@/config/api";

export const getCoinList = (page) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_LIST_REQUEST });
  const baseUrl = "http://localhost:5454";
  try {
    const { data } = await axios.get(`${baseUrl}/coins?page=${page}`);

    console.log("Coin List Data:", data);
    dispatch({ type: FETCH_COIN_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_COIN_LIST_FAILURE, payload: error.message });
    console.log(error);
  }
};

export const getTop50CoinList = () => async (dispatch) => {
  dispatch({ type: TOP_50_COINS_REQUEST });
  const baseUrl = "http://localhost:5454";
  try {
    const response = await axios.get(`${baseUrl}/coins/top50`);

    console.log("Coin List Data:", response.data);
    dispatch({ type: TOP_50_COINS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: TOP_50_COINS_FAILURE, payload: error.message });
    console.log(error);
  }
};

export const fetchMarketChart = ({coinId,days,jwt}) => async (dispatch) => {
    if (!coinId) {
        console.error("Coin ID is required");
        dispatch({ type: FETCH_MARKET_CHART_FAILURE, payload: "Coin ID is required" });
        return;
    }
  dispatch({ type: FETCH_MARKET_CHART_REQUEST });
  try {
    const response = await api.get(`/coins/${coinId}/chart?days=${days}`,{
      headers:{
        Authorization: `Bearer ${jwt}`,
      }
    });

    console.log("Coin List Data:", response.data);
    dispatch({ type: FETCH_MARKET_CHART_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_MARKET_CHART_FAILURE, payload: error.message });
    console.log(error);
  }
};

export const fetchCoinById = (coinId) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_BY_ID_REQUEST });
  try {
    const response = await api.get(`/coins/${coinId}`);
    dispatch({ type: FETCH_COIN_BY_ID_SUCCESS, payload: response.data });
     console.log("Coin by id:", response.data);
  } catch (error) {
    dispatch({ type: FETCH_COIN_BY_ID_FAILURE, payload: error.message });
    console.log(error);
  }
};

 export const fetchCoinDetails = ({coinId,jwt}) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_DETAILS_REQUEST });
  try {
    const response = await api.get(`/coins/details/${coinId}`,{
      headers:{
        Authorization: `Bearer ${jwt}`,
      }
    });
    dispatch({ type: FETCH_COIN_DETAILS_SUCCESS, payload: response.data });
     console.log("Coin Details:", response.data);
  } catch (error) {
    dispatch({ type: FETCH_COIN_DETAILS_FAILURE, payload: error.message });
    console.log(error);
  }
};

export const searchCoin = (keyword) => async (dispatch) => {
  dispatch({ type: SEARCH_COIN_REQUEST });
  try {
    const response = await api.get(`/coins/search?q=${keyword}`);
    dispatch({ type: SEARCH_COIN_SUCCESS, payload: response.data });
     console.log("Search Results:", response.data);
  } catch (error) {
    dispatch({ type: SEARCH_COIN_FAILURE, payload: error.message });
    console.log(error);
  }
};