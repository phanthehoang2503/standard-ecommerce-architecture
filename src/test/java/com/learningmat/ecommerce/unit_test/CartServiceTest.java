package com.learningmat.ecommerce.unit_test;

import com.learningmat.ecommerce.dto.request.CartRequest;
import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.module.cart.Cart;
import com.learningmat.ecommerce.module.cart.CartItem;
import com.learningmat.ecommerce.module.cart.CartRepository;
import com.learningmat.ecommerce.module.cart.CartService;
import com.learningmat.ecommerce.module.inventory.Inventory;
import com.learningmat.ecommerce.module.product.Product;
import com.learningmat.ecommerce.module.product.ProductRepository;
import com.learningmat.ecommerce.module.user.User;
import com.learningmat.ecommerce.module.user.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    @Test
    void getCart_success() {
        //arrange
        String username = "user1";
        User user = User.builder().id("user-id").username(username).build();
        Cart cart = Cart.builder().id(1L).user(user).items(new ArrayList<>()).build();

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(user.getId())).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        //act
        Cart result = cartService.getCart(username);

        //assert
        Assertions.assertNotNull(result);
        Assertions.assertEquals(username, result.getUser().getUsername());
        verify(cartRepository).save(any(Cart.class));
    }

    @Test
    void addToCart_newItem_success() {
        //arrange
        String username = "user1";
        Long productId = 101L;
        CartRequest request = new CartRequest(productId, 2);
        
        User user = User.builder().id("user-id").username(username).build();
        Cart cart = Cart.builder().id(1L).user(user).items(new ArrayList<>()).build();
        Inventory inventory = Inventory.builder().quantity(10).build();
        Product product = Product.builder().id(productId).isActive(true).inventory(inventory).build();

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(user.getId())).thenReturn(Optional.of(cart));
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(cartRepository.save(any(Cart.class))).thenAnswer(i -> i.getArguments()[0]);

        //act
        Cart result = cartService.addToCart(username, request);

        //assert
        Assertions.assertEquals(1, result.getItems().size());
        Assertions.assertEquals(2, result.getItems().get(0).getQuantity());
    }

    @Test
    void addToCart_outOfStock_throwsException() {
        //arrange
        String username = "user1";
        Long productId = 101L;
        CartRequest request = new CartRequest(productId, 20); // More than stock
        
        User user = User.builder().id("user-id").username(username).build();
        Cart cart = Cart.builder().id(1L).user(user).items(new ArrayList<>()).build();
        Inventory inventory = Inventory.builder().quantity(10).build();
        Product product = Product.builder().id(productId).isActive(true).inventory(inventory).build();

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(user.getId())).thenReturn(Optional.of(cart));
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        //act & assert
        Assertions.assertThrows(AppException.class, () -> cartService.addToCart(username, request));
    }

    @Test
    void removeFromCart_success() {
        //arrange
        String username = "user1";
        Long productId = 101L;
        User user = User.builder().id("user-id").username(username).build();
        Product product = Product.builder().id(productId).build();
        CartItem item = CartItem.builder().product(product).build();
        List<CartItem> items = new ArrayList<>();
        items.add(item);
        Cart cart = Cart.builder().user(user).items(items).build();

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(user.getId())).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        //act
        Cart result = cartService.removeFromCart(username, productId);

        //assert
        Assertions.assertTrue(result.getItems().isEmpty());
    }
}
