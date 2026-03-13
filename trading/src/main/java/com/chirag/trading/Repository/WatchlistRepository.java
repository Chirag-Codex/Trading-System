package com.chirag.trading.Repository;

import com.chirag.trading.Model.User;
import com.chirag.trading.Model.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WatchlistRepository extends JpaRepository<Watchlist,Long> {
    Watchlist findByUserId(Long userId);
}
