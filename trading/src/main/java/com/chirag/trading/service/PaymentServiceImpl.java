package com.chirag.trading.service;

import com.chirag.trading.Model.PaymentDetails;
import com.chirag.trading.Model.PaymentOrder;
import com.chirag.trading.Model.User;
import com.chirag.trading.Repository.PaymentRepository;
import com.chirag.trading.domain.PaymentMethod;
import com.chirag.trading.domain.PaymentOrderStatus;
import com.chirag.trading.response.PaymentResponse;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService{

    @Autowired
    private PaymentRepository paymentRepository;

    private String stripeSecretKey;

    @Value("${razorpay.api.key}")
    private String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecretKey;
    @Override
    public PaymentOrder createOrder(User user, Long amount, PaymentMethod paymentMethod) {
        PaymentOrder paymentOrder = new PaymentOrder();
        paymentOrder.setUser(user);
        paymentOrder.setAmount(amount);
        paymentOrder.setPaymentMethod(paymentMethod);
        paymentOrder.setPaymentOrderStatus(PaymentOrderStatus.PENDING);

        return paymentRepository.save(paymentOrder);
    }

    @Override
    public PaymentOrder getPaymentOrderById(Long id) throws Exception {
        return paymentRepository.findById(id).orElseThrow(()->new Exception("Payment Order Not Found"));
    }

    @Override
    public Boolean proceedPaymentOrder(PaymentOrder paymentOrder, String paymentId) throws RazorpayException {
        if (paymentOrder.getPaymentOrderStatus()==null){
            paymentOrder.setPaymentOrderStatus(PaymentOrderStatus.PENDING);
        }
        if (paymentOrder.getPaymentOrderStatus().equals(PaymentOrderStatus.PENDING)){
            if (paymentOrder.getPaymentMethod().equals(PaymentMethod.RAZORPAY)){
                RazorpayClient razorpay=new RazorpayClient(apiKey,apiSecretKey);
                Payment payment=razorpay.payments.fetch(paymentId);

                Integer amount=payment.get("amount");
                String status=payment.get("status");

                if (status.equals("captured")){
                    paymentOrder.setPaymentOrderStatus(PaymentOrderStatus.SUCCESS);
                    return true;
                }
                paymentOrder.setPaymentOrderStatus(PaymentOrderStatus.FAILED);
                paymentRepository.save(paymentOrder);
                return false;
            }
        }
        return false;
    }

    @Override
    public PaymentResponse createRazorpayPaymentLink(User user, Long amount,Long orderId) {
        Long Amount=amount*100;
        try {
            RazorpayClient razorpay=new RazorpayClient(apiKey,apiSecretKey);
            JSONObject paymentLinkRequest=new JSONObject();
            paymentLinkRequest.put("amount",Amount);
            paymentLinkRequest.put("currency","INR");

            JSONObject customer=new JSONObject();
            customer.put("name",user.getFullName());

            customer.put("email",user.getEmail());
            paymentLinkRequest.put("customer",customer);

            JSONObject notify=new JSONObject();
            notify.put("email",true);
            paymentLinkRequest.put("notify",notify);

            paymentLinkRequest.put("reminder_enable",true);

            paymentLinkRequest.put("callback_url","http://localhost:5173/wallet?order_id="+orderId);
            paymentLinkRequest.put("callback_method","get");

            PaymentLink payment=razorpay.paymentLink.create(paymentLinkRequest);

            String paymentLinkId=payment.get("id");
            String paymentLinkUrl=payment.get("short_url");
            PaymentResponse res=new PaymentResponse();
            res.setPayment_url(paymentLinkUrl);

            return res;

        } catch (RazorpayException e) {
            System.out.println("Error creating payment link"+e.getMessage());
            throw new RuntimeException(e);
        }

    }

    @Override
    public PaymentResponse createStripePaymentLink(User user, Long amount, Long orderId) {
        return null;
    }
}
