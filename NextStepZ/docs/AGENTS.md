# AGENTS.md — NextStepZ Android App

> Hướng dẫn dành cho bất kỳ AI agent nào làm việc với dự án này.
> Đọc file này TRƯỚC KHI bắt đầu bất kỳ thao tác nào.

---

## 📌 Project Summary

| Field | Value |
|-------|-------|
| **Project** | NextStepZ – Android App |
| **Description** | Ứng dụng Android tìm kiếm việc làm, kết nối cộng đồng |
| **Team** | Nguyễn Ngọc Thái, Đoàn Văn Nguyên |
| **University** | Vietnam–Korea University of Information Technology (VKU) |
| **Type** | Academic project (Second-Year) |

---

## 📐 Architecture Overview

```
┌──────────────────────────────────────────────┐
│                 Android App                   │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │  Screen   │→│ ViewModel │→│ Repository  │ │
│  │ (Compose) │←│(StateFlow)│←│(Retrofit/DS)│ │
│  └──────────┘  └──────────┘  └────────────┘ │
│              MVVM + Repository                │
└────────────────────┬─────────────────────────┘
                     │ REST API (JSON)
                     ▼
┌──────────────────────────────────────────────┐
│              NestJS Backend                   │
│  (PostgreSQL + Prisma + JWT)                  │
│  ⚠️  KHÔNG SỬA — chỉ gọi API                │
└──────────────────────────────────────────────┘
```

---

## 🎯 Key Rules

### DO ✅
- Tuân theo MVVM pattern (Screen → ViewModel → Repository)
- Sử dụng Jetpack Compose cho tất cả UI
- Sử dụng StateFlow cho state management
- Tham chiếu web frontend (`frontend/`) khi build UI
- Sử dụng brand colors và fonts đã define trong `ui/theme/`
- Viết UI text bằng tiếng Việt, code bằng English
- Sử dụng reusable components từ `ui/components/`
- Giữ consistent dark theme với glassmorphism design

### DON'T ❌
- **KHÔNG** thêm dependency mà không được phê duyệt
- **KHÔNG** sửa backend (NestJS)
- **KHÔNG** thay đổi theme colors/fonts
- **KHÔNG** tạo Activity mới (single-activity architecture)
- **KHÔNG** dùng XML layouts
- **KHÔNG** dùng deprecated APIs
- **KHÔNG** xóa file không liên quan

---

## 📂 Important Paths

| Path | Description |
|------|------------|
| `NextStepZ/` | Android app project root |
| `NextStepZ/app/src/main/java/com/example/nextstepz/` | Kotlin source code |
| `NextStepZ/app/src/main/res/` | Android resources |
| `NextStepZ/gradle/libs.versions.toml` | Dependency versions |
| `backend/` | NestJS backend (reference only, DO NOT modify) |
| `frontend/` | Next.js frontend (reference for UI/UX design) |
| `.gemini/rules.md` | Detailed coding rules |

---

## 🔄 When Adding a New Feature

1. Check `frontend/` to see the existing web implementation
2. Check `backend/src/modules/` to understand the API
3. Follow the file organization pattern in `.gemini/rules.md`
4. Create: API → DTO → Repository → ViewModel → Screen → Route
5. Reuse existing components from `ui/components/`
6. Match the web frontend design (dark theme, glassmorphism, gradient)

---

## 🧪 Testing Checklist

Before marking any feature as complete:
- [ ] Builds without errors in Android Studio
- [ ] Renders correctly on emulator (API 24+)
- [ ] Matches web frontend design
- [ ] Vietnamese text displayed correctly
- [ ] API calls use correct endpoints
- [ ] Error handling shows Vietnamese messages
- [ ] No hardcoded strings (use constants)
