package com.chirag.trading.service;

import com.chirag.trading.Model.User;
import com.chirag.trading.Model.VerificationCode;
import com.chirag.trading.domain.VerificationType;

public interface VerificationCodeService {
    VerificationCode sendVerificationCode(User user, VerificationType verificationType);

    VerificationCode getVerificationCodeById(Long id) throws Exception;

    VerificationCode getVerificationCodeByUser(Long userId);

   void deleteVerificationCodeById(VerificationCode verificationCode);
}
