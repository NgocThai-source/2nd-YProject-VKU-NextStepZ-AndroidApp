package com.example.nextstepz.notifications.data.model

/** Visual tone of a notification, used to pick the accent colour. */
enum class NotificationOutcome { POSITIVE, NEGATIVE, NEUTRAL }

/** Source category, used to pick the leading icon + label. */
enum class NotificationCategory(val label: String) {
    APPLICATION("Ứng tuyển"),
    JOB_REPORT("Báo cáo việc làm"),
    POST_REPORT("Báo cáo bài viết"),
    USER_REPORT("Tố cáo người dùng"),
    JOB_APPROVAL("Duyệt tin tuyển dụng"),
    EMPLOYER_APPROVAL("Đăng ký tuyển dụng"),
    GENERAL("Thông báo");

    companion object {
        fun fromKey(key: String?): NotificationCategory = when (key) {
            "application" -> APPLICATION
            "job_report" -> JOB_REPORT
            "post_report" -> POST_REPORT
            "user_report" -> USER_REPORT
            "job_approval" -> JOB_APPROVAL
            "employer_approval" -> EMPLOYER_APPROVAL
            else -> GENERAL
        }
    }
}

/** A notification as shown in the UI. */
data class NotificationItem(
    val id: String,
    val category: NotificationCategory,
    val outcome: NotificationOutcome,
    val title: String,
    val message: String,
    val isRead: Boolean,
    val timeLabel: String,
)
