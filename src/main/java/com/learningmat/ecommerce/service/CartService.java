package com.learningmat.ecommerce.service;

import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import com.learningmat.ecommerce.model.Cart;
import com.learningmat.ecommerce.model.CartItem;
import com.learningmat.ecommerce.model.Product;
import com.learningmat.ecommerce.model.User;
import com.learningmat.ecommerce.repository.CartRepository;
import com.learningmat.ecommerce.repository.ProductRepository;
import com.learningmat.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Cart getCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        return cartRepository.findUserById(user.getId())
                .orElseGet(() ->{
                    Cart cart = Cart.builder()
                            .user(user)
                            .items(new ArrayList<>()).build();
                    return cartRepository.save(cart);
                });
    }

    public Cart addToCart(String username, int productId, int quantity) {
        Cart cart = getCart(username);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // check if the item is already in the cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId() == productId)
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem newItem = CartItem.builder()
            .cart(cart).product(product).quantity(quantity)
            .build();
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }
}
