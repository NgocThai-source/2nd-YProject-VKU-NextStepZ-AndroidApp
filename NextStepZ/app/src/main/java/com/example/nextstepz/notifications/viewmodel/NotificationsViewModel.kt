package com.example.nextstepz.notifications.viewmodel

import android.app.Application
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.auth.data.local.TokenManager
import com.example.nextstepz.notifications.data.NotificationCenter
import com.example.nextstepz.notifications.data.repository.NotificationRepository
import kotlinx.coroutines.launch

class NotificationsViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = NotificationRepository()
    private val tokenManager = TokenManager(application)

    private val _uiState = mutableStateOf<NotificationsUiState>(NotificationsUiState.Loading)
    val uiState: State<NotificationsUiState> = _uiState

    private val _isRefreshing = mutableStateOf(false)
    val isRefreshing: State<Boolean> = _isRefreshing

    private fun currentUserId(): String? = tokenManager.userId?.takeIf { it.isNotBlank() }

    /**
     * Loads notifications. Shows the full-screen loader only on the very first
     * load; subsequent calls (e.g. re-opening the tab) refresh silently in the
     * background so the list doesn't flash.
     */
    fun load() {
        val userId = currentUserId()
        if (userId == null) {
            _uiState.value = NotificationsUiState.SignedOut
            NotificationCenter.setUnreadCount(0)
            return
        }
        viewModelScope.launch {
            if (_uiState.value !is NotificationsUiState.Success) {
                _uiState.value = NotificationsUiState.Loading
            }
            try {
                val items = repository.getNotifications(userId)
                _uiState.value = NotificationsUiState.Success(items)
                NotificationCenter.setUnreadCount(items.count { !it.isRead })
            } catch (e: Exception) {
                if (_uiState.value !is NotificationsUiState.Success) {
                    _uiState.value = NotificationsUiState.Error(
                        e.message ?: "Không tải được thông báo"
                    )
                }
            }
        }
    }

    fun refresh() {
        val userId = currentUserId() ?: run {
            _uiState.value = NotificationsUiState.SignedOut
            NotificationCenter.setUnreadCount(0)
            return
        }
        viewModelScope.launch {
            _isRefreshing.value = true
            try {
                val items = repository.getNotifications(userId)
                _uiState.value = NotificationsUiState.Success(items)
                NotificationCenter.setUnreadCount(items.count { !it.isRead })
            } catch (e: Exception) {
                if (_uiState.value !is NotificationsUiState.Success) {
                    _uiState.value = NotificationsUiState.Error(
                        e.message ?: "Không tải được thông báo"
                    )
                }
            } finally {
                _isRefreshing.value = false
            }
        }
    }

    fun markAsRead(id: String) {
        val current = _uiState.value
        if (current !is NotificationsUiState.Success) return
        val target = current.items.find { it.id == id } ?: return
        if (target.isRead) return
        val updated = current.items.map { if (it.id == id) it.copy(isRead = true) else it }
        _uiState.value = NotificationsUiState.Success(updated)
        NotificationCenter.setUnreadCount(updated.count { !it.isRead })
        viewModelScope.launch { repository.markAsRead(id) }
    }

    fun markAllRead() {
        val userId = currentUserId() ?: return
        val current = _uiState.value
        if (current is NotificationsUiState.Success) {
            _uiState.value = NotificationsUiState.Success(current.items.map { it.copy(isRead = true) })
        }
        NotificationCenter.setUnreadCount(0)
        viewModelScope.launch { repository.markAllRead(userId) }
    }
}
