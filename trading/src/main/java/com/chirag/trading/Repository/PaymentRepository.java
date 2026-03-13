package com.chirag.trading.Repository;

import com.chirag.trading.Model.PaymentDetails;
import com.chirag.trading.Model.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentOrder,Long> {

}
