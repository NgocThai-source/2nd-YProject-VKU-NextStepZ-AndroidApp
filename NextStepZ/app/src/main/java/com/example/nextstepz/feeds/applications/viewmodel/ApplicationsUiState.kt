package com.example.nextstepz.feeds.applications.viewmodel

import com.example.nextstepz.feeds.applications.data.model.Application
import com.example.nextstepz.feeds.applications.data.model.ApplicationStatus

sealed class ApplicationsUiState {
    object Loading : ApplicationsUiState()
    data class Success(
        val applications: List<Application>
    ) : ApplicationsUiState()
    data class Error(val message: String) : ApplicationsUiState()
}

sealed class ApplicationDetailState {
    object Hidden : ApplicationDetailState()
    data class Shown(val application: Application) : ApplicationDetailState()
}

enum class ApplicationTab(val label: String) {
    All("Tất cả"),
    Pending("Đang chờ"),
    Interview("Phỏng vấn"),
    Rejected("Từ chối")
}
