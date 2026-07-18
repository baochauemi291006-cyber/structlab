# Triển khai StructLab miễn phí

Repo có sẵn Render Blueprint để tạo toàn bộ hệ thống trong một lần:

- `structlab-baochauemi291006`: frontend Next.js static.
- `structlab-api-baochauemi291006`: Spring Boot REST API.
- `structlab-db-baochauemi291006`: PostgreSQL.

## One-click deploy

1. Đăng nhập Render bằng GitHub.
2. Mở đường dẫn:

```text
https://render.com/deploy?repo=https://github.com/baochauemi291006-cyber/structlab
```

3. Chọn **Apply**. Blueprint tự liên kết database, tạo JWT secret, build cả frontend/backend và cấp hai tên miền HTTPS.

Không cần nhập mật khẩu database hoặc sao chép secret bằng tay.

## Địa chỉ sau khi triển khai

| Thành phần | Địa chỉ dự kiến |
| --- | --- |
| Website | `https://structlab-baochauemi291006.onrender.com` |
| REST API | `https://structlab-api-baochauemi291006.onrender.com/api` |
| Swagger UI | `https://structlab-api-baochauemi291006.onrender.com/swagger-ui.html` |
| Health check | `https://structlab-api-baochauemi291006.onrender.com/actuator/health` |

Nếu một tên service đã được dùng, Render sẽ yêu cầu đổi tên và cấp subdomain tương ứng.

## Kiểm tra production

1. Chờ cả ba resource chuyển sang trạng thái `Available` hoặc `Live`.
2. Mở website và đăng nhập bằng `demo@structlab.vn` / `Demo123!`.
3. Mở một bài học, đánh dấu hoàn thành và làm một bài tập.
4. Tải lại Dashboard để xác nhận dữ liệu đã lưu.
5. Mở Visualizer và thử Array, Stack, Queue.

## Giới hạn miễn phí

- Backend Render Free có thể ngủ sau một thời gian không có truy cập; request đầu tiên khi đánh thức sẽ chậm hơn.
- Render Free PostgreSQL hết hạn sau 30 ngày. Trước thời điểm đó, có thể chuyển database sang Neon Free bằng các biến `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` và `DB_DRIVER` có sẵn của backend.
- Frontend static vẫn phục vụ ngay cả khi backend đang được đánh thức.

Không đưa mật khẩu database, token hoặc API key vào GitHub.
