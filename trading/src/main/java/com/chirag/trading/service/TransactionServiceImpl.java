package com.chirag.trading.service;

import com.chirag.trading.Model.Wallet;
import com.chirag.trading.Model.WalletTransaction;
import com.chirag.trading.domain.WalletTransactionType;
import com.chirag.trading.Repository.WalletTransactionRepository;
import com.chirag.trading.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @Override
    public List<WalletTransaction> getTransactionsByWallet(Wallet wallet) {
        return walletTransactionRepository.findByWallet(wallet);
    }

    @Override
    @Transactional
    public WalletTransaction createTransaction(Wallet wallet,
                                               WalletTransactionType type,
                                               String transferId,
                                               String purpose,
                                               Long amount) {

        // Create new transaction
        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setType(type);
        transaction.setTransferId(transferId);
        transaction.setPurpose(purpose);
        transaction.setAmount(amount);
        transaction.setDate(LocalDate.now());


        validateTransaction(transaction);

        return walletTransactionRepository.save(transaction);
    }

    private void validateTransaction(WalletTransaction transaction) {
        if (transaction.getAmount() <= 0) {
            throw new IllegalArgumentException("Transaction amount must be positive");
        }

        if (transaction.getType() == null) {
            throw new IllegalArgumentException("Transaction type is required");
        }

        if (transaction.getWallet() == null) {
            throw new IllegalArgumentException("Wallet is required for transaction");
        }
    }
}