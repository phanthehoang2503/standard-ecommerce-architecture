package com.learningmat.ecommerce.mapper;

import com.learningmat.ecommerce.dto.request.CategoryRequest;
import com.learningmat.ecommerce.module.category.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toCategory(CategoryRequest request);

    void updateCategory(@MappingTarget Category category, CategoryRequest categoryRequest);
}