
// import axios from "axios";
// import {
//   GET_USER_FAILURE,
//   GET_USER_REQUEST,
//   GET_USER_SUCCESS,
//   LOGIN_FAILURE,
//   LOGIN_REQUEST,
//   LOGIN_SUCCESS,
//   LOGIN_TWO_STEP_SUCCESS,
//   LOGOUT,
//   REGISTER_FAILURE,
//   REGISTER_REQUEST,
//   REGISTER_SUCCESS,
//   ENABLE_TWO_STEP_AUTHENTICATION_REQUEST,
//   ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS,
//   ENABLE_TWO_STEP_AUTHENTICATION_FAILURE,
//   VERIFY_OTP_REQUEST,
//   VERIFY_OTP_SUCCESS,
//   VERIFY_OTP_FAILURE,
//   SEND_VERIFICATION_OTP_REQUEST,
//   SEND_VERIFICATION_OTP_SUCCESS,
//   SEND_VERIFICATION_OTP_FAILURE,
// } from "./ActionType";

// const API_BASE_URL = "http://localhost:5454";

// export const register = (userData) => async (dispatch) => {
//   dispatch({ type: REGISTER_REQUEST });
//   try {
//     const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
//     const user = response.data;
//     console.log("Register response:", user);
//     dispatch({ type: REGISTER_SUCCESS, payload: user.jwt });
//     localStorage.setItem("jwt", user.jwt);
//     return user;
//   } catch (error) {
//     dispatch({ type: REGISTER_FAILURE, payload: error.message });
//     console.log(error);
//     throw error;
//   }
// };

// export const login = (userData) => async (dispatch) => {
//   dispatch({ type: LOGIN_REQUEST });
//   try {
//     const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData.data);
//     const user = response.data;
//     console.log("Login response:", user);
    
//     // Check if 2FA is required
//     if (user.twoFactorAuthEnabled) {
//       dispatch({ 
//         type: LOGIN_TWO_STEP_SUCCESS, 
//         payload: { 
//           sessionId: user.session,
//           email: userData.data.email,
//           message: user.message 
//         } 
//       });
//       return { twoFactorRequired: true, sessionId: user.session, email: userData.data.email };
//     } else {
//       dispatch({ type: LOGIN_SUCCESS, payload: user.jwt });
//       localStorage.setItem("jwt", user.jwt);
//       userData.navigate("/");
//       return { success: true };
//     }
//   } catch (error) {
//     dispatch({ type: LOGIN_FAILURE, payload: error.message });
//     console.log(error);
//     throw error;
//   }
// };

// export const getUser = (jwt) => async (dispatch) => {
//   dispatch({ type: GET_USER_REQUEST });
//   try {
//     const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
//       headers: {
//         Authorization: `Bearer ${jwt}`,
//       },
//     });
//     const user = response.data;
//     console.log("User profile:", user);
//     dispatch({ type: GET_USER_SUCCESS, payload: user });
//     return user;
//   } catch (error) {
//     dispatch({ type: GET_USER_FAILURE, payload: error.message });
//     console.log(error);
//     throw error;
//   }
// };

// // Send OTP for enabling 2FA - Using VerificationCode endpoint
// export const sendTwoFactorOtp = (email, password) => async (dispatch) => {
//   dispatch({ type: SEND_VERIFICATION_OTP_REQUEST });
//   try {
//     console.log("Sending OTP for email:", email);
    
//     // First, login to get JWT
//     const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, {
//       email,
//       password,
//     });
    
//     console.log("Login response:", loginResponse.data);
//     const jwt = loginResponse.data.jwt;
    
//     if (!jwt) {
//       throw new Error("No JWT received from login");
//     }
    
//     // Store JWT for later use
//     localStorage.setItem("jwt", jwt);
    
//     // Send OTP using the verification endpoint
//     console.log("Sending OTP request with JWT:", jwt);
//     const response = await axios.post(
//       `${API_BASE_URL}/api/users/verification/EMAIL/send-otp`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${jwt}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
    
//     console.log("Send OTP response:", response.data);
    
//     dispatch({ 
//       type: SEND_VERIFICATION_OTP_SUCCESS, 
//       payload: { 
//         message: response.data,
//         email: email,
//         jwt: jwt
//       } 
//     });
    
//     return { success: true, jwt: jwt };
//   } catch (error) {
//     console.error("Send OTP error details:", error.response?.data || error.message);
//     console.error("Full error:", error);
    
//     dispatch({ 
//       type: SEND_VERIFICATION_OTP_FAILURE, 
//       payload: error.response?.data?.message || error.message 
//     });
//     throw error;
//   }
// };

// // Enable 2FA by verifying OTP - Using VerificationCode endpoint
// export const enableTwoFactorAuth = (otp) => async (dispatch, getState) => {
//   dispatch({ type: ENABLE_TWO_STEP_AUTHENTICATION_REQUEST });
//   try {
//     const jwt = localStorage.getItem("jwt");
//     if (!jwt) {
//       throw new Error("No JWT found. Please login again.");
//     }
    
//     console.log("Enabling 2FA with OTP:", otp);
//     console.log("Using JWT:", jwt);
    
//     const response = await axios.patch(
//       `${API_BASE_URL}/api/users/enable-two-factor/verify-otp/${otp}`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${jwt}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
    
//     const updatedUser = response.data;
//     console.log("2FA enable response:", updatedUser);
    
//     dispatch({ 
//       type: ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS, 
//       payload: { 
//         user: updatedUser,
//         message: "2FA enabled successfully" 
//       } 
//     });
    
//     // Update user in localStorage
//     localStorage.setItem("user", JSON.stringify(updatedUser));
    
//     return { success: true, user: updatedUser };
//   } catch (error) {
//     console.error("Enable 2FA error:", error.response?.data || error.message);
//     console.error("Full error:", error);
    
//     dispatch({ 
//       type: ENABLE_TWO_STEP_AUTHENTICATION_FAILURE, 
//       payload: error.response?.data?.message || error.message 
//     });
//     throw error;
//   }
// };

// // Verify OTP during login - Uses TwoFactorOtp from AuthController
// export const verifyLoginOtp = (otp, sessionId) => async (dispatch) => {
//   dispatch({ type: VERIFY_OTP_REQUEST });
//   try {
//     console.log("Verifying login OTP:", otp, "Session ID:", sessionId);
    
//     const response = await axios.post(
//       `${API_BASE_URL}/auth/two-factor/otp/${otp}?id=${sessionId}`
//     );
    
//     const data = response.data;
//     console.log("OTP verification response:", data);
    
//     dispatch({ type: VERIFY_OTP_SUCCESS, payload: data.jwt });
//     localStorage.setItem("jwt", data.jwt);
    
//     // Also fetch user data after successful verification
//     const userResponse = await axios.get(`${API_BASE_URL}/api/users/profile`, {
//       headers: {
//         Authorization: `Bearer ${data.jwt}`,
//       },
//     });
//     dispatch({ type: GET_USER_SUCCESS, payload: userResponse.data });
    
//     return { success: true, jwt: data.jwt };
//   } catch (error) {
//     console.error("Verify login OTP error:", error.response?.data || error.message);
//     dispatch({ type: VERIFY_OTP_FAILURE, payload: error.message });
//     throw error;
//   }
// };

// export const logout = () => (dispatch) => {
//   localStorage.clear();
//   dispatch({ type: LOGOUT });
// };




// src/State/Auth/Action.js

import axios from "axios";
import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_TWO_STEP_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  ENABLE_TWO_STEP_AUTHENTICATION_REQUEST,
  ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS,
  ENABLE_TWO_STEP_AUTHENTICATION_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  SEND_VERIFICATION_OTP_REQUEST,
  SEND_VERIFICATION_OTP_SUCCESS,
  SEND_VERIFICATION_OTP_FAILURE,
  SEND_RESET_PASSWORD_OTP_REQUEST,
  SEND_RESET_PASSWORD_OTP_SUCCESS,
  SEND_RESET_PASSWORD_OTP_FAILURE,
  VERIFY_RESET_PASSWORD_OTP_REQUEST,
  VERIFY_RESET_PASSWORD_OTP_SUCCESS,
  VERIFY_RESET_PASSWORD_OTP_FAILURE,
} from "./ActionType";

const API_BASE_URL = "http://localhost:5454";

// ========== REGISTER ==========
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    const user = response.data;
    console.log("Register response:", user);
    dispatch({ type: REGISTER_SUCCESS, payload: user.jwt });
    localStorage.setItem("jwt", user.jwt);
    return user;
  } catch (error) {
    dispatch({ type: REGISTER_FAILURE, payload: error.response?.data?.message || error.message });
    console.log(error);
    throw error;
  }
};

// ========== LOGIN ==========
// export const login = (userData) => async (dispatch) => {
//   dispatch({ type: LOGIN_REQUEST });
//   try {
//     const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData.data);
//     const user = response.data;
//     console.log("Login response:", user);
    
//     // Check if 2FA is required
//     if (user.twoFactorAuthEnabled === true) {
//       dispatch({ 
//         type: LOGIN_TWO_STEP_SUCCESS, 
//         payload: { 
//           sessionId: user.session,
//           email: userData.data.email,
//           message: user.message 
//         } 
//       });
//       return { twoFactorRequired: true, sessionId: user.session, email: userData.data.email };
//     } else {
//       dispatch({ type: LOGIN_SUCCESS, payload: user.jwt });
//       localStorage.setItem("jwt", user.jwt);
//       userData.navigate("/");
//       return { success: true };
//     }
//   } catch (error) {
//     dispatch({ type: LOGIN_FAILURE, payload: error.response?.data?.message || error.message });
//     console.log(error);
//     throw error;
//   }
// };
// In Action.js, update your login function
export const login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    console.log("===== LOGIN ACTION START =====");
    console.log("Sending login request to:", `${API_BASE_URL}/auth/signin`);
    console.log("Data:", userData.data);
    
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData.data);
    const user = response.data;
    console.log("Login response FULL:", JSON.stringify(user, null, 2));
    console.log("Response status:", response.status);
    
    // Check if 2FA is required
    if (user.twoFactorAuthEnabled === true) {
      console.log("2FA REQUIRED - Dispatching LOGIN_TWO_STEP_SUCCESS");
      console.log("Session ID:", user.session);
      console.log("Email:", userData.data.email);
      
      dispatch({ 
        type: LOGIN_TWO_STEP_SUCCESS, 
        payload: { 
          sessionId: user.session,
          email: userData.data.email,
          message: user.message 
        } 
      });
      
      console.log("Returning twoFactorRequired: true");
      return { twoFactorRequired: true, sessionId: user.session, email: userData.data.email };
    } else {
      console.log("NO 2FA - Normal login");
      console.log("JWT:", user.jwt);
      
      dispatch({ type: LOGIN_SUCCESS, payload: user.jwt });
      localStorage.setItem("jwt", user.jwt);
      userData.navigate("/");
      return { success: true };
    }
  } catch (error) {
    console.error("===== LOGIN ACTION ERROR =====");
    console.error("Error:", error);
    console.error("Response data:", error.response?.data);
    console.error("Response status:", error.response?.status);
    
    dispatch({ type: LOGIN_FAILURE, payload: error.response?.data?.message || error.message });
    throw error;
  }
};
// ========== GET USER PROFILE ==========
export const getUser = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const user = response.data;
    console.log("User profile:", user);
    dispatch({ type: GET_USER_SUCCESS, payload: user });
    return user;
  } catch (error) {
    dispatch({ type: GET_USER_FAILURE, payload: error.response?.data?.message || error.message });
    console.log(error);
    throw error;
  }
};

// ========== SEND OTP FOR ENABLING 2FA ==========
export const sendTwoFactorOtp = (email, password) => async (dispatch) => {
  dispatch({ type: SEND_VERIFICATION_OTP_REQUEST });
  try {
    console.log("Sending OTP for email:", email);
    
    // First, login to get JWT
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, {
      email,
      password,
    });
    
    console.log("Login response:", loginResponse.data);
    const jwt = loginResponse.data.jwt;
    
    if (!jwt) {
      throw new Error("No JWT received from login");
    }
    
    // Store JWT for later use
    localStorage.setItem("jwt", jwt);
    
    // Send OTP using the verification endpoint - Email only
    const response = await axios.post(
      `${API_BASE_URL}/api/users/verification/EMAIL/send-otp`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log("Send OTP response:", response.data);
    
    dispatch({ 
      type: SEND_VERIFICATION_OTP_SUCCESS, 
      payload: { 
        message: response.data.message,
        email: email,
        jwt: jwt
      } 
    });
    
    return { success: true, jwt: jwt };
  } catch (error) {
    console.error("Send OTP error:", error.response?.data || error.message);
    
    dispatch({ 
      type: SEND_VERIFICATION_OTP_FAILURE, 
      payload: error.response?.data?.message || error.message 
    });
    throw error;
  }
};

// ========== ENABLE 2FA ==========
export const enableTwoFactorAuth = (otp) => async (dispatch, getState) => {
  dispatch({ type: ENABLE_TWO_STEP_AUTHENTICATION_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      throw new Error("No JWT found. Please login again.");
    }
    
    console.log("Enabling 2FA with OTP:", otp);
    
    const response = await axios.patch(
      `${API_BASE_URL}/api/users/enable-two-factor/verify-otp/${otp}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const updatedUser = response.data;
    console.log("2FA enable response:", updatedUser);
    
    dispatch({ 
      type: ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS, 
      payload: { 
        user: updatedUser,
        message: "2FA enabled successfully" 
      } 
    });
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Enable 2FA error:", error.response?.data || error.message);
    
    dispatch({ 
      type: ENABLE_TWO_STEP_AUTHENTICATION_FAILURE, 
      payload: error.response?.data?.message || error.message 
    });
    throw error;
  }
};

// ========== VERIFY LOGIN OTP ==========
export const verifyLoginOtp = (otp, sessionId) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    console.log("Verifying login OTP:", otp, "Session ID:", sessionId);
    
    const response = await axios.post(
      `${API_BASE_URL}/auth/two-factor/otp/${otp}?id=${sessionId}`
    );
    
    const data = response.data;
    console.log("OTP verification response:", data);
    
    dispatch({ type: VERIFY_OTP_SUCCESS, payload: data.jwt });
    localStorage.setItem("jwt", data.jwt);
    
    // Also fetch user data after successful verification
    const userResponse = await axios.get(`${API_BASE_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${data.jwt}`,
      },
    });
    dispatch({ type: GET_USER_SUCCESS, payload: userResponse.data });
    
    return { success: true, jwt: data.jwt };
  } catch (error) {
    console.error("Verify login OTP error:", error.response?.data || error.message);
    dispatch({ type: VERIFY_OTP_FAILURE, payload: error.response?.data?.message || error.message });
    throw error;
  }
};

// ========== SEND RESET PASSWORD OTP ==========
export const sendResetPasswordOtp = (email) => async (dispatch) => {
  dispatch({ type: SEND_RESET_PASSWORD_OTP_REQUEST });
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/forgot-password`,
      { email }
    );
    
    const data = response.data;
    dispatch({ 
      type: SEND_RESET_PASSWORD_OTP_SUCCESS, 
      payload: { sessionId: data.session } 
    });
    
    return { success: true, sessionId: data.session };
  } catch (error) {
    dispatch({ 
      type: SEND_RESET_PASSWORD_OTP_FAILURE, 
      payload: error.response?.data?.message || error.message 
    });
    throw error;
  }
};

// ========== VERIFY RESET OTP ==========
export const verifyResetOtp = (sessionId, otp) => async (dispatch) => {
  dispatch({ type: VERIFY_RESET_PASSWORD_OTP_REQUEST });
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/verify-reset-otp`,
      { sessionId, otp }
    );
    
    const data = response.data;
    dispatch({ 
      type: VERIFY_RESET_PASSWORD_OTP_SUCCESS, 
      payload: { resetToken: data.jwt } 
    });
    
    return { success: true, resetToken: data.jwt };
  } catch (error) {
    dispatch({ 
      type: VERIFY_RESET_PASSWORD_OTP_FAILURE, 
      payload: error.response?.data?.message || error.message 
    });
    throw error;
  }
};

// ========== RESET PASSWORD WITH TOKEN ==========
export const verifyResetPasswordOtp = (resetToken, newPassword) => async (dispatch) => {
  dispatch({ type: VERIFY_RESET_PASSWORD_OTP_REQUEST });
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/reset-password`,
      { resetToken, newPassword }
    );
    
    dispatch({ type: VERIFY_RESET_PASSWORD_OTP_SUCCESS });
    
    return { success: true };
  } catch (error) {
    dispatch({ 
      type: VERIFY_RESET_PASSWORD_OTP_FAILURE, 
      payload: error.response?.data?.message || error.message 
    });
    throw error;
  }
};

// ========== DISABLE 2FA ==========
export const disableTwoFactorAuth = () => async (dispatch) => {
  dispatch({ type: ENABLE_TWO_STEP_AUTHENTICATION_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      throw new Error("No JWT found. Please login again.");
    }
    
    const response = await axios.patch(
      `${API_BASE_URL}/api/users/disable-two-factor`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const updatedUser = response.data;
    console.log("2FA disable response:", updatedUser);
    
    dispatch({ 
      type: ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS, 
      payload: { 
        user: updatedUser,
        message: "2FA disabled successfully" 
      } 
    });
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Disable 2FA error:", error.response?.data || error.message);
    
    dispatch({ 
      type: ENABLE_TWO_STEP_AUTHENTICATION_FAILURE, 
      payload: error.response?.data?.message || error.message 
    });
    throw error;
  }
};

// ========== LOGOUT ==========
export const logout = () => (dispatch) => {
  localStorage.clear();
  dispatch({ type: LOGOUT });
};

// ========== RESET STATES ==========
// export const resetTwoFactorState = () => (dispatch) => {
//   dispatch({ type: "RESET_TWO_FACTOR_STATE" });
// };

export const resetTwoFactorState = () => (dispatch) => {
  dispatch({ type: "RESET_TWO_FACTOR_STATE" });
};

export const resetPasswordState = () => (dispatch) => {
  dispatch({ type: "RESET_PASSWORD_STATE" });
};

export const clearError = () => (dispatch) => {
  dispatch({ type: "CLEAR_ERROR" });
};

// ========== UPDATE USER ==========
export const updateUser = (user) => (dispatch) => {
  dispatch({ type: "UPDATE_USER", payload: user });
};

