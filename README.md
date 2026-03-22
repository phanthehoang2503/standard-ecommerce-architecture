# Ecommerce Professional Backend

Dự án Ecommerce Backend thiết kế theo chuẩn công nghiệp, tập trung vào tính module hóa, bảo mật và hiệu năng.

## Mô tả hệ thống
Hệ thống monolith quản lý bán hàng tập trung vào việc xử lý các quy trình nghiệp vụ cốt lõi của một nền tảng thương mại điện tử. Mục tiêu là xây dựng một hệ thống API ổn định, dữ liệu nhất quán và dễ dàng mở rộng.
Các mảng nghiệp vụ chính bao gồm:
- **Hàng hóa**: Quản lý chi tiết sản phẩm, danh mục, tồn kho và đánh giá.
- **Giao dịch**: Xử lý giỏ hàng và quy trình đặt hàng tối ưu.
- **Bảo mật**: Hệ thống xác thực và phân quyền người dùng bảo mật.

Frontend của hệ thống được generate nhờ AI dựa trên danh sách endpoint từ backend

## Kiến trúc hệ thống

Thiết kế theo mô hình **Layered Architecture** kết hợp với **Domain Driven Design (Partial)** để đảm bảo sự tách biệt rõ rệt giữa logic nghiệp vụ và hạ tầng.

## Các chức năng chính

### Quản lý Sản phẩm
- **Phân trang & Caching**: Sử dụng `Pageable` và Redis (`@Cacheable`) để tăng tốc độ lấy danh sách sản phẩm. Kiến trúc Caching hỗ trợ tính năng **Fail-soft** (vẫn chạy bằng DB nếu Redis sập hoặc chưa bật).
- **Bộ lọc**: Cho phép người dùng tùy chỉnh hiển thị của danh sách trên URL.
- **Hệ thống đánh giá**: Tự động tổng hợp trung bình sao và đếm số lượng đánh giá trực tiếp trong một Request duy nhất để tối ưu hiệu năng.

### Giỏ hàng & Quy trình Đặt hàng
- **Tính năng đặt hàng**: Đảm bảo tính nhất quán (ACID) khi đặt hàng: trừ tồn kho, tạo đơn hàng và xóa giỏ hàng trong cùng một đơn vị công việc.
- **Kho**: Kiểm tra và cập nhật tồn kho trong quá trình xử lý giao dịch.

### Bảo mật & Giám sát
- **Xác thực**: Cơ chế xác thực không trạng thái JWT với cấu trúc Filter Chain đa lớp riêng biệt cho GET và POST.
- **Logging**: Hệ thống Logback ghi vết toàn bộ hành trình người dùng và phát hiện lỗi hệ thống thời gian thực.
- **Xử lý lỗi cục bộ**: Trả về ApiResponse cho các trường hợp ngoại lệ.

### Tích hợp thanh toán VNpay
- **Bảo mật giao dịch**: Sử dụng cấu trúc hướng sự kiện với mã hóa HMAC-SHA512 đảm bảo an toàn chữ ký giao dịch.
- **IPN Webhook & Callback**: Đồng bộ trạng thái đơn hàng trực tiếp từ VNPay Sandbox nội bộ qua tunnel.

## Tech stack trong dự án

| Thành phần    | Công nghệ |
|:--------------| :--- |
| **Framework** | Spring Boot 4.0.1 |
| **Truy vấn**  | Spring Data JPA / Hibernate |
| **Bảo mật**   | Spring Security / JWT |
| **CSDL**      | MySQL 8.0, Redis (Caching) |
| **Đối chiếu** | MapStruct (Mapping Entity <-> DTO) |
| **Quản trị DB**| Liquibase (Schema Migration) |
| **Logging**   | SLF4J / Logback |
| **Kiểm thử**  | JUnit 5 / Mockito |
| **Deploy**    | Docker / Docker Compose |

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
    ├── payment/       # Tích hợp thanh toán VNPay
    ├── product/       # Sản phẩm
    ├── review/        # Đánh giá & Bình luận
    └── user/          # Người dùng & Xác thực
```

## Cài đặt

1. **Môi trường**: Java 17+ (hoặc Temurin 21), MySQL.
2. **Cấu hình**: Dựa trên file `application.properties.example` và `docker-compose.yml.example` để tạo file cấu hình cho DB, JWT Key và VNPay Sandbox.
3. **Khởi chạy**:
   - **Cách 1 (Local):**
     ```bash
     mvn spring-boot:run
     ```
   - **Cách 2 (Docker):**
     ```bash
     docker-compose up -d --build
     ```
4. **Tài liệu API**: Truy cập `/swagger-ui/index.html` sau khi chạy ứng dụng web thành công.

