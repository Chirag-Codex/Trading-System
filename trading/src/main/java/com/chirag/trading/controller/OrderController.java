package com.chirag.trading.controller;


import com.chirag.trading.Model.Coin;
import com.chirag.trading.Model.Order;
import com.chirag.trading.Model.User;
import com.chirag.trading.Repository.CoinRepository;
import com.chirag.trading.domain.OrderType;
import com.chirag.trading.request.CreateOrderRequest;
import com.chirag.trading.service.CoinService;
import com.chirag.trading.service.OrderService;
import com.chirag.trading.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private CoinService coinService;

    @PostMapping("/pay")
    public ResponseEntity<Order> payOrderPayment(
            @RequestHeader("Authorization") String jwt,
            @RequestBody CreateOrderRequest req
            )throws Exception{
        User user=userService.findUserProfileByJwt(jwt);
        Coin coin=coinService.findById(req.getCoinId());


        Order order=orderService.processOrder(coin,req.getQuantity(),req.getOrderType(),user);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long orderId
    )throws Exception{
        User user=userService.findUserProfileByJwt(jwt);
        Order order=orderService.getOrderById(orderId);
        if (order.getUser().getId().equals(user.getId())){
            return ResponseEntity.ok(order);
        }
        else {
            throw new  Exception("Invalid User");
        }
    }
    @GetMapping()
    public ResponseEntity<List<Order>> getAllOrdersForUser(
            @RequestHeader("Authorization") String jwt,
            @RequestParam(required = false) OrderType orderType,
            @RequestParam(required = false) String assetSymbol
    ) throws Exception {

        Long userId = userService.findUserProfileByJwt(jwt).getId();
        List<Order> userOrders = orderService.getAllOrdersOfUser(userId, orderType, assetSymbol);

        return ResponseEntity.ok(userOrders);
    }

}
