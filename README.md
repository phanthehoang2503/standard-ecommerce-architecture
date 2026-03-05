# Ecommerce Professional Backend

Dự án Ecommerce Backend thiết kế theo chuẩn công nghiệp, tập trung vào tính Module hóa, bảo mật và hiệu năng.

## Kiến trúc hệ thống

Thiết kế theo mô hình **Layered Architecture** kết hợp với **Domain Driven Design (Partial)** để đảm bảo sự tách biệt rõ rệt giữa logic nghiệp vụ và hạ tầng.


## Các chức năng chính

### Quản lý Sản phẩm
- **Phân trang**: thông qua `Pageable` để tối ưu hóa truy vấn dữ liệu (lấy danh sách sản phẩm).
- **Bộ lọc**: Cho phép người dùng tùy chỉnh hiển thị của danh sách (price, name, rating...) trên URL (dự định thêm FE).

### Giỏ hàng & Quy trình Đặt hàng
- **Tính năng đặt hàng**: Đảm bảo tính nhất quán (ACID) khi đặt hàng: trừ tồn kho, tạo đơn hàng và xóa giỏ hàng trong cùng một đơn vị công việc.
- **Kho**: Kiểm tra và cập nhật tồn kho trong quá trình xử lý giao dịch.

### Bảo mật & Giám sát
- **Xác thực**: Cơ chế xác thực không trạng thái (Stateless) JWT.
- **Logging**: Hệ thống Logback ghi vết toàn bộ hành trình người dùng và phát hiện lỗi hệ thống thời gian thực.
- **Xử lý lỗi cục bộ**: Trả về ApiResponse cho các trường hợp ngoại lệ (Unchecked Exception).

## Tech stack trong dự án

| Thành phần    | Công nghệ |
|:--------------| :--- |
| **Framework** | Spring Boot 4.0.1 |
| **Truy vấn**  | Spring Data JPA / Hibernate |
| **Bảo mật**   | Spring Security / JWT |
| **CSDL**      | MySQL 8.0 |
| **Đối chiếu** | MapStruct |
| **Logging**   | SLF4J / Logback |
| **Kiểm thử**  | JUnit 5 / Mockito |

## 📂 Cấu trúc dự án

```text
src/main/java/com/learningmat/ecommerce/
├── configuration/     # Thiết lập Security, Bean
├── dto/               # Nhận/Trả yêu cầu
├── exception/         # Xử lý lỗi tập trung
├── mapper/            # Ánh xạ Entity <-> DTO
└── module/            # Chứa các Module nghiệp vụ
    ├── cart/          # Giỏ hàng
    ├── category/      # Danh mục sản phẩm
    ├── inventory/     # Tồn kho
    ├── order/         # Đơn hàng
    ├── product/       # Sản phẩm
    └── user/          # Người dùng & Xác thực
```

## Cài đặt

1. **Môi trường**: Java 17+, MySQL.
2. **Cấu hình**: DB và key JWT trong `application.properties`(file cấu hình).
3. **Khởi chạy**:
   ```bash
   mvn spring-boot:run
   ```
4. **Tài liệu API**: Truy cập `/swagger-ui/index.html` sau khi chạy ứng dụng.

