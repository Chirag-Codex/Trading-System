import {
  WITHDRAWAL_REQUEST,
  WITHDRAWAL_PROCEED_REQUEST,
  GET_WITHDRAWAL_REQUEST_REQUEST,
  GET_WITHDRAWAL_HISTORY_REQUEST,
  WITHDRAWAL_PROCEED_SUCCESS,
  WITHDRAWAL_SUCCESS,
  WITHDRAWAL_PROCEED_FAILURE,
  ADD_PAYMENT_DETAILS_SUCCESS,
  GET_PAYMENT_DETAILS_SUCCESS,
  GET_WITHDRAWAL_REQUEST_SUCCESS,
  GET_WITHDRAWAL_HISTORY_SUCCESS,
  GET_WITHDRAWAL_REQUEST_FAILURE,
  GET_WITHDRAWAL_HISTORY_FAILURE,
  WITHDRAWAL_FAILURE,
} from "./ActionType";

const initialState = {
  withdrawal: null,
  history: [],
  loading: false,
  paymentDetails: null,
  requests: [],
  error: null,
};

const WithdrawalReducer = (state = initialState, action) => {
  switch (action.type) {
    case WITHDRAWAL_REQUEST:
    case GET_WITHDRAWAL_HISTORY_REQUEST:
    case GET_WITHDRAWAL_REQUEST_REQUEST:
    case WITHDRAWAL_PROCEED_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case WITHDRAWAL_SUCCESS:
      return {
        ...state,
        loading: false,
        withdrawal: action.payload,
        error: null,
      };
    case ADD_PAYMENT_DETAILS_SUCCESS:
    case GET_PAYMENT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentDetails: action.payload,
        error: null,
      };
    case WITHDRAWAL_PROCEED_SUCCESS:
      return {
        ...state,
        requests: state.requests.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
        loading: false,
        error: null,
      };
    case GET_WITHDRAWAL_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        history: action.payload,
        error: null,
      };
    case GET_WITHDRAWAL_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        requests: action.payload,
        error: null,
      };
    case WITHDRAWAL_FAILURE:
    case WITHDRAWAL_PROCEED_FAILURE:
    case GET_WITHDRAWAL_HISTORY_FAILURE:
    case GET_WITHDRAWAL_REQUEST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};


export default WithdrawalReducer;