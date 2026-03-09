package com.learningmat.ecommerce.mapper;

import com.learningmat.ecommerce.dto.request.CategoryRequest;
import com.learningmat.ecommerce.module.category.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(target = "id", ignore = true)
    Category toCategory(CategoryRequest request);

    @Mapping(target = "id", ignore = true)
    void updateCategory(@MappingTarget Category category, CategoryRequest categoryRequest);
}