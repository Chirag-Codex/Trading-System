package com.chirag.trading.service;

import com.chirag.trading.Model.TwoFactorOtp;
import com.chirag.trading.Model.User;
import org.springframework.context.annotation.Bean;


public interface TwoFactorOtpService {

    TwoFactorOtp createTwoFactorOtp(User user,String otp,String jwt);

    TwoFactorOtp findByUser(Long userId);

    TwoFactorOtp findById(String id);

    boolean verifyTwoFactorOtp(TwoFactorOtp twoFactorOtp,String otp);

    void deleteTwoFactorOtp(TwoFactorOtp twoFactorOtp);
}
