package com.learningmat.ecommerce.mapper;

import com.learningmat.ecommerce.dto.request.ReviewRequest;
import com.learningmat.ecommerce.dto.response.ReviewResponse;
import com.learningmat.ecommerce.module.review.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Review toReview(ReviewRequest request);

    @Mapping(target = "username", source = "user.username")
    ReviewResponse toReviewResponse(Review review);
}
