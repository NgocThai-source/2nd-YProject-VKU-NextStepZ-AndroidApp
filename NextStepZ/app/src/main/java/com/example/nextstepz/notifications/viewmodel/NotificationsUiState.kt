package com.example.nextstepz.notifications.viewmodel

import com.example.nextstepz.notifications.data.model.NotificationItem

sealed interface NotificationsUiState {
    data object Loading : NotificationsUiState
    data class Success(val items: List<NotificationItem>) : NotificationsUiState {
        val unreadCount: Int get() = items.count { !it.isRead }
    }
    data class Error(val message: String) : NotificationsUiState
    /** No logged-in user found in session. */
    data object SignedOut : NotificationsUiState
}
