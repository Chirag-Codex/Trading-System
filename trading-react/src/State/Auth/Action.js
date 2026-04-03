import api from "@/config/api";

// ========== REGISTER ==========
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/auth/signup`, userData);
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
export const login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await api.post("/auth/signin", userData.data);
    const user = response.data;
    console.log("Login response:", user);

    if (user.twoFactorAuthEnabled === true) {
      dispatch({
        type: LOGIN_TWO_STEP_SUCCESS,
        payload: {
          sessionId: user.session,
          email: userData.data.email,
          message: user.message,
        },
      });
      return { twoFactorRequired: true, sessionId: user.session, email: userData.data.email };
    } else {
      dispatch({ type: LOGIN_SUCCESS, payload: user.jwt });
      localStorage.setItem("jwt", user.jwt);
      userData.navigate("/");
      return { success: true };
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.response?.data?.message || error.message });
    console.log(error);
    throw error;
  }
};

// ========== GET USER PROFILE ==========
export const getUser = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/users/profile`, {
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
    const loginResponse = await api.post(`${API_BASE_URL}/auth/signin`, {
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
    const response = await api.post(
      `${API_BASE_URL}/api/users/verification/EMAIL/send-otp`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Send OTP response:", response.data);

    dispatch({
      type: SEND_VERIFICATION_OTP_SUCCESS,
      payload: {
        message: response.data.message,
        email: email,
        jwt: jwt,
      },
    });

    return { success: true, jwt: jwt };
  } catch (error) {
    console.error("Send OTP error:", error.response?.data || error.message);

    dispatch({
      type: SEND_VERIFICATION_OTP_FAILURE,
      payload: error.response?.data?.message || error.message,
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

    const response = await api.patch(
      `${API_BASE_URL}/api/users/enable-two-factor/verify-otp/${otp}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    const updatedUser = response.data;
    console.log("2FA enable response:", updatedUser);

    dispatch({
      type: ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS,
      payload: {
        user: updatedUser,
        message: "2FA enabled successfully",
      },
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Enable 2FA error:", error.response?.data || error.message);

    dispatch({
      type: ENABLE_TWO_STEP_AUTHENTICATION_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// ========== VERIFY LOGIN OTP ==========
export const verifyLoginOtp = (otp, sessionId) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    console.log("Verifying login OTP:", otp, "Session ID:", sessionId);

    const response = await api.post(
      `${API_BASE_URL}/auth/two-factor/otp/${otp}?id=${sessionId}`
    );

    const data = response.data;
    console.log("OTP verification response:", data);

    dispatch({ type: VERIFY_OTP_SUCCESS, payload: data.jwt });
    localStorage.setItem("jwt", data.jwt);

    // Also fetch user data after successful verification
    const userResponse = await api.get(`${API_BASE_URL}/api/users/profile`, {
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
    const response = await api.post(
      `${API_BASE_URL}/auth/forgot-password`,
      { email }
    );

    const data = response.data;
    dispatch({
      type: SEND_RESET_PASSWORD_OTP_SUCCESS,
      payload: { sessionId: data.session },
    });

    return { success: true, sessionId: data.session };
  } catch (error) {
    dispatch({
      type: SEND_RESET_PASSWORD_OTP_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// ========== VERIFY RESET OTP ==========
export const verifyResetOtp = (sessionId, otp) => async (dispatch) => {
  dispatch({ type: VERIFY_RESET_PASSWORD_OTP_REQUEST });
  try {
    const response = await api.post(
      `${API_BASE_URL}/auth/verify-reset-otp`,
      { sessionId, otp }
    );

    const data = response.data;
    dispatch({
      type: VERIFY_RESET_PASSWORD_OTP_SUCCESS,
      payload: { resetToken: data.jwt },
    });

    return { success: true, resetToken: data.jwt };
  } catch (error) {
    dispatch({
      type: VERIFY_RESET_PASSWORD_OTP_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// ========== RESET PASSWORD WITH TOKEN ==========
export const verifyResetPasswordOtp = (resetToken, newPassword) => async (dispatch) => {
  dispatch({ type: VERIFY_RESET_PASSWORD_OTP_REQUEST });
  try {
    const response = await api.post(
      `${API_BASE_URL}/auth/reset-password`,
      { resetToken, newPassword }
    );

    dispatch({ type: VERIFY_RESET_PASSWORD_OTP_SUCCESS });

    return { success: true };
  } catch (error) {
    dispatch({
      type: VERIFY_RESET_PASSWORD_OTP_FAILURE,
      payload: error.response?.data?.message || error.message,
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

    const response = await api.patch(
      `${API_BASE_URL}/api/users/disable-two-factor`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    const updatedUser = response.data;
    console.log("2FA disable response:", updatedUser);

    dispatch({
      type: ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS,
      payload: {
        user: updatedUser,
        message: "2FA disabled successfully",
      },
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Disable 2FA error:", error.response?.data || error.message);

    dispatch({
      type: ENABLE_TWO_STEP_AUTHENTICATION_FAILURE,
      payload: error.response?.data?.message || error.message,
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

