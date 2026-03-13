package com.chirag.trading.controller;

import com.chirag.trading.Model.PaymentDetails;
import com.chirag.trading.Model.User;
import com.chirag.trading.service.PaymentDetailsService;
import com.chirag.trading.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PaymentDetailsController {
    @Autowired
    private UserService userService;

    @Autowired
    private PaymentDetailsService paymentDetailsService;

    @PostMapping("/payment-details")
    public ResponseEntity<PaymentDetails>addPaymentDetails(@RequestBody PaymentDetails paymentDetailsRequest,
    @RequestHeader("Authorization") String jwt)throws Exception{
        User user=userService.findUserProfileByJwt(jwt);
        PaymentDetails paymentDetails=paymentDetailsService.addPaymentDetails(
                paymentDetailsRequest.getAccountNumber(),
                paymentDetailsRequest.getAccountHolderName(),
                paymentDetailsRequest.getIfsc(),
                paymentDetailsRequest.getBankName(),
                user
        );
        return new ResponseEntity<>(paymentDetails, HttpStatus.CREATED);
    }
    @GetMapping("/payment-details")
    public ResponseEntity<PaymentDetails>getUsersPaymentDetails(
            @RequestHeader("Authorization") String jwt
    )throws Exception{
        User user=userService.findUserProfileByJwt(jwt);
        PaymentDetails paymentDetails=paymentDetailsService.getUsersPaymentDetails(user);
        return new ResponseEntity<>(paymentDetails,HttpStatus.OK);
    }
}
