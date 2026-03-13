import { existInWatchlist } from "@/utils/existInWatchlist";
import { ADD_COIN_TO_WATCHLIST_FAILURE, ADD_COIN_TO_WATCHLIST_REQUEST, ADD_COIN_TO_WATCHLIST_SUCCESS, GET_USER_WATCHLIST_FAILURE, GET_USER_WATCHLIST_REQUEST, GET_USER_WATCHLIST_SUCCESS } from "./ActionType";

const initialState = {
  watchlist: null,
  loading: false,
  error: null,
  items: [],
};

export const watchlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_WATCHLIST_REQUEST:
    case ADD_COIN_TO_WATCHLIST_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_USER_WATCHLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        watchlist: action.payload,
        items: action.payload.coins,
        error:null
      };
    case ADD_COIN_TO_WATCHLIST_SUCCESS:
        let updatedItems=existInWatchlist(state.items,action.payload)?
        state.items.filter((item)=>item.id!==action.payload.id):
        [action.payload,...state.items]
      return {
        ...state,
        loading: false,
        items: updatedItems,
        error:null
      };
    case GET_USER_WATCHLIST_FAILURE:
    case ADD_COIN_TO_WATCHLIST_FAILURE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default watchlistReducer;
