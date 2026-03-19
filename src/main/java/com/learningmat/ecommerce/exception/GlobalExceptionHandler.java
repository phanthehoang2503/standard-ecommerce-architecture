package com.learningmat.ecommerce.exception;

import com.learningmat.ecommerce.dto.response.ApiResponse;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.security.access.AccessDeniedException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Occur when @valid inside product controller caught invalid data
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<Map<String, String>>> handlingValidation(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });

        ApiResponse<Map<String, String>> apiResponse = ApiResponse.<Map<String, String>>builder()
                .code(400).message("Invalid data").result(errors).build();
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<Void>> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ApiResponse<Void>> handlingRuntimeException(RuntimeException exception) {
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode())
                .message(exception.getMessage())
                .build();

        return ResponseEntity.status(ErrorCode.UNCATEGORIZED_EXCEPTION.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse<Void>> handlingAccessDeniedException(AccessDeniedException exception) {
        return ResponseEntity.status(ErrorCode.FORBIDDEN_ACCESS.getStatusCode())
                .body(ApiResponse.<Void>builder()
                        .code(ErrorCode.FORBIDDEN_ACCESS.getCode())
                        .message("You don't have permission")
                        .build());
    }

    @ExceptionHandler(value = DataIntegrityViolationException.class)
    ResponseEntity<ApiResponse<Void>> handlingDataIntegrityViolationException(DataIntegrityViolationException exception) {
        // keyword check
        String message = exception.getMostSpecificCause().getMessage();

        ErrorCode error = ErrorCode.DATABASE_CONSTRAINT_VIOLATION;

        if (message.contains("Duplicate entry")) error = ErrorCode.USER_EXISTED;

        return ResponseEntity.status(error.getStatusCode())
                .body(ApiResponse.<Void>builder()
                        .code(error.getCode())
                        .message(error.getMessage())
                        .build());
    }
}
