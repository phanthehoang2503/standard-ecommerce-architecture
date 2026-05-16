package com.learningmat.ecommerce.unit_test;

import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import com.learningmat.ecommerce.module.cart.Cart;
import com.learningmat.ecommerce.module.cart.CartItem;
import com.learningmat.ecommerce.module.cart.CartRepository;
import com.learningmat.ecommerce.module.cart.CartService;
import com.learningmat.ecommerce.module.inventory.InventoryService;
import com.learningmat.ecommerce.module.order.Order;
import com.learningmat.ecommerce.module.order.OrderRepository;
import com.learningmat.ecommerce.module.order.OrderService;
import com.learningmat.ecommerce.module.product.Product;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CartRepository cartRepository;
    @Mock
    private CartService cartService;
    @Mock
    private InventoryService inventoryService;

    @InjectMocks
    private OrderService orderService;

    @Test
    void placeOrder_success() {
        //arrange
        String username = "user1";
        User user = User.builder().id("user-id").username(username).build();
        Product product = Product.builder().id(101L).name("Laptop").price(1000).build();
        CartItem cartItem = CartItem.builder().product(product).quantity(2).build();
        List<CartItem> cartItems = new ArrayList<>();
        cartItems.add(cartItem);
        Cart cart = Cart.builder().user(user).items(cartItems).build();

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(user.getId())).thenReturn(Optional.of(cart));
        when(orderRepository.findLastestPendingOrder(anyString(), any())).thenReturn(new ArrayList<>());
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setId(1L);
            return o;
        });

        //act
        Order result = orderService.placeOrder(username);

        //assert
        Assertions.assertNotNull(result);
        Assertions.assertEquals("PENDING", result.getStatus());
        Assertions.assertEquals(2000L, result.getTotalAmount());
        verify(inventoryService).reduceStock(anyLong(), anyInt());
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void placeOrder_cartNotFound_throwsException() {
        //arrange
        String username = "user1";
        User user = User.builder().id("user-id").username(username).build();
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(user.getId())).thenReturn(Optional.empty());

        //act & assert
        AppException exception = Assertions.assertThrows(AppException.class, () -> orderService.placeOrder(username));
        Assertions.assertEquals(ErrorCode.USER_CART_NOTFOUND, exception.getErrorCode());
    }

    @Test
    void getOrderDetails_forbidden_throwsException() {
        //arrange
        String username = "attacker";
        Long orderId = 1L;
        User owner = User.builder().username("owner").build();
        Order order = Order.builder().id(orderId).user(owner).build();
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        //act & assert
        AppException exception = Assertions.assertThrows(AppException.class, () -> orderService.getOrderDetails(username, orderId));
        Assertions.assertEquals(ErrorCode.FORBIDDEN_ACCESS, exception.getErrorCode());
    }
}
