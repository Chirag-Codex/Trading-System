
package com.chirag.trading.Model;

import com.chirag.trading.domain.VerificationType;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class ForgotPasswordToken {
    @Id
    private String id;

    @OneToOne
    private User user;

    private String otp;

    @Enumerated(EnumType.STRING)
    private VerificationType verificationType;

    private String sendTo;

    private LocalDateTime expiryDate;


    @PrePersist
    protected void onCreate() {
        if (expiryDate == null) {
            expiryDate = LocalDateTime.now().plusMinutes(15);
        }
    }
}