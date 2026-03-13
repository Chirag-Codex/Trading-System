package com.chirag.trading.Repository;

import com.chirag.trading.Model.Wallet;
import com.chirag.trading.Model.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

    List<WalletTransaction> findByWallet(Wallet wallet);
}