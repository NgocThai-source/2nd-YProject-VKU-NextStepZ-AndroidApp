package com.example.nextstepz.feeds.data.model

enum class ReportReason(val label: String) {
    Spam("Spam hoặc quảng cáo"),
    Harassment("Bắt nạt hoặc quấy rối"),
    Misinformation("Thông tin sai lệch"),
    Inappropriate("Nội dung không phù hợp"),
    Other("Khác")
}

enum class UserReportReason(val label: String) {
    FakeAccount("Tài khoản giả mạo"),
    Harassment("Quấy rối hoặc lăng mạ"),
    Inappropriate("Hành vi không phù hợp"),
    Spam("Spam hoặc lừa đảo"),
    Other("Khác")
}