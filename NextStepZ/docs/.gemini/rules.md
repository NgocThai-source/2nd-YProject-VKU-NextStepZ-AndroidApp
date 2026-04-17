# NextStepZ — AI Agent Rules

> Tất cả AI agent (Gemini, Copilot, ChatGPT, Claude, v.v.) khi làm việc với dự án này
> **BẮT BUỘC** phải tuân thủ các quy tắc dưới đây.

---

## 🏗️ Architecture

```
MVVM (Model – View – ViewModel) + Repository Pattern
```

### Layer Structure
| Layer | Path | Responsibility |
|-------|------|---------------|
| **Data** | `data/remote/` | Retrofit API interfaces, DTOs |
| **Data** | `data/local/` | DataStore, TokenManager |
| **Data** | `data/repository/` | Repository (trung gian giữa ViewModel và Data sources) |
| **Domain** | `domain/model/` | Business models (User, Job, Post, ...) |
| **UI** | `ui/theme/` | Color, Typography, Theme (Material3) |
| **UI** | `ui/components/` | Reusable Composables |
| **UI** | `ui/screens/{feature}/` | Screen + ViewModel per feature |
| **UI** | `ui/navigation/` | NavGraph, Routes |
| **Util** | `util/` | Constants, helpers, extensions |

### Data Flow
```
User Action → Screen (Composable) → ViewModel → Repository → API/DataStore
                ↑                       |
                └── StateFlow ──────────┘
```

---

## 🛠️ Tech Stack (KHÔNG THAY ĐỔI)

| Component | Technology |
|-----------|-----------|
| Language | **Kotlin** |
| UI | **Jetpack Compose** + **Material Design 3** |
| Architecture | **MVVM** + **Repository Pattern** |
| Networking | **Retrofit 2** + **OkHttp** + **Gson** |
| Navigation | **Navigation Compose** |
| State | **StateFlow** + **MutableStateFlow** |
| Storage | **DataStore Preferences** |
| Images | **Coil** |
| Backend | **NestJS** (REST API, KHÔNG sửa) |

---

## 📏 Coding Conventions

### Kotlin Standards
- Sử dụng `camelCase` cho functions, variables
- Sử dụng `PascalCase` cho classes, interfaces, enums
- Sử dụng `SCREAMING_SNAKE_CASE` cho constants
- File name = class name (1 file = 1 class/interface chính)
- Dùng `data class` cho DTOs và models
- Dùng `sealed class` cho UI states
- Dùng `object` cho singletons

### Compose Guidelines
- Composable functions bắt đầu bằng **chữ HOA** (PascalCase)
- Screen composables đặt trong `ui/screens/{feature}/`
- Reusable composables đặt trong `ui/components/`
- Sử dụng `Modifier` parameter luôn đứng đầu danh sách optional params
- **KHÔNG dùng** `remember { mutableStateOf() }` cho state trong ViewModel — dùng `StateFlow`
- Sử dụng `collectAsStateWithLifecycle()` để observe StateFlow

### ViewModel Rules
- Mỗi Screen **1 ViewModel**
- ViewModel đặt **cùng package** với Screen
- **KHÔNG** inject Context trực tiếp — dùng `AndroidViewModel` nếu cần
- Private `MutableStateFlow` + Public `StateFlow` (encapsulation)
- Dùng `sealed class` cho UI States (Idle, Loading, Success, Error)

### Repository Rules
- Repository **KHÔNG** biết về UI (không import Compose packages)
- Trả về `Result<T>` cho các operations có thể fail
- Xử lý error messages bằng **tiếng Việt**

---

## 🎨 Design System

### Brand Colors (KHÔNG THAY ĐỔI)
| Purpose | Color | Hex |
|---------|-------|-----|
| Primary | Cyan | `#22D3EE` |
| Secondary | Blue | `#3B82F6` |
| Accent | Purple | `#A855F7` |
| Background | Slate-900 | `#0F172A` |
| Surface | Slate-800 | `#1E293B` |
| Text Primary | White | `#FFFFFF` |
| Text Secondary | Gray-300 | `#D1D5DB` |
| Text Muted | Gray-400 | `#9CA3AF` |
| Error | Red-500 | `#EF4444` |

### Typography
- **Headings / Buttons**: `Exo2FontFamily` (ExtraBold, SemiBold, Medium)
- **Body / Labels**: `PoppinsFontFamily` (Regular, Medium, SemiBold)
- **KHÔNG** sử dụng `FontFamily.Default`

### Design Patterns
- **Dark theme only** (giống web frontend)
- **Glassmorphism** cho cards và form containers
- **Gradient text** cho headings (cyan → blue)
- **Gradient buttons** (cyan → blue) với shine animation
- **Animated gradient background** với floating orbs

---

## ⛔ FORBIDDEN ACTIONS

1. **KHÔNG** thay đổi package name (`com.example.nextstepz`)
2. **KHÔNG** sửa file `build.gradle.kts` hay `libs.versions.toml` mà không được yêu cầu
3. **KHÔNG** xóa bất kỳ file nào mà không được yêu cầu
4. **KHÔNG** thay đổi backend API (NestJS) — chỉ giao tiếp qua REST
5. **KHÔNG** thêm dependency mới mà không giải thích lý do
6. **KHÔNG** dùng library không có trong version catalog
7. **KHÔNG** sửa Theme colors mà không được yêu cầu
8. **KHÔNG** sử dụng Hilt/Dagger/Koin — hiện tại dùng manual DI
9. **KHÔNG** tạo Activity mới — chỉ dùng single-activity + Navigation Compose
10. **KHÔNG** dùng XML layouts — chỉ Jetpack Compose

---

## 🌐 Language

| Scope | Language |
|-------|---------|
| UI text (labels, buttons, messages) | **Tiếng Việt** |
| Code (variables, functions, classes) | **English** |
| Comments / Documentation | **Tiếng Việt** hoặc **English** (nhất quán trong file) |
| Error messages hiển thị cho user | **Tiếng Việt** |

---

## 📁 File Organization

Khi tạo feature mới, tuân theo pattern:
```
ui/screens/{feature_name}/
├── {Feature}Screen.kt          ← UI Composable
└── {Feature}ViewModel.kt       ← State management

data/remote/api/
└── {Feature}Api.kt             ← Retrofit interface

data/remote/dto/request/
└── {Feature}Request.kt         ← Request body

data/remote/dto/response/
└── {Feature}Response.kt        ← Response body

data/repository/
└── {Feature}Repository.kt      ← Data operations

domain/model/
└── {Model}.kt                  ← Business model (nếu cần)
```

---

## 🔄 Development Flow

1. **Xác định feature** cần implement
2. **Tham chiếu web frontend** (`frontend/`) để hiểu UI/UX đã có
3. **Tạo API interface** (nếu cần gọi backend)
4. **Tạo DTOs** (request + response)
5. **Tạo Repository** (xử lý data)
6. **Tạo ViewModel** (state management)
7. **Tạo Screen** (UI composable)
8. **Thêm route** vào NavGraph
9. **Test** trên emulator

---

## 🔗 Backend API Reference

- **Base URL**: `http://10.0.2.2:3001/api/` (emulator) hoặc `http://{LAN_IP}:3001/api/` (device)
- **Auth**: `/auth/login`, `/auth/register`, `/auth/forgot-password`
- **Profile**: `/profile/*`
- **Community**: `/community/*`
- **Jobs**: `/job-posting/*`
- **Messaging**: `/messaging/*`

> Chi tiết API xem tại: `backend/src/modules/` (mỗi module chứa controller + service)
