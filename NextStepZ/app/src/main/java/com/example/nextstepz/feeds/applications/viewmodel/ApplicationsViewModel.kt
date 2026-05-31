package com.example.nextstepz.feeds.applications.viewmodel

import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.feeds.applications.data.model.Application
import com.example.nextstepz.feeds.applications.data.model.ApplicationStatus
import com.example.nextstepz.feeds.applications.data.repository.ApplicationRepository
import kotlinx.coroutines.launch

class ApplicationsViewModel : ViewModel() {

    private val repository = ApplicationRepository()

    private val _uiState = mutableStateOf<ApplicationsUiState>(ApplicationsUiState.Loading)
    val uiState: State<ApplicationsUiState> = _uiState

    private val _detailState = mutableStateOf<ApplicationDetailState>(ApplicationDetailState.Hidden)
    val detailState: State<ApplicationDetailState> = _detailState

    private val _selectedTab = mutableStateOf(ApplicationTab.All)
    val selectedTab: State<ApplicationTab> = _selectedTab

    private val _searchQuery = mutableStateOf("")
    val searchQuery: State<String> = _searchQuery

    private val _allApplications = mutableStateOf(emptyList<Application>())

    private val _isLoadingAction = mutableStateOf(false)
    val isLoadingAction: State<Boolean> = _isLoadingAction

    private val _actionMessage = mutableStateOf<String?>(null)
    val actionMessage: State<String?> = _actionMessage

    val filteredApplications: List<Application>
        get() {
            val all = _allApplications.value
            val tab = _selectedTab.value
            val query = _searchQuery.value

            var result = all

            if (tab != ApplicationTab.All) {
                val targetStatuses = when (tab) {
                    ApplicationTab.Pending -> listOf(ApplicationStatus.Pending)
                    ApplicationTab.Interview -> listOf(ApplicationStatus.Interview)
                    ApplicationTab.Rejected -> listOf(ApplicationStatus.Rejected)
                    else -> emptyList()
                }
                result = result.filter { it.status in targetStatuses }
            }

            if (query.isNotBlank()) {
                val q = query.lowercase()
                result = result.filter {
                    it.studentName.lowercase().contains(q) ||
                            it.studentEmail.lowercase().contains(q) ||
                            it.jobTitle.lowercase().contains(q)
                }
            }

            return result
        }

    val pendingCount: Int
        get() = _allApplications.value.count {
            it.status == ApplicationStatus.Pending
        }

    val interviewCount: Int
        get() = _allApplications.value.count {
            it.status == ApplicationStatus.Interview
        }

    init {
        loadApplications()
    }

    fun loadApplications() {
        viewModelScope.launch {
            _uiState.value = ApplicationsUiState.Loading
            repository.getApplications()
                .onSuccess { apps ->
                    _allApplications.value = apps.sortedByDescending { it.appliedAt }
                    _uiState.value = ApplicationsUiState.Success(applications = apps)
                }
                .onFailure { error ->
                    _uiState.value = ApplicationsUiState.Error(error.message ?: "Đã xảy ra lỗi")
                }
        }
    }

    fun setTab(tab: ApplicationTab) {
        _selectedTab.value = tab
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun showApplicationDetail(appId: String) {
        viewModelScope.launch {
            repository.getApplicationById(appId)
                .onSuccess { app ->
                    if (app != null) {
                        _detailState.value = ApplicationDetailState.Shown(app)
                    }
                }
        }
    }

    fun hideApplicationDetail() {
        _detailState.value = ApplicationDetailState.Hidden
    }

    fun updateStatus(appId: String, newStatus: ApplicationStatus) {
        viewModelScope.launch {
            _isLoadingAction.value = true
            repository.updateApplicationStatus(appId, newStatus)
                .onSuccess { updated ->
                    _allApplications.value = _allApplications.value.map {
                        if (it.id == appId) updated else it
                    }
                    val statusLabel = updated.status.label
                    _actionMessage.value = "Cập nhật trạng thái thành \"$statusLabel\" thành công"
                    _detailState.value = ApplicationDetailState.Hidden
                }
                .onFailure {
                    _actionMessage.value = "Cập nhật thất bại. Vui lòng thử lại."
                }
            _isLoadingAction.value = false
        }
    }

    fun updateNotes(appId: String, notes: String) {
        viewModelScope.launch {
            repository.updateApplicationNotes(appId, notes)
                .onSuccess { updated ->
                    _allApplications.value = _allApplications.value.map {
                        if (it.id == appId) updated else it
                    }
                    _detailState.value = ApplicationDetailState.Shown(updated)
                }
        }
    }

    fun clearActionMessage() {
        _actionMessage.value = null
    }
}
