package com.example.nextstepz.notifications.data

import android.util.Log
import com.example.nextstepz.notifications.data.repository.NotificationRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * App-wide source of truth for the unread-notification count. The bottom nav
 * bar observes [unreadCount] to show its red dot; the Notifications screen
 * keeps it in sync after loading / marking as read. Refreshed by polling from
 * [com.example.nextstepz.ui.screens.main.MainScreen] for near real-time updates.
 */
object NotificationCenter {

    private val repository = NotificationRepository()

    private val _unreadCount = MutableStateFlow(0)
    val unreadCount: StateFlow<Int> = _unreadCount.asStateFlow()

    fun setUnreadCount(count: Int) {
        _unreadCount.value = count.coerceAtLeast(0)
    }

    suspend fun refresh(userId: String) {
        try {
            _unreadCount.value = repository.getUnreadCount(userId)
        } catch (e: Exception) {
            Log.e("NotificationCenter", "refresh error", e)
        }
    }
}
