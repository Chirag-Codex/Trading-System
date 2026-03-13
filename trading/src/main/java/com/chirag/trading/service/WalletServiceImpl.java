package com.chirag.trading.service;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chirag.trading.Model.Order;
import com.chirag.trading.Model.User;
import com.chirag.trading.Model.Wallet;
import com.chirag.trading.Repository.WalletRepository;
import com.chirag.trading.domain.OrderType;
import com.chirag.trading.domain.WalletTransactionType;

@Service
public class WalletServiceImpl implements WalletService{

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionService transactionService;  // Add this

    @Override
    public Wallet getUserWallet(User user) {
        Wallet wallet = walletRepository.findByUserId(user.getId());
        if (wallet == null) {
            wallet = new Wallet();
            wallet.setUser(user);
            wallet.setBalance(BigDecimal.ZERO);
            walletRepository.save(wallet);
        }
        return wallet;
    }

    @Override
    @Transactional
    public Wallet addBalance(Wallet wallet, Long money) {
        BigDecimal balance = wallet.getBalance();
        BigDecimal newBalance = balance.add(BigDecimal.valueOf(money));
        wallet.setBalance(newBalance);
        Wallet updatedWallet = walletRepository.save(wallet);
        transactionService.createTransaction(
                updatedWallet,
                WalletTransactionType.ADD_MONEY,
                null,
                "Money added to wallet",
                money
        );

        return updatedWallet;
    }

    @Override
    public Wallet findWalletById(Long id) throws Exception {
        Optional<Wallet> wallet = walletRepository.findById(id);
        if (wallet.isPresent()) {
            return wallet.get();
        }
        throw new Exception("Wallet Not Found");
    }

    @Override
    @Transactional
    public Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, Long amount) throws Exception {
        Wallet senderWallet = getUserWallet(sender);

        if (senderWallet.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new Exception("Insufficient Balance");
        }

        BigDecimal senderBalance = senderWallet.getBalance().subtract(BigDecimal.valueOf(amount));
        senderWallet.setBalance(senderBalance);
        walletRepository.save(senderWallet);

        transactionService.createTransaction(
                senderWallet,
                WalletTransactionType.WALLET_TRANSFER,
                "TRANSFER_TO_" + receiverWallet.getId(),
                "Transfer to wallet #" + receiverWallet.getId(),
                amount
        );

        BigDecimal receiverBalance = receiverWallet.getBalance().add(BigDecimal.valueOf(amount));
        receiverWallet.setBalance(receiverBalance);
        walletRepository.save(receiverWallet);

        transactionService.createTransaction(
                receiverWallet,
                WalletTransactionType.WITHDRAWAL,
                "TRANSFER_FROM_" + senderWallet.getId(),
                "Transfer from wallet #" + senderWallet.getId(),
                amount
        );

        return senderWallet;
    }

    @Override
    @Transactional
    public Wallet payOrderPayment(Order order, User user) throws Exception {
        Wallet wallet = getUserWallet(user);

        if (order.getOrderType().equals(OrderType.BUY)) {
            BigDecimal orderPrice = order.getPrice();
            BigDecimal newBalance = wallet.getBalance().subtract(orderPrice);
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                throw new Exception("Insufficient Funds for this transaction");
            }

            wallet.setBalance(newBalance);
            walletRepository.save(wallet);


            transactionService.createTransaction(
                    wallet,
                    WalletTransactionType.BUY_ASSET,
                    "ORDER_" + order.getId(),
                    "Buy order: " + order.getId(),
                    orderPrice.longValue()
            );
        }
        else { // SELL order
            BigDecimal newBalance = wallet.getBalance().add(order.getPrice());
            wallet.setBalance(newBalance);
            walletRepository.save(wallet);

            transactionService.createTransaction(
                    wallet,
                    WalletTransactionType.SELL_ASSET,
                    "ORDER_" + order.getId(),
                    "Sell order: " + order.getId(),
                    order.getPrice().longValue()
            );
        }

        return wallet;
    }
    @Override
    public Wallet withdrawBalance(Wallet wallet, Long amount) throws Exception {
        if (wallet.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new Exception("Insufficient balance");
        }

        BigDecimal balance = wallet.getBalance();
        BigDecimal newBalance = balance.subtract(BigDecimal.valueOf(amount));
        wallet.setBalance(newBalance);
        return walletRepository.save(wallet);
    }
}