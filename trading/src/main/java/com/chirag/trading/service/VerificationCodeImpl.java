
package com.chirag.trading.service;

import com.chirag.trading.Model.User;
import com.chirag.trading.Model.VerificationCode;
import com.chirag.trading.Repository.VerificationCodeRepository;
import com.chirag.trading.domain.VerificationType;
import com.chirag.trading.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class VerificationCodeImpl implements VerificationCodeService {

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Override
    public VerificationCode sendVerificationCode(User user, VerificationType verificationType) {
        // Delete any existing verification code for this user
        VerificationCode existingCode = verificationCodeRepository.findByUserId(user.getId());
        if (existingCode != null) {
            verificationCodeRepository.delete(existingCode);
        }

        // Create new verification code
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setOtp(OtpUtils.generateOtp());
        verificationCode.setVerificationType(verificationType);
        verificationCode.setUser(user);
        verificationCode.setEmail(user.getEmail()); // Set email

        return verificationCodeRepository.save(verificationCode);
    }

    @Override
    public VerificationCode getVerificationCodeById(Long id) throws Exception {
        Optional<VerificationCode> verificationCode = verificationCodeRepository.findById(id);
        if (verificationCode.isEmpty()) {
            throw new Exception("Verification Code Not Found");
        }
        return verificationCode.get();
    }

    @Override
    public VerificationCode getVerificationCodeByUser(Long userId) {
        return verificationCodeRepository.findByUserId(userId);
    }

    @Override
    public void deleteVerificationCodeById(VerificationCode verificationCode) {
        if (verificationCode != null) {
            verificationCodeRepository.delete(verificationCode);
        }
    }
}