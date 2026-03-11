package com.learningmat.ecommerce.module.payment;

import com.learningmat.ecommerce.event.PaymentSuccessEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    // Pub
    private final ApplicationEventPublisher publisher;

    @GetMapping("/create-url")
    public ResponseEntity<?> createPaymentUrl(@RequestParam long orderId, @RequestParam long amount) {
        String url = paymentService.createPaymentUrl(orderId, amount);
        return ResponseEntity.ok(url);
    }

    @GetMapping("/vnpay-callback")
    public ResponseEntity<?> paymentCallback(@RequestParam Map<String, String> params) {
        String status = params.get("vnp_ResponseCode");
        String orderIdStr = params.get("vnp_TxnRef");
        String amountStr = params.get("vnp_Amount");

        if(!paymentService.verifyIpnSignature(params)) {
            return ResponseEntity.badRequest().body("Warning: detect fake system signer key.");
        }

        if ("00".equals(status)) {
            Long orderId = Long.parseLong(orderIdStr);
            Long amount = Long.parseLong(amountStr)/ 100;
            // yell orderid's payment complete
            publisher.publishEvent(new PaymentSuccessEvent(this, orderId, amount));
            return ResponseEntity.ok("Transaction complete! for order id: " + orderId);
        } else {
            return ResponseEntity.badRequest().body("Transaction failed due to error or cancelled by user");
        }
    }
}
