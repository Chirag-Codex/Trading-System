package com.chirag.trading.service;


import com.chirag.trading.Model.PaymentOrder;
import com.chirag.trading.Model.User;
import com.chirag.trading.domain.PaymentMethod;
import com.chirag.trading.response.PaymentResponse;
import com.razorpay.RazorpayException;

public interface PaymentService {

    PaymentOrder createOrder(User user, Long amount, PaymentMethod paymentMethod);

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    Boolean proceedPaymentOrder(PaymentOrder paymentOrder, String paymentId) throws RazorpayException;

    PaymentResponse createRazorpayPaymentLink(User user, Long amount,Long orderId);

    PaymentResponse createStripePaymentLink(User user, Long amount, Long orderId);
}