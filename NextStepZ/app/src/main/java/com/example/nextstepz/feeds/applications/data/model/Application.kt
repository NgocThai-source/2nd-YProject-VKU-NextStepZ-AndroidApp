package com.example.nextstepz.feeds.applications.data.model

import android.os.Build
import androidx.annotation.RequiresApi

enum class ApplicationStatus(
    val label: String,
    val colorHex: Long,
    val bgAlpha: Float
) {
    Pending("Đang chờ", 0xFFF59E0B, 0.15f),
    Interview("Phỏng vấn", 0xFF06B6D4, 0.15f),
    Rejected("Từ chối", 0xFFEF4444, 0.12f)
}

data class Application(
    val id: String,
    val studentName: String,
    val studentEmail: String,
    val studentPhone: String,
    val studentAvatar: String? = null,
    val jobId: String,
    val jobTitle: String,
    val companyName: String,
    val appliedAt: String,
    val status: ApplicationStatus,
    val appliedVia: String = "Ứng tuyển trực tuyến"
) {
    val daysAgo: Int
        @RequiresApi(Build.VERSION_CODES.O)
        get() {
            return try {
                val applied = java.time.LocalDate.parse(appliedAt.take(10))
                java.time.temporal.ChronoUnit.DAYS.between(applied, java.time.LocalDate.now()).toInt()
            } catch (e: Exception) {
                0
            }
        }

    val appliedDisplay: String
        @RequiresApi(Build.VERSION_CODES.O)
        get() = when (daysAgo) {
            0 -> "Hôm nay"
            1 -> "Hôm qua"
            in 2..6 -> "$daysAgo ngày trước"
            in 7..29 -> "${daysAgo / 7} tuần trước"
            else -> appliedAt.take(10)
        }

    val initials: String
        get() = studentName.split(" ")
            .takeLast(2)
            .joinToString("") { it.first().uppercaseChar().toString() }
}
