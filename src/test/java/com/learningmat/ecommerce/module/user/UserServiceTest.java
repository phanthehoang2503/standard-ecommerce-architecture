package com.learningmat.ecommerce.module.user;

import com.learningmat.ecommerce.dto.request.UserCreateRequest;
import com.learningmat.ecommerce.dto.request.UserUpdateRequest;
import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import com.learningmat.ecommerce.mapper.UserMapper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void createUser_success() {
        // arrange
        UserCreateRequest request = UserCreateRequest.builder()
                .username("newuser")
                .password("pass123")
                .fullName("Full Name")
                .dob(java.time.LocalDate.now())
                .build();

        User user = new User();
        user.setUsername("newuser");

        when(userRepository.existsByUsername(request.username())).thenReturn(false);
        when(userMapper.toUser(request)).thenReturn(user);
        when(passwordEncoder.encode(request.password())).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // act
        User result = userService.createUser(request);

        // assert
        Assertions.assertNotNull(result);
        Assertions.assertEquals("newuser", result.getUsername());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void createUser_alreadyExisted_throwsException() {
        // arrange
        UserCreateRequest request = UserCreateRequest.builder()
                .username("existinguser")
                .password("pass")
                .fullName("Full Name")
                .dob(java.time.LocalDate.now())
                .build();
        when(userRepository.existsByUsername(request.username())).thenReturn(true);

        // act & assert
        AppException exception = Assertions.assertThrows(AppException.class,
                () -> userService.createUser(request));
        Assertions.assertEquals(ErrorCode.USER_EXISTED, exception.getErrorCode());
    }

    @Test
    void getMyProfile_success() {
        // arrange
        String username = "testuser";
        User user = User.builder().username(username).build();
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        // act
        User result = userService.getMyProfile(username);

        // assert
        Assertions.assertEquals(username, result.getUsername());
    }

    @Test
    void updateMyProfile_success() {
        // arrange
        String username = "testuser";
        UserUpdateRequest request = UserUpdateRequest.builder()
                .password("updatedPass")
                .fullName("New Name")
                .dob(java.time.LocalDate.now())
                .build();
        User user = User.builder().username(username).build();

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(request.password())).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // act
        User result = userService.updateMyProfile(username, request);

        // assert
        verify(userMapper).updateUser(user, request);
        verify(userRepository).save(user);
    }
}
