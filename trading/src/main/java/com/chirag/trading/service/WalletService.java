package com.chirag.trading.service;

import com.chirag.trading.Model.Order;
import com.chirag.trading.Model.User;
import com.chirag.trading.Model.Wallet;

public interface WalletService {
    Wallet getUserWallet (User user);

    Wallet addBalance (Wallet wallet, Long money);

    Wallet findWalletById (Long id) throws Exception;

    Wallet walletToWalletTransfer (User sender, Wallet receiverWallet, Long amount) throws Exception;

    Wallet payOrderPayment (Order order,User user) throws Exception;

    Wallet withdrawBalance(Wallet wallet, Long amount) throws Exception;

}
