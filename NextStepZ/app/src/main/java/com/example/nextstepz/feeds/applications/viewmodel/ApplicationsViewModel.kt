package com.example.nextstepz.feeds.applications.viewmodel

import ApplicationRepository
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.feeds.applications.data.model.Application
import com.example.nextstepz.feeds.applications.data.model.ApplicationStatus
import kotlinx.coroutines.launch

class ApplicationsViewModel(application: android.app.Application) : AndroidViewModel(application) {

    private val repository = ApplicationRepository(application)

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
        get() = _allApplications.value.count { it.status == ApplicationStatus.Pending }

    val interviewCount: Int
        get() = _allApplications.value.count { it.status == ApplicationStatus.Interview }

    fun loadApplications(jobId: String?) {
        viewModelScope.launch {
            _uiState.value = ApplicationsUiState.Loading
            try {
                val response = if(jobId != null) {
                    repository.getJobApplication(jobId)
                }else {
                    repository.getAllEmployerApplications()
                }
                if(response.success) {
                    _allApplications.value = response.applications
                    _uiState.value = ApplicationsUiState.Success(response.applications)
                } else {
                    _uiState.value = ApplicationsUiState.Error(response.message ?: "Lỗi tải dữ liệu")
                }
            } catch (e: Exception) {
                e.printStackTrace()
                _uiState.value = ApplicationsUiState.Error(e.message ?: "Không thể kết nối máy chủ")
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
        val app = _allApplications.value.find { it.id == appId }
        if (app != null) {
            _detailState.value = ApplicationDetailState.Shown(app)
        }
    }

    fun hideApplicationDetail() {
        _detailState.value = ApplicationDetailState.Hidden
    }

//    fun updateStatus(appId: String, newStatus: ApplicationStatus) {
//        viewModelScope.launch {
//            _isLoadingAction.value = true
//            try {
//                // Truyền chuỗi ("Pending", "Interview", "Rejected") lên BE thông qua newStatus.name
//                val response = repository.updateApplicationStatus(appId, newStatus.name)
//
//                if (response.success) {
//                    // Update Local: Nhân bản list, tìm đúng ứng viên và đổi cờ status
//                    _allApplications.value = _allApplications.value.map {
//                        if (it.id == appId) it.copy(status = newStatus) else it
//                    }
//                    _actionMessage.value = response.message ?: "Cập nhật thành công"
//                    _detailState.value = ApplicationDetailState.Hidden
//                } else {
//                    _actionMessage.value = response.message ?: "Cập nhật thất bại"
//                }
//            } catch (e: Exception) {
//                e.printStackTrace()
//                _actionMessage.value = "Lỗi kết nối. Vui lòng thử lại."
//            } finally {
//                _isLoadingAction.value = false
//            }
//        }
//    }

    // CHÚ Ý: Tính năng Ghi chú (Notes) hiện tại Backend của chúng ta chưa viết API
    // Mình giữ nguyên cấu trúc này cho bạn, nhưng sau này bạn cần viết API BE cho nó nhé
    fun updateNotes(appId: String, notes: String) {
        viewModelScope.launch {
            // Code cũ của bạn: repository.updateApplicationNotes...
        }
    }

    fun clearActionMessage() {
        _actionMessage.value = null
    }
}