package com.chirag.trading.controller;

import com.chirag.trading.Model.User;
import com.chirag.trading.Model.Wallet;
import com.chirag.trading.Model.WalletTransaction;
import com.chirag.trading.domain.WalletTransactionType;
import com.chirag.trading.service.UserService;
import com.chirag.trading.service.WalletService;
import com.chirag.trading.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TransactionController {

    @Autowired
    private UserService userService;

    @Autowired
    private WalletService walletService;

    @Autowired
    private TransactionService transactionService;

//    @GetMapping("/transactions")
//    public ResponseEntity<List<WalletTransaction>> getUserWalletTransactions(
//            @RequestHeader("Authorization") String jwt
//    ) throws Exception {
//        User user = userService.findUserProfileByJwt(jwt);
//        Wallet wallet = walletService.getUserWallet(user);
//        List<WalletTransaction> transactionList = transactionService.getTransactionsByWallet(wallet);
//        return new ResponseEntity<>(transactionList, HttpStatus.OK);
//    }

    @GetMapping("/transactions")
    public ResponseEntity<List<WalletTransaction>> getUserWallet(
            @RequestHeader("Authorization") String jwt) throws Exception {

        System.out.println("Received JWT: " + jwt);

        // Find user by JWT token
        User user = userService.findUserProfileByJwt(jwt);
        System.out.println("Found user: " + user.getId() + " - " + user.getEmail());

        // Get user's wallet
        Wallet wallet = walletService.getUserWallet(user);
        System.out.println("Found wallet ID: " + wallet.getId() + ", Balance: " + wallet.getBalance());

        // Get transactions for the wallet
        List<WalletTransaction> transactionList = transactionService
                .getTransactionsByWallet(wallet);

        System.out.println("Number of transactions found: " + transactionList.size());

        return new ResponseEntity<>(transactionList, HttpStatus.OK);
    }
}