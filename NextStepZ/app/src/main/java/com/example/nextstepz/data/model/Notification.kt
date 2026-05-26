package com.example.nextstepz.data.model

import androidx.compose.ui.graphics.Color

enum class NotificationCategory {
    ALL,
    POST,
    ACCOUNT,
    JOB
}

enum class NotificationIconType {
    SUCCESS,
    WARNING,
    COMMENT,
    HEART,
    APPROVED,
    REJECTED,
    INFO,
    LOCK,
    UNLOCK,
    JOB,
    POST
}

data class NotificationItem(
    val id: Int,
    val category: NotificationCategory,
    val iconType: NotificationIconType,
    val title: String,
    val message: String,
    val timestamp: String,
    val isRead: Boolean
)

data class NotificationTab(
    val category: NotificationCategory,
    val label: String,
    val count: Int = 0
)
