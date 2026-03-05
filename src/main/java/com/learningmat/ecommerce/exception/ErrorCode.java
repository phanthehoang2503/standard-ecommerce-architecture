package com.learningmat.ecommerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "not defined error yet", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Wrong message key", HttpStatus.NOT_FOUND),

    INVALID_NAME(1002, "Product's name should contain at least 3 character", HttpStatus.BAD_REQUEST),
    INVALID_PRICE(1004, "Price shouldn't be negative", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1005, "Password should contain 6 character", HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_FOUND(1006, "Product not found", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND(1013, "Category not available in system", HttpStatus.NOT_FOUND),

    USER_EXISTED(1007, "Username already exist...", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(1009, "Fail to login", HttpStatus.UNAUTHORIZED),
    OUT_OF_STOCK(1011, "Out of stock", HttpStatus.BAD_REQUEST),
    USER_NOTFOUND(1008, "User not found", HttpStatus.NOT_FOUND),
    FORBIDDEN_ACCESS(1012, "Access denied", HttpStatus.FORBIDDEN),
    USER_CART_NOTFOUND(1010, "Users cart not found", HttpStatus.NOT_FOUND)
    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
