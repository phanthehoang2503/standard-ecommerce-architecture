package com.learningmat.ecommerce.module.category;

import com.learningmat.ecommerce.dto.request.CategoryRequest;
import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import com.learningmat.ecommerce.mapper.CategoryMapper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository repository;

    @Mock
    private CategoryMapper mapper;

    @InjectMocks
    private CategoryService service;

    @Test
    void getAllCategories_success() {
        //arrange
        Category category = Category.builder()
                .id(1L)
                .name("Electronics")
                .build();
        when(repository.findAll()).thenReturn(List.of(category));

        //act
        List<Category> res = service.getAllCategories();

        //assert
        Assertions.assertEquals(1, res.size());
        Assertions.assertEquals("Electronics", res.getFirst().getName());
        verify(repository, times(1)).findAll();
    }

    @Test
    void getCategory_validId_success() {
        //arrange
        Long id = 1L;
        Category category = Category.builder()
                .id(id)
                .name("Books")
                .build();
        when(repository.findById(id)).thenReturn(Optional.of(category));

        //act
        Category res = service.getCategory(id);

        //assert
        Assertions.assertNotNull(res);
        Assertions.assertEquals("Books", res.getName());
    }

    @Test
    void getCategory_invalidId_throwsException() {
        //arrange
        Long id = 99L;
        when(repository.findById(id)).thenReturn(Optional.empty());

        //act + assert
        AppException exception = Assertions
                .assertThrows(
                        AppException.class, () -> {
                            service.getCategory(id);
                        });

        Assertions.assertEquals(
                ErrorCode.CATEGORY_NOT_FOUND,
                exception.getErrorCode()
        );
    }

    @Test
    void createCategory_success() {
        //arrange
        CategoryRequest request = new CategoryRequest("New Cat", "Desc");
        Category category = Category.builder().name("New Cat").description("Desc").build();

        when(mapper.toCategory(request)).thenReturn(category);
        when(repository.save(any(Category.class))).thenReturn(category);

        //act
        Category result = service.createCategory(request);
        // Assert
        Assertions.assertNotNull(result);
        Assertions.assertEquals("New Cat", result.getName());
        verify(repository, times(1)).save(any(Category.class));
    }

    @Test
    void deleteCategory_success() {
        //arrange
        Long id = 1L;
        Category category = Category.builder()
                .id(id)
                .build();
        when(repository.findById(id))
                .thenReturn(Optional.of(category));
        doNothing().when(repository).delete(category);

        //act
        service.deleteCategory(id);

        //assert
        verify(repository, times(1)).delete(category);
    }
}
