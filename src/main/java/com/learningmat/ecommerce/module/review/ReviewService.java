package com.learningmat.ecommerce.module.review;

import com.learningmat.ecommerce.dto.request.ReviewRequest;
import com.learningmat.ecommerce.dto.response.ReviewResponse;
import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import com.learningmat.ecommerce.mapper.ReviewMapper;
import com.learningmat.ecommerce.module.product.Product;
import com.learningmat.ecommerce.module.product.ProductRepository;
import com.learningmat.ecommerce.module.product.ProductService;
import com.learningmat.ecommerce.module.user.User;
import com.learningmat.ecommerce.module.user.UserService;
import com.learningmat.ecommerce.utilsRecord.ReviewStats;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserService userService;
    private final ReviewMapper reviewMapper;
    private final ProductRepository productRepository;

    @Transactional
    public ReviewResponse createReview(Long productId, String username, ReviewRequest request) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> {
                    log.warn("Can't find product with id [{}], maybe the the product is not currently available",
                            productId);
                    return new AppException(ErrorCode.PRODUCT_NOT_FOUND);
                });
        // Who create a review?
        User user = userService.getMyProfile(username);

        Review review = reviewMapper.toReview(request);
        review.setUser(user);
        review.setProduct(product);
        review.setCreatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);
        log.info("User [{}] made a review for product [{}]", username, productId);
        return reviewMapper.toReviewResponse(savedReview);
    }

    public Page<ReviewResponse> getReviewsFromProduct(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        return reviewRepository.findByProductId(productId, pageable).map(reviewMapper::toReviewResponse);
    }

    public ReviewStats getReviewStats(Long productId) {
        Double avgRating = reviewRepository.getAverageRating(productId);
        int reviewCount = reviewRepository.countByProductId(productId);
        return new ReviewStats(avgRating, reviewCount);
    }
}
