package com.chirag.trading.Repository;

import com.chirag.trading.Model.TwoFactorOtp;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TwoFactorOtpRepository extends JpaRepository<TwoFactorOtp,String> {
    TwoFactorOtp findByUserId(Long userId);
}
