package com.learningmat.ecommerce.integration_test;

import com.learningmat.ecommerce.dto.request.ProductRequest;
import com.learningmat.ecommerce.module.category.Category;
import com.learningmat.ecommerce.module.category.CategoryRepository;
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
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ProductControllerTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getProducts_success() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/products"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.result.content").isArray());
    }

    @Test
    void createProduct_asUser_forbidden() throws Exception {
        ProductRequest productReq = ProductRequest.builder()
                .name("testprod")
                .price(1000)
                .build();

        mockMvc.perform(MockMvcRequestBuilders.post("/products")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_USER")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(productReq)))
                .andExpect(MockMvcResultMatchers.status().isForbidden());
    }

    @Test
    void createProduct_asStaff_success() throws Exception {
        Category category = categoryRepository.save(
                Category.builder()
                        .name("testcategory")
                        .description("testdesc")
                        .build());

        ProductRequest productReq = ProductRequest.builder()
                .name("testprod")
                .price(1000)
                .stock(10)
                .categoryId(category.getId())
                .build();

        mockMvc.perform(MockMvcRequestBuilders.post("/products")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_STAFF")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(productReq)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.result.name").value("testprod"));
    }

}
