package com.learningmat.ecommerce.module.product;

import com.learningmat.ecommerce.dto.response.ApiResponse;
import com.learningmat.ecommerce.dto.request.ProductRequest;
import com.learningmat.ecommerce.dto.response.ProductResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
@Tag(name = "Product Management", description = "API for product including get item list and management")
public class ProductController {
	private final ProductService productService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('STAFF')")
	@Operation(summary = "create a new product", description = "for create a new product, must be staff role or higher to use this")
	public ApiResponse<Product> createProduct(
			@RequestBody @Valid ProductRequest productRequest) {
		Product prod = productService.createProduct(productRequest);
		return ApiResponse.<Product>builder()
				.result(prod)
				.message("Created new product")
				.build();
	}

	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	@PreAuthorize("hasRole('USER')")
	@Operation(summary = "get a list of products")
	public ApiResponse<Page<ProductResponse>> getProduct(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
		return ApiResponse.<Page<ProductResponse>>builder()
				.result(productService.getProducts(page, size, sortBy, direction))
				.build();
	}

	@GetMapping("/{productId}")
	@PreAuthorize("hasRole('USER')")
	@Operation(summary = "Get product by its id")
	public ApiResponse<Product> getProductById(
			@PathVariable Long productId) {
		return ApiResponse.<Product>builder()
				.result(productService.getProductById(productId))
				.build();
	}

	@PutMapping("/{productId}")
	@PreAuthorize("hasRole('STAFF')")
	@Operation(method = "???", summary = "update product information", description = "for update product and must have higher role to use this")
	public ApiResponse<Product> updateProduct(
			@PathVariable Long productId,
			@RequestBody @Valid ProductRequest productRequest) {
		return ApiResponse.<Product>builder()
				.result(productService.updateProduct(productId, productRequest))
				.message("Updated successful")
				.build();
	}

	@DeleteMapping("/{productId}")
	@PreAuthorize("hasRole('STAFF')")
	@Operation(summary = "delete a product")
	public ApiResponse<String> deleteProduct(
			@PathVariable Long productId) {
		productService.deleteProduct(productId);
		return ApiResponse.<String>builder()
				.message("Product delete successfully")
				.build();
	}
}
