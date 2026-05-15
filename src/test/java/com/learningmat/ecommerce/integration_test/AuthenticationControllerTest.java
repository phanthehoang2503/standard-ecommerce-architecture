package com.learningmat.ecommerce.integration;

import com.learningmat.ecommerce.dto.request.AuthenticationRequest;
import com.learningmat.ecommerce.dto.request.UserUpdateRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void authenticate_success() throws Exception{
        // register a testuser
        UserUpdateRequest registerReq = UserUpdateRequest.builder()
                .username("testuser")
                .password("123123")
                .fullName("testuser")
                .dob(LocalDate.of(1995,2,2))
                .build();

        mockMvc.perform(MockMvcRequestBuilders.post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)));

        // try login
        AuthenticationRequest authReq = AuthenticationRequest.builder()
                .username("testuser")
                .password("123123")
                .build();

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authReq)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.result.authenticated").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result.token").exists());
    }

    @Test
    void login_invalidPassword_fails() {
        
    }
}
