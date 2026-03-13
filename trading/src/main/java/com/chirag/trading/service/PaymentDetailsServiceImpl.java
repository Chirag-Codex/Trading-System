package com.chirag.trading.service;

import com.chirag.trading.Model.PaymentDetails;
import com.chirag.trading.Model.User;
import com.chirag.trading.Repository.PaymentDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentDetailsServiceImpl implements PaymentDetailsService{
    @Autowired
    private PaymentDetailsRepository paymentDetailsRepository;
    @Override
    public PaymentDetails addPaymentDetails(String accountNumber, String accountHolderName,
                                            String ifsc, String bankName, User user) {
        PaymentDetails paymentDetails=new PaymentDetails();
        paymentDetails.setAccountNumber(accountNumber);
        paymentDetails.setAccountHolderName(accountHolderName);
        paymentDetails.setIfsc(ifsc);
        paymentDetails.setBankName(bankName);
        paymentDetails.setUser(user);
        return paymentDetailsRepository.save(paymentDetails);
    }

    @Override
    public PaymentDetails getUsersPaymentDetails(User user) {
        return paymentDetailsRepository.findByUserId(user.getId());
    }
}
