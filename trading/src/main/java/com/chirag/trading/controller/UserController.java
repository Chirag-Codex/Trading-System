//package com.chirag.trading.controller;
//
//import com.chirag.trading.request.ForgotPasswordTokenRequest;
//import com.chirag.trading.Model.ForgotPasswordToken;
//import com.chirag.trading.Model.User;
//import com.chirag.trading.Model.VerificationCode;
//import com.chirag.trading.domain.VerificationType;
//import com.chirag.trading.request.ResetPasswordRequest;
//import com.chirag.trading.response.ApiResponse;
//import com.chirag.trading.response.AuthResponse;
//import com.chirag.trading.service.EmailService;
//import com.chirag.trading.service.ForgotPasswordService;
//import com.chirag.trading.service.UserService;
//import com.chirag.trading.service.VerificationCodeService;
//import com.chirag.trading.utils.OtpUtils;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.UUID;
//
//@RestController
//
//public class UserController {
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private EmailService emailService;
//
//    @Autowired
//    private VerificationCodeService verificationCodeService;
//
//    @Autowired
//    private ForgotPasswordService forgotPasswordService;
//
//    @GetMapping("/api/users/profile")
//    public ResponseEntity<User>getUserProfile(@RequestHeader("Authorization")String jwt)throws Exception{
//        User user=userService.findUserProfileByJwt(jwt);
//
//        return new ResponseEntity<>(user, HttpStatus.OK);
//    }
//    @PostMapping("/api/users/verification/{verificationType}/send-otp")
//    public ResponseEntity<String>sendVerificationOtp(
//            @RequestHeader("Authorization")String jwt,
//            @PathVariable VerificationType verificationType
//    )throws Exception{
//        User user=userService.findUserProfileByJwt(jwt);
//
//        VerificationCode verificationCode=verificationCodeService.getVerificationCodeByUser(user.getId());
//
//        if (verificationCode==null){
//            verificationCode=verificationCodeService.sendVerificationCode(user,verificationType);
//        }
//        if (verificationType.equals(VerificationType.EMAIL)){
//            emailService.sendVerificationOtpEmail(user.getEmail(),verificationCode.getOtp());
//        }
//        return new ResponseEntity<>("verification otp sent successfully",HttpStatus.OK);
//    }
//    @PatchMapping("/api/users/enable-two-factor/verify-otp/{otp}")
//    public ResponseEntity<User> enableTwoFactorAuthentication
//            (@RequestHeader("Authorization")String jwt,
//             @PathVariable String otp) throws Exception {
//        User user=userService.findUserProfileByJwt(jwt);
//
//        VerificationCode verificationCode=verificationCodeService.getVerificationCodeByUser(user.getId());
//        String sendTo=verificationCode.getVerificationType().equals(VerificationType.EMAIL)?
//                verificationCode.getEmail():verificationCode.getMobile();
//
//        boolean isVerified=verificationCode.getOtp().equals(otp);
//        if (isVerified){
//            User updatedUser=userService.enableTwoFactorAuthentication(verificationCode.getVerificationType(),sendTo,user);
//            return new ResponseEntity<>(updatedUser,HttpStatus.OK);
//        }
//        verificationCodeService.deleteVerificationCodeById(verificationCode);
//        throw new Exception("Wrong Otp");
//    }
//    @PostMapping("/auth/users/reset-password/send-otp")
//    public ResponseEntity<AuthResponse>sendForgotPasswordOtp(
//            @PathVariable VerificationType verificationType,
//            @RequestBody ForgotPasswordTokenRequest req
//            )throws Exception{
//        User user=userService.findUserByEmail(req.getSendTo());
//
//       String otp= OtpUtils.generateOtp();
//        UUID uuid=UUID.randomUUID();
//        String id=uuid.toString();
//
//        ForgotPasswordToken token=forgotPasswordService.findByUser(user.getId());
//
//        if (token==null){
//            token=forgotPasswordService.createToken(user,id,otp,req.getVerificationType(),req.getSendTo());
//        }
//        if (req.getVerificationType().equals(VerificationType.EMAIL)){
//            emailService.sendVerificationOtpEmail(user.getEmail(),token.getOtp());
//        }
//        AuthResponse response=new AuthResponse();
//        response.setSession(token.getId());
//        response.setMessage("Password reset otp sent successfully");
//        return new ResponseEntity<>(response,HttpStatus.OK);
//    }
//    @PatchMapping("/auth/users/reset-password/verify-otp")
//    public ResponseEntity<ApiResponse> resetPassword
//            (@RequestParam String id,
//             @RequestBody ResetPasswordRequest request,
//             @PathVariable String otp) throws Exception {
//
//
//        ForgotPasswordToken forgotPasswordToken=forgotPasswordService.findById(id);
//
//        boolean isVerified=forgotPasswordToken.getOtp().equals(request.getOtp());
//
//        if (isVerified){
//            userService.updatePassword(forgotPasswordToken.getUser(),request.getPassword());
//            ApiResponse res=new ApiResponse();
//            res.setMessage("Password Updated Successfully");
//            return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
//        }
//        throw new Exception("Wrong Otp");
//    }
//}



package com.chirag.trading.controller;

import com.chirag.trading.Model.User;
import com.chirag.trading.Model.VerificationCode;
import com.chirag.trading.domain.VerificationType;
import com.chirag.trading.response.ApiResponse;
import com.chirag.trading.response.AuthResponse;
import com.chirag.trading.service.EmailService;
import com.chirag.trading.service.UserService;
import com.chirag.trading.service.VerificationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private VerificationCodeService verificationCodeService;

    @GetMapping("/users/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // Send OTP for enabling 2FA
    @PostMapping("/users/verification/EMAIL/send-otp")
    public ResponseEntity<ApiResponse> sendVerificationOtp(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);

        // Create verification code
        VerificationCode verificationCode = verificationCodeService.sendVerificationCode(
                user,
                VerificationType.EMAIL
        );

        // Send OTP via email
        emailService.sendVerificationOtpEmail(user.getEmail(), verificationCode.getOtp());

        ApiResponse response = new ApiResponse();
        response.setMessage("Verification OTP sent successfully to " + user.getEmail());
        response.setStatus(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Enable 2FA after OTP verification
    @PatchMapping("/users/enable-two-factor/verify-otp/{otp}")
    public ResponseEntity<User> enableTwoFactorAuthentication(
            @RequestHeader("Authorization") String jwt,
            @PathVariable String otp) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);

        VerificationCode verificationCode = verificationCodeService.getVerificationCodeByUser(user.getId());

        if (verificationCode == null) {
            throw new Exception("No verification code found. Please request OTP first.");
        }

        // Verify OTP
        boolean isVerified = verificationCode.getOtp().equals(otp);

        if (isVerified) {
            // Enable 2FA
            User updatedUser = userService.enableTwoFactorAuthentication(
                    VerificationType.EMAIL,
                    user.getEmail(),
                    user
            );

            // Delete used verification code
            verificationCodeService.deleteVerificationCodeById(verificationCode);

            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        }

        throw new Exception("Wrong OTP");
    }

    // Disable 2FA
//    @PatchMapping("/users/disable-two-factor")
//    public ResponseEntity<User> disableTwoFactorAuthentication(
//            @RequestHeader("Authorization") String jwt) throws Exception {
//
//        User user = userService.findUserProfileByJwt(jwt);
//        user.getTwoFactorAuth().setEnabled(false);
//        User updatedUser = userService.updateUser(user);
//
//        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
//    }

    // Get 2FA status
    @GetMapping("/users/two-factor-status")
    public ResponseEntity<Boolean> getTwoFactorStatus(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        boolean isEnabled = user.getTwoFactorAuth().isEnabled();

        return new ResponseEntity<>(isEnabled, HttpStatus.OK);
    }
}