// import {
//   REGISTER_REQUEST,
//   REGISTER_SUCCESS,
//   REGISTER_FAILURE,
//   LOGIN_SUCCESS,
//   LOGIN_REQUEST,
//   LOGIN_TWO_STEP_SUCCESS,
//   GET_USER_REQUEST,
//   GET_USER_SUCCESS,
//   LOGIN_FAILURE,
//   GET_USER_FAILURE,
//   LOGOUT,
//   SEND_VERIFICATION_OTP_REQUEST,
//   SEND_VERIFICATION_OTP_SUCCESS,
//   SEND_VERIFICATION_OTP_FAILURE,
//   ENABLE_TWO_STEP_AUTHENTICATION_REQUEST,
//   ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS,
//   ENABLE_TWO_STEP_AUTHENTICATION_FAILURE,
//   VERIFY_OTP_REQUEST,
//   VERIFY_OTP_SUCCESS,
//   VERIFY_OTP_FAILURE,
// } from "./ActionType";

// const initialState = {
//   user: null,
//   loading: false,
//   error: null,
//   jwt: null,
//   twoFactorRequired: false,
//   twoFactorSessionId: null,
//   twoFactorEmail: null,
//   twoFactorEnabled: false,
//   otpSent: false,
// };

// const authReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LOGIN_REQUEST:
//     case REGISTER_REQUEST:
//     case GET_USER_REQUEST:
//     case SEND_VERIFICATION_OTP_REQUEST:
//     case ENABLE_TWO_STEP_AUTHENTICATION_REQUEST:
//     case VERIFY_OTP_REQUEST:
//       return { ...state, loading: true, error: null };

//     case REGISTER_SUCCESS:
//     case LOGIN_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         error: null,
//         jwt: action.payload,
//         twoFactorRequired: false,
//         twoFactorSessionId: null,
//       };

//     case LOGIN_TWO_STEP_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         error: null,
//         twoFactorRequired: true,
//         twoFactorSessionId: action.payload.sessionId,
//         twoFactorEmail: action.payload.email,
//       };

//     case GET_USER_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         error: null,
//         user: action.payload,
//         twoFactorEnabled: action.payload.twoFactorAuth?.enabled || false,
//       };

//     case SEND_VERIFICATION_OTP_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         error: null,
//         otpSent: true,
//       };

//     case ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         error: null,
//         user: action.payload.user,
//         twoFactorEnabled: true,
//         otpSent: false,
//         twoFactorSessionId: null,
//       };

//     case VERIFY_OTP_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         error: null,
//         jwt: action.payload,
//         twoFactorRequired: false,
//         twoFactorSessionId: null,
//       };

//     case REGISTER_FAILURE:
//     case LOGIN_FAILURE:
//     case GET_USER_FAILURE:
//     case SEND_VERIFICATION_OTP_FAILURE:
//     case ENABLE_TWO_STEP_AUTHENTICATION_FAILURE:
//     case VERIFY_OTP_FAILURE:
//       return {
//         ...state,
//         loading: false,
//         error: action.payload,
//       };

//     case LOGOUT:
//       return initialState;

//     default:
//       return state;
//   }
// };

// export default authReducer;

// src/State/Auth/Reducer.js

import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_TWO_STEP_SUCCESS,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_FAILURE,
  LOGOUT,
  SEND_VERIFICATION_OTP_REQUEST,
  SEND_VERIFICATION_OTP_SUCCESS,
  SEND_VERIFICATION_OTP_FAILURE,
  ENABLE_TWO_STEP_AUTHENTICATION_REQUEST,
  ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS,
  ENABLE_TWO_STEP_AUTHENTICATION_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  SEND_RESET_PASSWORD_OTP_REQUEST,
  SEND_RESET_PASSWORD_OTP_SUCCESS,
  SEND_RESET_PASSWORD_OTP_FAILURE,
  VERIFY_RESET_PASSWORD_OTP_REQUEST,
  VERIFY_RESET_PASSWORD_OTP_SUCCESS,
  VERIFY_RESET_PASSWORD_OTP_FAILURE,
} from "./ActionType";

const initialState = {
  user: null,
  loading: false,
  error: null,
  jwt: null,
  twoFactorRequired: false,
  twoFactorSessionId: null,
  twoFactorEmail: null,
  twoFactorEnabled: false,
  otpSent: false,
  resetPasswordToken: null,
  resetPasswordOtpSent: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // ========== REQUEST STATES ==========
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case GET_USER_REQUEST:
    case SEND_VERIFICATION_OTP_REQUEST:
    case ENABLE_TWO_STEP_AUTHENTICATION_REQUEST:
    case VERIFY_OTP_REQUEST:
    case SEND_RESET_PASSWORD_OTP_REQUEST:
    case VERIFY_RESET_PASSWORD_OTP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // ========== REGISTER ==========
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        jwt: action.payload,
        twoFactorRequired: false,
        twoFactorSessionId: null,
        twoFactorEmail: null,
      };

    // ========== LOGIN ==========
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        jwt: action.payload,
        twoFactorRequired: false,
        twoFactorSessionId: null,
        twoFactorEmail: null,
      };

    // In Reducer.js
    case LOGIN_TWO_STEP_SUCCESS:
      console.log("Reducer - LOGIN_TWO_STEP_SUCCESS payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: null,
        twoFactorRequired: true,
        twoFactorSessionId: action.payload.sessionId,
        twoFactorEmail: action.payload.email,
      };

    // ========== GET USER ==========
    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload,
        twoFactorEnabled: action.payload?.twoFactorAuth?.enabled || false,
      };

    // ========== SEND OTP FOR 2FA ENABLE ==========
    case SEND_VERIFICATION_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        otpSent: true,
      };

    // ========== ENABLE 2FA ==========
    case ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload.user,
        twoFactorEnabled: true,
        otpSent: false,
        twoFactorSessionId: null,
      };

    // ========== VERIFY LOGIN OTP ==========
    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        jwt: action.payload,
        twoFactorRequired: false,
        twoFactorSessionId: null,
        twoFactorEmail: null,
      };

    // ========== RESET PASSWORD ==========
    case SEND_RESET_PASSWORD_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        resetPasswordToken: action.payload.sessionId,
        resetPasswordOtpSent: true,
      };

    case VERIFY_RESET_PASSWORD_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        resetPasswordToken: null,
        resetPasswordOtpSent: false,
      };

    // ========== FAILURE STATES ==========
    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
    case SEND_VERIFICATION_OTP_FAILURE:
    case ENABLE_TWO_STEP_AUTHENTICATION_FAILURE:
    case VERIFY_OTP_FAILURE:
    case SEND_RESET_PASSWORD_OTP_FAILURE:
    case VERIFY_RESET_PASSWORD_OTP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // ========== LOGOUT ==========
    case LOGOUT:
      return {
        ...initialState,
      };

    // ========== CUSTOM RESET ACTIONS ==========
    // case "RESET_TWO_FACTOR_STATE":
    //   return {
    //     ...state,
    //     twoFactorRequired: false,
    //     twoFactorSessionId: null,
    //     twoFactorEmail: null,
    //     error: null,
    //   };

    case "RESET_TWO_FACTOR_STATE":
      return {
        ...state,
        twoFactorRequired: false,
        twoFactorSessionId: null,
        twoFactorEmail: null,
        error: null,
      };

    case "RESET_PASSWORD_STATE":
      return {
        ...state,
        resetPasswordToken: null,
        resetPasswordOtpSent: false,
        error: null,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
        twoFactorEnabled: action.payload?.twoFactorAuth?.enabled || false,
      };

    default:
      return state;
  }
};

export default authReducer;
