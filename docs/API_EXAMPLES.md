# Ví dụ gọi StructLab REST API

Base URL local: `http://localhost:8080/api`

## Đăng nhập

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@structlab.vn","password":"Demo123!"}'
```

Response trả về `token`. Gán token đó vào biến để gọi endpoint cần đăng nhập:

```bash
TOKEN="paste_token_here"
```

## Xem lộ trình

```bash
curl http://localhost:8080/api/topics
curl http://localhost:8080/api/topics/array
```

## Hoàn thành bài học

Thay `1` bằng ID bài học nhận được từ endpoint chi tiết chủ đề.

```bash
curl -X POST http://localhost:8080/api/lessons/1/complete \
  -H "Authorization: Bearer $TOKEN"
```

## Lấy và nộp bài tập

```bash
curl "http://localhost:8080/api/exercises?topic=array" \
  -H "Authorization: Bearer $TOKEN"
```

Thay `1` bằng ID bài tập:

```bash
curl -X POST http://localhost:8080/api/exercises/1/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"answer":"[4, 5, 7, 9]"}'
```

## Xem tiến độ

```bash
curl http://localhost:8080/api/progress/me \
  -H "Authorization: Bearer $TOKEN"
```

## Mô phỏng Stack

```bash
curl -X POST http://localhost:8080/api/visualizations/stack \
  -H "Content-Type: application/json" \
  -d '{
    "initialValues": [2, 5],
    "operations": [
      {"type": "PUSH", "value": 10},
      {"type": "PEEK"},
      {"type": "POP"}
    ]
  }'
```

Các loại mô phỏng hiện có:

- `array`: `INSERT`, `DELETE`, `UPDATE`, `SEARCH`
- `stack`: `PUSH`, `POP`, `PEEK`
- `queue`: `ENQUEUE`, `DEQUEUE`, `PEEK`

Bạn có thể thử tất cả endpoint bằng Swagger UI tại `http://localhost:8080/swagger-ui.html`.
