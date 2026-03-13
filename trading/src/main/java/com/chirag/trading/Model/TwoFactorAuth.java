package com.chirag.trading.Model;

import com.chirag.trading.domain.VerificationType;
import lombok.Data;

@Data
public class TwoFactorAuth {
    private boolean isEnabled=false;
    private VerificationType sendTo;
}
