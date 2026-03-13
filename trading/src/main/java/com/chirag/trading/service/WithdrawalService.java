package com.chirag.trading.service;

import com.chirag.trading.Model.User;
import com.chirag.trading.Model.Withdrawal;

import java.util.List;

public interface WithdrawalService {
    Withdrawal requestWithdrawal(Long amount, User user);

    Withdrawal proceedWithdrawal(Long withdrawalId,boolean accept) throws Exception;

    List<Withdrawal> getUsersWithdrawalHistory(User user);

    List<Withdrawal>getAllWithdrawalRequest();
}
