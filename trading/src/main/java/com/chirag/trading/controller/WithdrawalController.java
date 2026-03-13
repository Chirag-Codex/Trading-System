package com.chirag.trading.controller;


import com.chirag.trading.Model.User;
import com.chirag.trading.Model.Wallet;
import com.chirag.trading.Model.WalletTransaction;
import com.chirag.trading.Model.Withdrawal;
import com.chirag.trading.domain.WalletTransactionType;
import com.chirag.trading.service.TransactionService;
import com.chirag.trading.service.UserService;
import com.chirag.trading.service.WalletService;
import com.chirag.trading.service.WithdrawalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.jta.JtaTransactionManager;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class WithdrawalController {

    @Autowired
    private WithdrawalService withdrawalService;

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserService userService;

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/withdrawal/request/{amount}")
    public ResponseEntity<?> withdrawalRequest(
            @PathVariable Long amount,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Wallet userWallet = walletService.getUserWallet(user);
        if (userWallet.getBalance().longValue() < amount) {
            return new ResponseEntity<>("Insufficient balance", HttpStatus.BAD_REQUEST);
        }

        Withdrawal withdrawal = withdrawalService.requestWithdrawal(amount, user);
        walletService.withdrawBalance(userWallet, withdrawal.getAmount());

        WalletTransaction walletTransaction = transactionService.createTransaction(
                userWallet,
                WalletTransactionType.WITHDRAWAL,
                null,
                "bank account withdrawal",
                withdrawal.getAmount()
        );

        return new ResponseEntity<>(withdrawal, HttpStatus.OK);
    }
    @GetMapping("/withdrawal")
    public ResponseEntity<List<Withdrawal>> getWithdrawalHistory(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        List<Withdrawal> withdrawals = withdrawalService.getUsersWithdrawalHistory(user);
        return new ResponseEntity<>(withdrawals, HttpStatus.OK);
    }

    @GetMapping("/admin/withdrawal")
    public ResponseEntity<List<Withdrawal>> getAllWithdrawalRequest(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        List<Withdrawal> withdrawals = withdrawalService.getAllWithdrawalRequest();
        return new ResponseEntity<>(withdrawals, HttpStatus.OK);
    }

    @PatchMapping("/admin/withdrawal/{id}/{accept}")
    public ResponseEntity<?> proceedWithdrawal(
            @PathVariable Long id,
            @PathVariable boolean accept,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        Withdrawal withdrawal = withdrawalService.proceedWithdrawal(id, accept);

        Wallet userWallet = walletService.getUserWallet(user);
        if (!accept) {
            walletService.addBalance(userWallet, withdrawal.getAmount());
        }

        return new ResponseEntity<>(withdrawal, HttpStatus.OK);
    }
}