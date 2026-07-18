# Triển khai StructLab miễn phí

Cấu hình production đề xuất giữ nguyên kiến trúc của dự án:

- Frontend Next.js: Vercel Hobby.
- Backend Spring Boot: Render Free Web Service.
- PostgreSQL: Neon Free.

Các gói miễn phí có thể thay đổi theo chính sách của nhà cung cấp. Không đưa mật khẩu database, token hoặc API key vào GitHub.

## 1. Tạo PostgreSQL trên Neon

1. Tạo project tên `structlab` và database `neondb`.
2. Trong **Connect**, chọn kiểu kết nối **Java/JDBC** và bật pooled connection nếu có.
3. Giữ lại ba giá trị để nhập vào Render:
   - `DB_URL`: JDBC URL bắt đầu bằng `jdbc:postgresql://` và có `sslmode=require`.
   - `DB_USERNAME`: database role/user.
   - `DB_PASSWORD`: database password.

## 2. Triển khai backend trên Render

Repo có sẵn Blueprint [`render.yaml`](../render.yaml). Mở đường dẫn sau khi đã đăng nhập Render:

```text
https://render.com/deploy?repo=https://github.com/baochauemi291006-cyber/structlab
```

Render sẽ yêu cầu ba biến database ở bước trước. Các giá trị còn lại, gồm JWT secret ngẫu nhiên, được Blueprint cấu hình tự động.

Sau khi deploy thành công, kiểm tra:

```text
https://<render-service>.onrender.com/actuator/health
https://<render-service>.onrender.com/swagger-ui.html
```

## 3. Triển khai frontend trên Vercel

1. Import repo `baochauemi291006-cyber/structlab`.
2. Đặt **Root Directory** là `frontend`.
3. Framework Preset để Vercel tự nhận là **Next.js**.
4. Thêm biến môi trường:

```text
NEXT_PUBLIC_API_URL=https://<render-service>.onrender.com/api
```

5. Chọn gói Hobby và deploy.

## 4. Siết CORS về đúng tên miền production

Blueprint ban đầu cho phép các deployment có tên bắt đầu bằng `structlab` trên `vercel.app`. Sau khi có tên miền cuối cùng, trong Render hãy thay biến:

```text
CORS_ALLOWED_ORIGIN_PATTERNS=
CORS_ALLOWED_ORIGINS=https://<vercel-project>.vercel.app
```

Sau đó redeploy backend.

## 5. Kiểm tra production

1. Mở website và đăng nhập bằng `demo@structlab.vn` / `Demo123!`.
2. Mở một bài học, đánh dấu hoàn thành và làm một bài tập.
3. Tải lại Dashboard để xác nhận dữ liệu vẫn còn.
4. Mở Visualizer và thử Array, Stack, Queue.

## Giới hạn của gói miễn phí

- Render Free có thể ngủ sau một thời gian không có truy cập; request đầu tiên khi đánh thức sẽ chậm hơn.
- Neon Free có hạn mức lưu trữ và compute theo tháng.
- Vercel Hobby phù hợp dự án cá nhân/phi thương mại và có hạn mức sử dụng.
