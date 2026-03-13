package com.chirag.trading.Repository;

import com.chirag.trading.Model.Coin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoinRepository extends JpaRepository<Coin,String> {
}
