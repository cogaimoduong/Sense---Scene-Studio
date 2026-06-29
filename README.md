# Sense & Scene Studio

Website portfolio được xây dựng bằng Next.js, React, GSAP và Lenis.

## Chạy local

```bash
npm ci
npm run dev
```

Mở `http://localhost:3000`.

## Deploy bằng Vercel Dashboard

1. Push repository lên GitHub, GitLab hoặc Bitbucket.
2. Trong Vercel, chọn **Add New → Project** và import repository.
3. Giữ **Root Directory** là thư mục gốc của repository.
4. Framework sẽ được nhận diện là **Next.js**.
5. Build Command: `npm run build`.
6. Không đặt Output Directory; Vercel tự xử lý output của Next.js.
7. Chọn Node.js `22.x` rồi nhấn **Deploy**.

Website hiện không cần biến môi trường.

## Deploy bằng Vercel CLI

```bash
npm install --global vercel
vercel
vercel --prod
```

Lần chạy đầu, chọn hoặc tạo Vercel project theo hướng dẫn trong terminal.

## Kiểm tra trước khi deploy

```bash
npm run lint
npm run build
```
