package com.example.nextstepz.ui.screens.notification

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.data.model.NotificationCategory
import com.example.nextstepz.data.model.NotificationItem
import com.example.nextstepz.data.repository.NotificationRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class NotificationViewModel(
    private val repository: NotificationRepository = NotificationRepository()
) : ViewModel() {

    private val _selectedCategory = MutableStateFlow(NotificationCategory.ALL)
    val selectedCategory: StateFlow<NotificationCategory> = _selectedCategory.asStateFlow()

    val filteredNotifications: StateFlow<List<NotificationItem>> = combine(
        repository.notifications,
        _selectedCategory
    ) { notifications, category ->
        if (category == NotificationCategory.ALL) {
            notifications
        } else {
            notifications.filter { it.category == category }
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = repository.getMockNotifications()
    )

    private val _unreadCount = MutableStateFlow(0)
    val unreadCount: StateFlow<Int> = _unreadCount.asStateFlow()

    init {
        viewModelScope.launchWhenStarted {
            repository.notifications.collect { notifications ->
                _unreadCount.value = notifications.count { !it.isRead }
            }
        }
    }

    fun selectCategory(category: NotificationCategory) {
        _selectedCategory.value = category
    }

    fun markAsRead(id: Int) {
        repository.markAsRead(id)
    }

    fun markAllAsRead() {
        repository.markAllAsRead()
    }

    private fun CoroutineScope.launchWhenStarted(block: suspend () -> Unit) {
        launch { block() }
    }
}
