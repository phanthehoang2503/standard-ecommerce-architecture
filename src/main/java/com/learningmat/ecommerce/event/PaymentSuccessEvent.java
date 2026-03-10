package com.learningmat.ecommerce.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class PaymentSuccessEvent extends ApplicationEvent {
    private final Long orderId;

    public PaymentSuccessEvent(Object source, Long orderId) {
        super(source);
        this.orderId = orderId;
    }
}
