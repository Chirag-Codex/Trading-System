package com.chirag.trading.service;

import com.chirag.trading.Model.Coin;
import com.chirag.trading.Model.Order;
import com.chirag.trading.Model.OrderItem;
import com.chirag.trading.Model.User;
import com.chirag.trading.domain.OrderType;

import java.util.List;

public interface OrderService {
    Order createOrder(User user, OrderItem orderItem, OrderType orderType);

    Order getOrderById(Long orderId) throws Exception;

    List<Order> getAllOrdersOfUser(Long userId ,OrderType orderType,String assetSymbol);

    Order processOrder(Coin coin,double quantity,OrderType orderType,User user) throws Exception;
}
