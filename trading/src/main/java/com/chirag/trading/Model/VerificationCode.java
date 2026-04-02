//package com.chirag.trading.Model;
//
//import com.chirag.trading.domain.VerificationType;
//import jakarta.persistence.*;
//import lombok.Data;
//
//@Data
//@Entity
//public class VerificationCode {
//    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
//    private Long id;
//
//    private String otp;
//
//    @OneToOne
//    private User user;
//
//    private String email;
//
//    private String mobile;
//
//    private VerificationType verificationType;
//
//}


package com.chirag.trading.Model;

import com.chirag.trading.domain.VerificationType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class VerificationCode {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String otp;

    private String email;

    @Enumerated(EnumType.STRING)
    private VerificationType verificationType;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}