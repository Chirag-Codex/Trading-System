//package com.chirag.trading.Model;
//
//import com.chirag.trading.domain.VerificationType;
//import lombok.Data;
//
//@Data
//public class TwoFactorAuth {
//    private boolean isEnabled=false;
//    private VerificationType sendTo;
//}


package com.chirag.trading.Model;

import com.chirag.trading.domain.VerificationType;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class TwoFactorAuth {
    private boolean isEnabled = false;
    private VerificationType sendTo = VerificationType.EMAIL; // Default to EMAIL

    public boolean isEnabled() {
        return isEnabled;
    }

    public void setEnabled(boolean enabled) {
        isEnabled = enabled;
    }
}