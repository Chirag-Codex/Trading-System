package com.chirag.trading.service;

import com.chirag.trading.Model.PaymentDetails;
import com.chirag.trading.Model.User;

public interface PaymentDetailsService {
    public PaymentDetails addPaymentDetails(String accountNumber, String accountHolderName,
                                            String ifsc, String bankName, User user);

    public PaymentDetails getUsersPaymentDetails(User user);


}
