package com.learningmat.ecommerce.module.review;

import com.learningmat.ecommerce.dto.request.ReviewRequest;
import com.learningmat.ecommerce.dto.response.ReviewResponse;
import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import com.learningmat.ecommerce.mapper.ReviewMapper;
import com.learningmat.ecommerce.module.product.Product;
import com.learningmat.ecommerce.module.product.ProductRepository;
import com.learningmat.ecommerce.module.user.User;
import com.learningmat.ecommerce.module.user.UserService;
import com.learningmat.ecommerce.utilsRecord.ReviewStats;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceTest {
    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private ReviewMapper mapper;

    @Mock
    private UserService userService;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ReviewService reviewService;

    @Test
    void createReview_success() {
        //arrange
        Long productId = 1L;
        String username = "testuser";
        ReviewRequest request= ReviewRequest.builder()
                .rating(5)
                .comment("test comment")
                .build();

        Product mockProduct = Product.builder()
                .id(productId)
                .build();

        User mockUser = User.builder()
                .username(username)
                .build();

        Review mockReview = new Review();
        Review savedReview = new Review();
        ReviewResponse mockResponse = ReviewResponse.builder()
                .id(1L)
                .username(username)
                .rating(5)
                .comment("test comment")
                .build();

        // prod
        when(productRepository.findById(productId)).thenReturn(Optional.of(mockProduct));
        // user
        when(userService.getMyProfile(username)).thenReturn(mockUser);
        // request to entity
        when(mapper.toReview(request)).thenReturn(mockReview);
        // save to db
        when(reviewRepository.save(any(Review.class))).thenReturn(savedReview);
        // response from API
        when(mapper.toReviewResponse(savedReview)).thenReturn(mockResponse);

        //act
        ReviewResponse res = reviewService.createReview(productId, username, request);

        //assert
        Assertions.assertNotNull(res);
        Assertions.assertEquals(5, res.rating());

        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void createReview_productNotFound_throwsException() {
        //arrange
        Long productId = 1L;
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        //act and assert
        AppException exception = Assertions.assertThrows(AppException.class,
                () -> {reviewService
                        .createReview(productId,
                                "user",
                                new ReviewRequest(5,"")
                        );
        });

        Assertions.assertEquals(ErrorCode.PRODUCT_NOT_FOUND, exception.getErrorCode());

        // if not found, then do not call to db
        verify(reviewRepository, never()).save(any());
    }

    @Test
    void getReviewStats_success() {
        //arrange
        Long productId = 1L;
        when(reviewRepository.getAverageRating(productId)).thenReturn(4.5);
        when(reviewRepository.countByProductId(productId)).thenReturn(10);

        //act
        ReviewStats stats = reviewService.getReviewStats(productId);

        //assert
        Assertions.assertEquals(4.5, stats.avgRating());
        Assertions.assertEquals(10, stats.reviewCount());
    }
}
