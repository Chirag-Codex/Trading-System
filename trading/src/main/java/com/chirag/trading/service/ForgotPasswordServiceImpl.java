
package com.chirag.trading.service;

import com.chirag.trading.Model.ForgotPasswordToken;
import com.chirag.trading.Model.User;
import com.chirag.trading.Repository.ForgotPasswordRepository;
import com.chirag.trading.domain.VerificationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ForgotPasswordServiceImpl implements ForgotPasswordService {

    @Autowired
    private ForgotPasswordRepository forgotPasswordRepository;

    @Override
    public ForgotPasswordToken createToken(User user, String id, String otp,
                                           VerificationType verificationType, String sendTo) {
        ForgotPasswordToken token = new ForgotPasswordToken();
        token.setId(id);
        token.setUser(user);
        token.setSendTo(sendTo);
        token.setVerificationType(verificationType);
        token.setOtp(otp);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        return forgotPasswordRepository.save(token);
    }

    @Override
    public ForgotPasswordToken findById(String id) {
        Optional<ForgotPasswordToken> token = forgotPasswordRepository.findById(id);
        return token.orElse(null);
    }

    @Override
    public ForgotPasswordToken findByUser(Long userId) {
        return forgotPasswordRepository.findByUserId(userId);
    }

    @Override
    public void deleteToken(ForgotPasswordToken token) {
        forgotPasswordRepository.delete(token);
    }

    @Override
    public boolean validateToken(ForgotPasswordToken token) {
        if (token == null) {
            return false;
        }
        // Check if token is expired
        if (token.getExpiryDate() != null &&
                LocalDateTime.now().isAfter(token.getExpiryDate())) {
            return false;
        }
        return true;
    }
}