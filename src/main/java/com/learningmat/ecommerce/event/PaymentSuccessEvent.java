package com.learningmat.ecommerce.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class PaymentSuccessEvent extends ApplicationEvent {
    private final Long orderId;
    private final Long amount;

    public PaymentSuccessEvent(Object source, Long orderId, Long amount) {
        super(source);
        this.orderId = orderId;
        this.amount = amount;
    }
}
