//package com.chirag.trading.service;
//
//import jakarta.mail.MessagingException;
//import jakarta.mail.internet.MimeMessage;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.MailException;
//import org.springframework.mail.MailSendException;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.stereotype.Service;
//
//@Service
//public class EmailService {
//    @Autowired
//    private JavaMailSender javaMailSender;
//
//    public void sendVerificationOtpEmail(String email,String otp) throws MessagingException {
//        MimeMessage mimeMessage=javaMailSender.createMimeMessage();
//        MimeMessageHelper mimeMessageHelper=new MimeMessageHelper(mimeMessage,"utf-8");
//
//        String subject="Verify Otp";
//        String text="Your verification code is -"+otp;
//        mimeMessageHelper.setSubject(subject);
//        mimeMessageHelper.setText(text);
//        mimeMessageHelper.setTo(email);
//        try {
//            javaMailSender.send(mimeMessage);
//        }
//        catch (MailException e){
//            throw new MailSendException(e.getMessage());
//        }
//    }
//}




package com.chirag.trading.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;


    public void sendVerificationOtpEmail(String email, String otp) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");

        String subject = "Verify OTP - Trading Platform";
        String text = "Your verification code is: " + otp +
                "\n\nThis OTP will expire in 5 minutes.\n\n" +
                "Best regards,\nTrading Platform Team";

        mimeMessageHelper.setSubject(subject);
        mimeMessageHelper.setText(text);
        mimeMessageHelper.setTo(email);

        try {
            javaMailSender.send(mimeMessage);
        } catch (MailException e) {
            throw new MailSendException(e.getMessage());
        }
    }


    public void sendForgotPasswordOtp(String email, String otp) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");

        String subject = "Password Reset OTP - Trading Platform";
        String text = "You requested to reset your password.\n\n" +
                "Your OTP for password reset is: " + otp + "\n\n" +
                "This OTP will expire in 15 minutes.\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Best regards,\nTrading Platform Team";

        mimeMessageHelper.setSubject(subject);
        mimeMessageHelper.setText(text);
        mimeMessageHelper.setTo(email);

        try {
            javaMailSender.send(mimeMessage);
        } catch (MailException e) {
            throw new MailSendException(e.getMessage());
        }
    }


    public void sendPasswordResetConfirmation(String email) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");

        String subject = "Password Reset Successful - Trading Platform";
        String text = "Your password has been successfully reset.\n\n" +
                "If you did not perform this action, please contact support immediately.\n\n" +
                "Best regards,\nTrading Platform Team";

        mimeMessageHelper.setSubject(subject);
        mimeMessageHelper.setText(text);
        mimeMessageHelper.setTo(email);

        try {
            javaMailSender.send(mimeMessage);
        } catch (MailException e) {
            throw new MailSendException(e.getMessage());
        }
    }
}