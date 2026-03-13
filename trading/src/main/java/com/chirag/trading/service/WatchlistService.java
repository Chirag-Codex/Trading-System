package com.chirag.trading.service;

import com.chirag.trading.Model.Coin;
import com.chirag.trading.Model.User;
import com.chirag.trading.Model.Watchlist;

public interface WatchlistService {
    Watchlist findUserWatchlist(Long userId) throws Exception;

    Watchlist createWatchList(User user);

    Watchlist findById(Long id) throws Exception;

    Coin addItemToWatchList(Coin coin,User user) throws Exception;

}
