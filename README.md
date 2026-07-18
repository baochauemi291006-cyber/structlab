# StructLab

StructLab là nền tảng học cấu trúc dữ liệu bằng bài học ngắn, câu hỏi tương tác và mô phỏng từng bước. Dự án dùng Spring Boot cho REST API, Next.js cho giao diện và JWT cho xác thực.

## Tính năng

- Đăng ký, đăng nhập và xem hồ sơ bằng JWT.
- Lộ trình học Array, Stack và Queue với 6 bài học mẫu.
- 9 bài tập được chấm ngay, lưu lịch sử làm bài và cộng điểm.
- Đánh dấu bài đã hoàn thành, theo dõi tiến độ và độ chính xác.
- Visualizer cho thao tác Array, Stack và Queue, kèm từng bước và độ phức tạp.
- Swagger/OpenAPI để thử REST API ngay trên trình duyệt.
- H2 mặc định để chạy ngay, PostgreSQL tùy chọn cho môi trường triển khai.
- Docker Compose và GitHub Actions CI đã cấu hình sẵn.

## Công nghệ

| Phần | Công nghệ |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Framer Motion, Lucide React |
| Backend | Java 17, Spring Boot 4, Spring Security, Spring Data JPA |
| Xác thực | JWT Bearer token |
| Cơ sở dữ liệu | H2 mặc định, PostgreSQL tùy chọn |
| Tài liệu API | Springdoc OpenAPI và Swagger UI |
| Kiểm thử | JUnit, Spring Boot Test, ESLint, Next production build |

## Chạy nhanh trên máy

Yêu cầu:

- Java 17 trở lên
- Node.js 20.9 trở lên
- npm 10 trở lên

Không cần cài Maven hoặc cơ sở dữ liệu. Maven Wrapper và H2 đã có sẵn.

### 1. Chạy backend

macOS hoặc Linux:

```bash
cd backend
./mvnw spring-boot:run
```

Windows PowerShell hoặc Command Prompt:

```bat
cd backend
mvnw.cmd spring-boot:run
```

Backend chạy tại `http://localhost:8080`.

### 2. Chạy frontend

Mở terminal thứ hai:

```bash
cd frontend
npm install
npm run dev
```

Mở `http://localhost:3000`.

Tài khoản mẫu:

```text
Email: demo@structlab.vn
Mật khẩu: Demo123!
```

Bạn cũng có thể tự tạo tài khoản ở trang Đăng ký.

## Chạy bằng Docker

Nếu máy đã cài Docker Desktop:

```bash
docker compose up --build
```

Lệnh này chạy frontend, backend và PostgreSQL. Dữ liệu PostgreSQL được giữ trong Docker volume `postgres-data`.

Để dừng:

```bash
docker compose down
```

## Địa chỉ hữu ích

| Dịch vụ | Địa chỉ |
| --- | --- |
| Website | http://localhost:3000 |
| REST API | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| OpenAPI JSON | http://localhost:8080/v3/api-docs |
| Health check | http://localhost:8080/actuator/health |

## REST API chính

| Method | Endpoint | Mô tả | Yêu cầu đăng nhập |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Tạo tài khoản | Không |
| POST | `/api/auth/login` | Đăng nhập và nhận JWT | Không |
| GET | `/api/auth/me` | Lấy người dùng hiện tại | Có |
| GET | `/api/topics` | Danh sách chủ đề | Không |
| GET | `/api/topics/{slug}` | Bài học trong chủ đề | Không |
| POST | `/api/lessons/{id}/complete` | Hoàn thành bài học | Có |
| GET | `/api/exercises?topic=array` | Danh sách bài tập | Có |
| POST | `/api/exercises/{id}/submit` | Nộp đáp án | Có |
| GET | `/api/progress/me` | Dashboard tiến độ | Có |
| POST | `/api/visualizations/{type}` | Sinh các bước mô phỏng | Không |

Chi tiết request và response nằm trong Swagger UI hoặc [docs/API_EXAMPLES.md](docs/API_EXAMPLES.md).

## Biến môi trường

### Backend

| Biến | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `PORT` | `8080` | Cổng backend |
| `DB_URL` | H2 file local | JDBC URL |
| `DB_USERNAME` | `sa` | Tài khoản cơ sở dữ liệu |
| `DB_PASSWORD` | trống | Mật khẩu cơ sở dữ liệu |
| `DB_DRIVER` | `org.h2.Driver` | JDBC driver |
| `JWT_SECRET` | khóa local mẫu | Khóa ký JWT, phải đổi khi triển khai thật |
| `JWT_TTL_HOURS` | `24` | Thời hạn token theo giờ |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Các frontend được gọi API, phân tách bằng dấu phẩy |
| `CORS_ALLOWED_ORIGIN_PATTERNS` | trống | Mẫu origin dùng cho preview deployment, phân tách bằng dấu phẩy |

### Frontend

| Biến | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api` | Base URL của REST API |

Sao chép file mẫu nếu cần tùy chỉnh:

```bash
cp frontend/.env.example frontend/.env.local
```

## Dùng PostgreSQL không qua Docker

Tạo database `structlab`, sau đó đặt biến môi trường trước khi chạy backend:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/structlab
export DB_USERNAME=structlab
export DB_PASSWORD=your_password
export DB_DRIVER=org.postgresql.Driver
cd backend
./mvnw spring-boot:run
```

Trên Windows PowerShell, dùng `$env:DB_URL="..."` thay cho `export`.

## Triển khai miễn phí

Dự án đã có Render Blueprint để tạo toàn bộ hệ thống miễn phí trong một lần:

- Render Static Site chạy frontend Next.js.
- Render Free Web Service chạy backend Spring Boot.
- Render Free PostgreSQL lưu tài khoản và tiến độ trong 30 ngày.

Mở hướng dẫn one-click và các lưu ý tại [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Kiểm thử và build

Backend:

```bash
cd backend
./mvnw test
./mvnw package
```

Frontend:

```bash
cd frontend
npm install
npm run lint
npm run build
npm run start
```

## Cấu trúc thư mục

```text
structlab/
├── backend/                 Spring Boot REST API
│   ├── src/main/java/       Controller, service, repository, model
│   ├── src/main/resources/  Cấu hình ứng dụng
│   └── src/test/            Kiểm thử backend
├── frontend/                Next.js App Router
│   ├── src/app/             Các route giao diện
│   ├── src/components/      Component dùng lại
│   ├── src/contexts/        Trạng thái đăng nhập
│   └── src/lib/             API client và kiểu dữ liệu
├── docs/                    Ví dụ gọi API
├── .github/workflows/       CI cho backend và frontend
└── docker-compose.yml       Chạy toàn bộ hệ thống
```

## Xử lý lỗi thường gặp

- `Permission denied` khi chạy `./mvnw`: chạy `chmod +x backend/mvnw`.
- Cổng 8080 hoặc 3000 đang bận: tắt tiến trình cũ hoặc đổi `PORT` và `NEXT_PUBLIC_API_URL` tương ứng.
- Frontend báo không kết nối backend: kiểm tra backend đã chạy và mở `http://localhost:8080/actuator/health`.
- Lỗi Java version: chạy `java -version` và bảo đảm phiên bản từ 17 trở lên.
- Muốn làm mới dữ liệu H2: tắt backend rồi xóa thư mục `backend/data`.

## Gợi ý mở rộng

- Thêm Linked List, Tree, Heap, Hash Table và Graph.
- Dùng Monaco Editor để chấm code Java trực tiếp.
- Thêm vai trò giảng viên, lớp học, bài tập và bảng xếp hạng.
- Viết integration test bằng Testcontainers và end-to-end test bằng Playwright.
- Thêm custom domain, giám sát uptime và quy trình backup database.

## Giấy phép

MIT License. Xem [LICENSE](LICENSE).
