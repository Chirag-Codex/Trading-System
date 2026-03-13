package com.chirag.trading.service;

import com.chirag.trading.Model.*;
import com.chirag.trading.Repository.OrderItemRepository;
import com.chirag.trading.Repository.OrderRepository;
import com.chirag.trading.domain.OrderStatus;
import com.chirag.trading.domain.OrderType;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private WalletService walletService;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private AssetService assetService;

    @Override
    public Order createOrder(User user, OrderItem orderItem, OrderType orderType) {
        double price = orderItem.getCoin().getCurrentPrice()
                .multiply(BigDecimal.valueOf(orderItem.getQuantity()))
                .doubleValue();
        Order order = new Order();
        order.setUser(user);
        order.setOrderItem(orderItem);
        order.setOrderType(orderType);
        order.setPrice(BigDecimal.valueOf(price));
        order.setTimeStamp(LocalDateTime.now());
        order.setOrderStatus(OrderStatus.PENDING);


        return orderRepository.save(order);
    }

    @Override
    public Order getOrderById(Long orderId) throws Exception {

        return orderRepository.findById(orderId).orElseThrow(() -> new Exception("Order Not Found"));
    }

    @Override
    public List<Order> getAllOrdersOfUser(Long userId, OrderType orderType, String assetSymbol) {
        return orderRepository.findByUserId(userId);
    }

    private OrderItem craeteOrderItem(Coin coin, double quantity,
                                      double buyPrice, double setPrice) {
        OrderItem orderItem = new OrderItem();
        orderItem.setCoin(coin);
        orderItem.setQuantity(quantity);
        orderItem.setBuyPrice(buyPrice);
        orderItem.setSellPrice(setPrice);

        return orderItemRepository.save(orderItem);
    }

    @Transactional
    public Order buyAsset(Coin coin, double quantity, User user) throws Exception {
        if (quantity <= 0) {
            throw new Exception("Quantity should be greater than zero");
        }
        double buyPrice = coin.getCurrentPrice().doubleValue();

        OrderItem orderItem = craeteOrderItem(coin, quantity, buyPrice, 0);

        Order order = createOrder(user, orderItem, OrderType.BUY);
        orderItem.setOrder(order);
        walletService.payOrderPayment(order, user);

        order.setOrderStatus(OrderStatus.SUCCESS);
        order.setOrderType(OrderType.BUY);
        Order savedOrder = orderRepository.save(order);

        Asset oldAsset = assetService.findAssetByUserIdAndCoinId
                (order.getUser().getId(), order.getOrderItem().getCoin().getId());

        if (oldAsset == null) {
            assetService.createAsset(user, orderItem.getCoin(), orderItem.getQuantity());
        } else {
            assetService.updateAsset(oldAsset.getId(), quantity);
        }

        return savedOrder;
    }

    @Transactional
    public Order sellAsset(Coin coin, double quantity, User user) throws Exception {
        if (quantity <= 0) {
            throw new Exception("Quantity should be greater than zero");
        }
        double sellPrice = coin.getCurrentPrice().doubleValue();

        Asset assetToSell = assetService.findAssetByUserIdAndCoinId(user.getId(), coin.getId());
        double buyPrice = assetToSell.getBuyPrice();
        if (assetToSell != null) {


            OrderItem orderItem = craeteOrderItem(coin, quantity, buyPrice, sellPrice);

            Order order = createOrder(user, orderItem, OrderType.SELL);


            orderItem.setOrder(order);

            if (assetToSell.getQuantity() >= quantity) {
                walletService.payOrderPayment(order, user);
                order.setOrderStatus(OrderStatus.SUCCESS);
                order.setOrderType(OrderType.SELL);
                Order savedOrder = orderRepository.save(order);
                Asset updateAsset = assetService.updateAsset(assetToSell.getId(), -quantity);

                if (updateAsset.getQuantity() * coin.getCurrentPrice().doubleValue() <= 1) {
                    assetService.deleteAsset(updateAsset.getId());

                }
                return savedOrder;
            }
            throw new Exception("Insufficient Quantity to sell");
        }
        throw new Exception("Asset Not Found");

    }

    @Override
    public Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception {
        if (orderType.equals(OrderType.BUY)) {
            return buyAsset(coin, quantity, user);
        } else if (orderType.equals(OrderType.SELL)) {
            return sellAsset(coin, quantity, user);
        } else {
            throw new Exception("Invalid Order Type");
        }
    }
}
