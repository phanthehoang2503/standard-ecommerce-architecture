package com.learningmat.ecommerce.module.cart;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.learningmat.ecommerce.dto.request.CartRequest;
import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import com.learningmat.ecommerce.module.product.Product;
import com.learningmat.ecommerce.module.product.ProductRepository;
import com.learningmat.ecommerce.module.user.User;
import com.learningmat.ecommerce.module.user.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Cart getCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart cart = Cart.builder()
                            .user(user)
                            .items(new ArrayList<>()).build();
                    return cartRepository.save(cart);
                });
    }

    public Cart addToCart(String username, CartRequest request) {
        Cart cart = getCart(username);
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> {
                    log.warn("Add product to cart failed because the product ID {} is invalid", request.productId());
                    return new AppException(ErrorCode.PRODUCT_NOT_FOUND);
                });

        log.info("User [{}] add product with ID: {} to cart (amount: {})",
                username, request.productId(), request.quantity());

        // check if the item is already in the cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.productId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.quantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart).product(product).quantity(request.quantity())
                    .build();
            cart.getItems().add(newItem);
        }
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(String username, Long productId) {
        Cart cart = getCart(username);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        return cartRepository.save(cart);
    }

    public void clearCart(String username) {
        Cart cart = getCart(username);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
