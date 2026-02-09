package com.learningmat.ecommerce.mapper;

import com.learningmat.ecommerce.dto.request.ProductRequest;
import com.learningmat.ecommerce.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "id", ignore = true)
    Product toProduct(ProductRequest request);

    @Mapping(target = "id", ignore = true)
    void updateProduct(@MappingTarget Product product, ProductRequest productRequest);
}
