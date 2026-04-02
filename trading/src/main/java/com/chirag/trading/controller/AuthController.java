package com.chirag.trading.controller;

import com.chirag.trading.Model.ForgotPasswordToken;
import com.chirag.trading.Model.TwoFactorOtp;
import com.chirag.trading.Model.User;
import com.chirag.trading.Repository.UserRepository;
import com.chirag.trading.config.JwtProvider;
import com.chirag.trading.response.AuthResponse;
import com.chirag.trading.service.*;
import com.chirag.trading.domain.VerificationType;
import com.chirag.trading.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private TwoFactorOtpService twoFactorOtpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private WatchlistService watchlistService;

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @Autowired
    private VerificationCodeService verificationCodeService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) throws Exception {
        User isEmailExist = userRepository.findByEmail(user.getEmail());

        if (isEmailExist != null) {
            throw new Exception("Email already exists");
        }

        User newUser = new User();
        newUser.setFullName(user.getFullName());
        newUser.setPassword(user.getPassword());
        newUser.setEmail(user.getEmail());

        User savedUser = userRepository.save(newUser);
        watchlistService.createWatchList(savedUser);

        Authentication auth = new UsernamePasswordAuthenticationToken(
                user.getEmail(),
                user.getPassword()
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = JwtProvider.generateToken(auth);

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setStatus(true);
        res.setMessage("Register Success");
        res.setTwoFactorAuthEnabled(false);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> login(@RequestBody User user) throws Exception {
        String username = user.getEmail();
        String password = user.getPassword();

        Authentication auth = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = JwtProvider.generateToken(auth);

        User authUser = userRepository.findByEmail(username);


        if (authUser.getTwoFactorAuth() != null && authUser.getTwoFactorAuth().isEnabled()) {
            AuthResponse res = new AuthResponse();
            res.setMessage("Two factor Authentication Enabled");
            res.setTwoFactorAuthEnabled(true);
            String otp = OtpUtils.generateOtp();

            TwoFactorOtp oldTwoFactorOtp = twoFactorOtpService.findByUser(authUser.getId());
            if (oldTwoFactorOtp != null) {
                twoFactorOtpService.deleteTwoFactorOtp(oldTwoFactorOtp);
            }


            TwoFactorOtp newTwoFactorOtp = twoFactorOtpService.createTwoFactorOtp(
                    authUser, otp, jwt
            );

            emailService.sendVerificationOtpEmail(username, otp);

            res.setSession(newTwoFactorOtp.getId());
            return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
        }

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setStatus(true);
        res.setMessage("LOGIN Success");
        res.setTwoFactorAuthEnabled(false);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("/two-factor/otp/{otp}")
    public ResponseEntity<AuthResponse> verifySigninOtp(
            @PathVariable String otp,
            @RequestParam String id) throws Exception {

        TwoFactorOtp twoFactorOtp = twoFactorOtpService.findById(id);

        if (twoFactorOtp == null) {
            throw new Exception("Invalid session");
        }

        if (twoFactorOtpService.verifyTwoFactorOtp(twoFactorOtp, otp)) {
            AuthResponse res = new AuthResponse();
            res.setMessage("Two factor authentication verified");
            res.setTwoFactorAuthEnabled(true);
            res.setJwt(twoFactorOtp.getJwt());
            res.setStatus(true);

            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        throw new Exception("Invalid Otp");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@RequestBody Map<String, String> request) throws Exception {
        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            throw new Exception("Email is required");
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new Exception("User not found with this email");
        }

        String otp = OtpUtils.generateOtp();
        String tokenId = UUID.randomUUID().toString();

        ForgotPasswordToken existingToken = forgotPasswordService.findByUser(user.getId());
        if (existingToken != null) {
            forgotPasswordService.deleteToken(existingToken);
        }

        ForgotPasswordToken token = forgotPasswordService.createToken(
                user,
                tokenId,
                otp,
                VerificationType.EMAIL,
                email
        );


        emailService.sendForgotPasswordOtp(email, otp);


        AuthResponse response = new AuthResponse();
        response.setMessage("Password reset OTP sent to your email");
        response.setStatus(true);
        response.setSession(token.getId());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/verify-reset-otp")
    public ResponseEntity<AuthResponse> verifyResetOtp(@RequestBody Map<String, String> request) throws Exception {
        String sessionId = request.get("sessionId");
        String otp = request.get("otp");

        if (sessionId == null || otp == null) {
            throw new Exception("Session ID and OTP are required");
        }

        ForgotPasswordToken token = forgotPasswordService.findById(sessionId);
        if (token == null) {
            throw new Exception("Invalid or expired session");
        }

        if (!forgotPasswordService.validateToken(token)) {
            forgotPasswordService.deleteToken(token);
            throw new Exception("Session has expired. Please request a new OTP");
        }

        if (!token.getOtp().equals(otp)) {
            throw new Exception("Invalid OTP");
        }

        String resetToken = UUID.randomUUID().toString();


        User user = token.getUser();
        forgotPasswordService.deleteToken(token);


        ForgotPasswordToken resetTokenEntity = forgotPasswordService.createToken(
                user,
                resetToken,
                null,
                token.getVerificationType(),
                token.getSendTo()
        );

        AuthResponse response = new AuthResponse();
        response.setMessage("OTP verified successfully");
        response.setJwt(resetToken);
        response.setStatus(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody Map<String, String> request) throws Exception {
        String resetToken = request.get("resetToken");
        String newPassword = request.get("newPassword");

        if (resetToken == null || newPassword == null) {
            throw new Exception("Reset token and new password are required");
        }

        if (newPassword.length() < 6) {
            throw new Exception("Password must be at least 6 characters long");
        }

        ForgotPasswordToken token = forgotPasswordService.findById(resetToken);
        if (token == null) {
            throw new Exception("Invalid or expired reset token");
        }

        if (!forgotPasswordService.validateToken(token)) {
            forgotPasswordService.deleteToken(token);
            throw new Exception("Reset token has expired. Please request a new password reset");
        }

        User user = token.getUser();
        user.setPassword(newPassword);
        userRepository.save(user);


        forgotPasswordService.deleteToken(token);

        emailService.sendPasswordResetConfirmation(user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setMessage("Password reset successfully");
        response.setStatus(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
        if (userDetails == null) {
            throw new BadCredentialsException("invalid username and password");
        }
        if (!password.equals(userDetails.getPassword())) {
            throw new BadCredentialsException("invalid username and password");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
    }
}