package com.chirag.trading.service;

import com.chirag.trading.Model.User;
import com.chirag.trading.Model.Withdrawal;
import com.chirag.trading.Repository.WithdrawalRepository;
import com.chirag.trading.domain.WithdrawalStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class WithdrawalServiceImpl implements WithdrawalService{
    @Autowired
    private WithdrawalRepository withdrawalRepository;
    @Override
    public Withdrawal requestWithdrawal(Long amount, User user) {
        Withdrawal withdrawal=new Withdrawal();
        withdrawal.setAmount(amount);
        withdrawal.setUser(user);
        withdrawal.setStatus(WithdrawalStatus.PENDING);
        return withdrawalRepository.save(withdrawal);
    }

    @Override
    public Withdrawal proceedWithdrawal(Long withdrawalId, boolean accept) throws Exception {
        Optional<Withdrawal> withdrawal=withdrawalRepository.findById(withdrawalId);
        if (withdrawal.isEmpty()){
            throw new Exception("Withdrawal Not Found");
        }
        Withdrawal withdrawal1=withdrawal.get();
        withdrawal1.setDate(LocalDateTime.now());

        if (accept){
            withdrawal1.setStatus(WithdrawalStatus.PENDING);
        }
        else {
            withdrawal1.setStatus(WithdrawalStatus.DECLINE);
        }
        return withdrawalRepository.save(withdrawal1);
    }

    @Override
    public List<Withdrawal> getUsersWithdrawalHistory(User user) {
        return withdrawalRepository.findByUserId(user.getId());
    }

    @Override
    public List<Withdrawal> getAllWithdrawalRequest() {
        return withdrawalRepository.findAll();
    }
}
