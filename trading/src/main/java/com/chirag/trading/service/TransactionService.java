package com.chirag.trading.service;

import com.chirag.trading.Model.Wallet;
import com.chirag.trading.Model.WalletTransaction;
import com.chirag.trading.domain.WalletTransactionType;

import java.util.List;

public interface TransactionService {

     WalletTransaction createTransaction(Wallet wallet,
                                          WalletTransactionType type,
                                          String transferId,
                                          String purpose,
                                          Long amount);
    List<WalletTransaction> getTransactionsByWallet(Wallet wallet);
}