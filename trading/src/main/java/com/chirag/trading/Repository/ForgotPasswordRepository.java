//package com.chirag.trading.Repository;
//
//import com.chirag.trading.Model.ForgotPasswordToken;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//public interface ForgotPasswordRepository extends JpaRepository<ForgotPasswordToken,String> {
//    ForgotPasswordToken findByUserId(Long userId);
//}




package com.chirag.trading.Repository;

import com.chirag.trading.Model.ForgotPasswordToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPasswordToken, String> {

    ForgotPasswordToken findByUserId(Long userId);

    // Add method to delete expired tokens
    @Modifying
    @Transactional
    @Query("DELETE FROM ForgotPasswordToken f WHERE f.expiryDate < :now")
    void deleteAllExpiredTokens(LocalDateTime now);
}