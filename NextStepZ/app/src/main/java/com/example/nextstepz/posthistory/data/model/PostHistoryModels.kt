package com.example.nextstepz.posthistory.data.model

/** Visibility status of a user's post. */
enum class PostVisibility(val label: String) {
    PUBLISHED("Đang hiển thị"),
    HIDDEN("Đã ẩn"),
    DELETED("Đã gỡ");

    companion object {
        fun fromDb(value: String?): PostVisibility = when (value?.lowercase()) {
            "hidden" -> HIDDEN
            "deleted" -> DELETED
            else -> PUBLISHED
        }
    }
}

/** Approval status of a job posting. */
enum class JobApproval(val label: String) {
    PENDING("Chờ duyệt"),
    APPROVED("Đã duyệt"),
    REJECTED("Từ chối");

    companion object {
        fun fromDb(value: String?): JobApproval = when (value?.lowercase()) {
            "approved" -> APPROVED
            "rejected" -> REJECTED
            else -> PENDING
        }
    }
}

data class PostHistoryItem(
    val id: String,
    val content: String,
    val type: String,
    val dateLabel: String,
    val likeCount: Int,
    val commentCount: Int,
    val visibility: PostVisibility,
)

data class JobHistoryItem(
    val id: String,
    val title: String,
    val salaryText: String,
    val jobType: String,
    val deadline: String,
    val applicationCount: Int,
    val dateLabel: String,
    val approval: JobApproval,
)
