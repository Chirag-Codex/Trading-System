package com.chirag.trading.controller;
import com.chirag.trading.Model.TwoFactorOtp;
import com.chirag.trading.Model.User;
import com.chirag.trading.Repository.UserRepository;
import com.chirag.trading.config.JwtProvider;
import com.chirag.trading.response.AuthResponse;
import com.chirag.trading.service.CustomUserDetailsService;
import com.chirag.trading.service.EmailService;
import com.chirag.trading.service.TwoFactorOtpService;
import com.chirag.trading.service.WatchlistService;
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
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@RequestBody  User user) throws Exception {
        User isEmailExist=userRepository.findByEmail(user.getEmail());

        if (isEmailExist!=null){
            throw new Exception("Email already exists");
        }
        User newUser = new User();
        newUser.setFullName(user.getFullName());
        newUser.setPassword(user.getPassword());
        newUser.setEmail(user.getEmail());
        User savedUser=userRepository.save(newUser);
        watchlistService.createWatchList(savedUser);
        Authentication auth=new UsernamePasswordAuthenticationToken(
               user.getEmail(),
                user.getPassword()
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt= JwtProvider.generateToken(auth);

        AuthResponse res=new AuthResponse();
        res.setJwt(jwt);
        res.setStatus(true);
        res.setMessage("Register Success");

        return new ResponseEntity<>(res, HttpStatus.CREATED);

    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> login(@RequestBody  User user) throws Exception {
        String username=user.getEmail();
        String password=user.getPassword();

        Authentication auth=authenticate(username,password);
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt= JwtProvider.generateToken(auth);

        User authUser=userRepository.findByEmail(username);

        if (user.getTwoFactorAuth().isEnabled()){
            AuthResponse res=new AuthResponse();
            res.setMessage("Two factor Authentication Enabled");
            res.setTwoFactorAuthEnabled(true);
            String otp= OtpUtils.generateOtp();

            TwoFactorOtp oldTwoFactorOtp=twoFactorOtpService.findByUser(authUser.getId());
            if (oldTwoFactorOtp!=null){
                twoFactorOtpService.deleteTwoFactorOtp(oldTwoFactorOtp);
            }
            TwoFactorOtp newTwoFactorOtp=twoFactorOtpService.createTwoFactorOtp(
                    authUser,otp,jwt
            );emailService.sendVerificationOtpEmail(username,otp);
            res.setSession(newTwoFactorOtp.getId());
            return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
        }

        AuthResponse res=new AuthResponse();
        res.setJwt(jwt);
        res.setStatus(true);
        res.setMessage("LOGIN Success");

        return new ResponseEntity<>(res, HttpStatus.OK);

    }

    private Authentication authenticate(String username,String password){
        UserDetails userDetails=customUserDetailsService.loadUserByUsername(username);
        if (userDetails==null){
            throw new BadCredentialsException("invalid username and password");
        }
        if (!password.equals(userDetails.getPassword())){
            throw new BadCredentialsException("invalid username and password");
        }
        return new UsernamePasswordAuthenticationToken(userDetails,password,userDetails.getAuthorities());
    }
    @PostMapping("/two-factor/otp/{otp}")
    public ResponseEntity<AuthResponse> verifySigninOtp(
            @PathVariable String otp,
            @RequestParam String id) throws Exception {
        TwoFactorOtp twoFactorOtp=twoFactorOtpService.findById(id);

        if (twoFactorOtpService.verifyTwoFactorOtp(twoFactorOtp,otp)){
            AuthResponse res=new AuthResponse();
            res.setMessage("Two factor authentication verified");
            res.setTwoFactorAuthEnabled(true);
            res.setJwt(twoFactorOtp.getJwt());
            return new  ResponseEntity<>(res,HttpStatus.OK);
        }
        throw new Exception("Invalid Otp");
    }

}
