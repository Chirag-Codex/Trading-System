
package com.chirag.trading.service;

import com.chirag.trading.Model.ForgotPasswordToken;
import com.chirag.trading.Model.User;
import com.chirag.trading.domain.VerificationType;

public interface ForgotPasswordService {
    ForgotPasswordToken createToken(User user, String id, String otp,
                                    VerificationType verificationType, String sendTo);

    ForgotPasswordToken findById(String id);

    ForgotPasswordToken findByUser(Long userId);

    void deleteToken(ForgotPasswordToken token);

    // New method to validate token
    boolean validateToken(ForgotPasswordToken token);
}