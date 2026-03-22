package com.learningmat.ecommerce.module.review;

import com.learningmat.ecommerce.dto.request.ReviewRequest;
import com.learningmat.ecommerce.dto.response.ApiResponse;
import com.learningmat.ecommerce.dto.response.ReviewResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products/{productId}/reviews")
@Tag(name = "Review management")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    @Operation(summary = "for create new review")
    public ApiResponse<ReviewResponse> createReview(
            @PathVariable Long productId,
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody @Valid ReviewRequest request
            ) {

        String username = jwt.getSubject();
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.createReview(productId, username, request))
                .build();
    }

    @GetMapping
    @Operation(summary = "get review of the product")
    public ApiResponse<Page<ReviewResponse>> getReview(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return ApiResponse.<Page<ReviewResponse>>builder()
                .result(reviewService.getReviewsFromProduct(productId,page,size))
                .build();
    }
}
