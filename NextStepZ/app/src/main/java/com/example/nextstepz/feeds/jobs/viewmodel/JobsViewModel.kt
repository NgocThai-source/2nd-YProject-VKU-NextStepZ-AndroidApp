package com.example.nextstepz.feeds.jobs.viewmodel

import JobRepository
import android.app.Application
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.auth.data.local.TokenManager
import com.example.nextstepz.feeds.jobs.data.model.CreateJobRequest
import com.example.nextstepz.feeds.jobs.data.model.ExperienceLevel
import com.example.nextstepz.feeds.jobs.data.model.Job
import com.example.nextstepz.feeds.jobs.data.model.JobCategory
import com.example.nextstepz.feeds.jobs.data.model.JobFilterParams
import com.example.nextstepz.feeds.jobs.data.model.JobType
import kotlinx.coroutines.launch

class JobsViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = JobRepository(application)

    private val _uiState = mutableStateOf<JobsUiState>(JobsUiState.Loading)
    val uiState: State<JobsUiState> = _uiState

    private val _isRefreshing = mutableStateOf(false)
    val isRefreshing: State<Boolean> = _isRefreshing

    private val _selectedCategory = mutableStateOf(JobCategory.All)
    val selectedCategory: State<JobCategory> = _selectedCategory

    private val _searchQuery = mutableStateOf("")
    val searchQuery: State<String> = _searchQuery

    private val _detailState = mutableStateOf<JobDetailState>(JobDetailState.Hidden)
    val detailState: State<JobDetailState> = _detailState

    private val _filterState = mutableStateOf<JobFilterState>(JobFilterState.Hidden)
    val filterState: State<JobFilterState> = _filterState

    private val _isApplying = mutableStateOf(false)
    val isApplying: State<Boolean> = _isApplying

    private val _applyMessage = mutableStateOf<String?>(null)
    val applyMessage: State<String?> = _applyMessage

    private val _isCreateJobVisible = mutableStateOf(false)
    val isCreateJobVisible: State<Boolean> = _isCreateJobVisible

    private val _reportState = mutableStateOf<ReportState>(ReportState.Hidden)
    val reportState: State<ReportState> = _reportState

    private val _allJobs = mutableStateOf(emptyList<Job>())
    private val _savedJobs = mutableStateOf(emptyList<Job>())
    private val _featuredJobs = mutableStateOf(emptyList<Job>())
    private val tokenManager = TokenManager(application)
    val isMyUserId = tokenManager.userId

    init {
        loadJobs()
//        loadFeaturedJobs()
    }

    val isEmployer: Boolean get() = tokenManager.userRole == "employer"
    val isGuest = tokenManager.isGuest()

    fun loadJobs() {
        viewModelScope.launch {
            _uiState.value = JobsUiState.Loading

            try {
                val params = JobFilterParams(
                    keyword = _searchQuery.value,
                    category = _selectedCategory.value
                )

                val response = repository.getJobs(params)

                if (response.success) {
                    _allJobs.value = response.jobs

                    _uiState.value = JobsUiState.Success(
                        jobs = _allJobs.value,
                        featuredJobs = _featuredJobs.value,
                        savedJobs = _savedJobs.value
                    )
                } else {
                    _uiState.value = JobsUiState.Error(response.message)
                }
            } catch (e: Exception) {
                // Hứng lỗi rớt mạng, lỗi server...
                _uiState.value = JobsUiState.Error(e.message ?: "Đã xảy ra lỗi kết nối")
            }
        }
    }

    fun refreshJobs() {
        viewModelScope.launch {
            _isRefreshing.value = true

            try {
                val params = JobFilterParams(
                    keyword = _searchQuery.value,
                    category = _selectedCategory.value
                )

                val response = repository.getJobs(params)

                if (response.success) {
                    _allJobs.value = response.jobs
                    updateUiState()
                } else {
                    _uiState.value = JobsUiState.Error(response.message)
                }
            } catch (e: Exception) {
                _uiState.value = JobsUiState.Error(e.message ?: "Đã xảy ra lỗi khi làm mới")
            } finally {
                // Bỏ vòng xoay loading dù thành công hay thất bại
                _isRefreshing.value = false
            }
        }
    }

//    private fun loadFeaturedJobs() {
//        viewModelScope.launch {
//            repository.getFeaturedJobs()
//                .onSuccess { jobs ->
//                    _featuredJobs.value = jobs
//                    if (_uiState.value is JobsUiState.Success) {
//                        _uiState.value = JobsUiState.Success(
//                            jobs = _allJobs.value,
//                            featuredJobs = jobs,
//                            savedJobs = _savedJobs.value
//                        )
//                    }
//                }
//        }
//    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
        loadJobs()
    }

    fun setCategory(category: JobCategory) {
        if (_selectedCategory.value == category) return
        _selectedCategory.value = category
        loadJobs()
    }

    fun toggleSaveJob(jobId: String) {
        viewModelScope.launch {
            try {
                val response = repository.saveJob(jobId)
                if (response.success) {
                    _allJobs.value = _allJobs.value.map {
                        job -> if (job.id == jobId) job.copy(isSaved = !job.isSaved) else job
                    }
                    updateUiState()
                    if(_detailState.value is JobDetailState.Shown) {
                        val currentDetail = _detailState.value as JobDetailState.Shown
                        if(currentDetail.job?.id == jobId) {
                            _detailState.value = JobDetailState.Shown(currentDetail.job.copy(isSaved = !currentDetail.job.isSaved))
                        }
                    }
                }else {
                    _uiState.value = JobsUiState.Error(response.message)
                }
            }catch (e: Exception){
                e.printStackTrace()
                _uiState.value = JobsUiState.Error("Lỗi kết nối: ${e.message}")
            }
        }
    }

    fun toggleUnSaveJob(jobId: String) {
        viewModelScope.launch {
            try {
                val response = repository.unSaveJob(jobId)
                if (response.success) {
                    _allJobs.value = _allJobs.value.map {
                            job -> if (job.id == jobId) job.copy(isSaved = false) else job
                    }
                    updateUiState()
                    if(_detailState.value is JobDetailState.Shown) {
                        val currentDetail = _detailState.value as JobDetailState.Shown
                        if(currentDetail.job?.id == jobId) {
                            _detailState.value = JobDetailState.Shown(currentDetail.job.copy(isSaved = !currentDetail.job.isSaved))
                        }
                    }
                }else {
                    _uiState.value = JobsUiState.Error(response.message)
                }
            }catch (e: Exception){
                e.printStackTrace()
                _uiState.value = JobsUiState.Error("Lỗi kết nối: ${e.message}")
            }
        }
    }

    fun showJobDetail(jobId: String) {
        viewModelScope.launch {
            try {
                val response = repository.getJobById(jobId)

                if (response.success && response.job != null ) {
                    _detailState.value = JobDetailState.Shown(response.job)
                } else {
                    _uiState.value = JobsUiState.Error(response.message)
                }
            } catch (e: Exception) {
                e.printStackTrace()
                _uiState.value = JobsUiState.Error("Lỗi kết nối: ${e.message}")
            }
        }
    }

    fun hideJobDetail() {
        _detailState.value = JobDetailState.Hidden
    }

    fun showFilterSheet() {
        val currentParams = JobFilterParams(
            keyword = _searchQuery.value,
            category = _selectedCategory.value
        )
        _filterState.value = JobFilterState.Shown(currentParams)
    }

    fun hideFilterSheet() {
        _filterState.value = JobFilterState.Hidden
    }

    fun applyFilter(params: JobFilterParams) {
        _searchQuery.value = params.keyword
        _selectedCategory.value = params.category
        _filterState.value = JobFilterState.Hidden
        loadJobs()
    }

    fun applyToJob(jobId: String) {
        viewModelScope.launch {
            _isApplying.value = true
            try {
                val response = repository.applyJob(jobId)
                if (response.success) {
                    _isApplying.value = false
                    _applyMessage.value = response.message
                } else {
                    _isApplying.value = false
                    _uiState.value = JobsUiState.Error(response.message)
                }
            }catch (e: Exception) {
                e.printStackTrace()
                _uiState.value = JobsUiState.Error("Lỗi kết nối: ${e.message}")
            }
        }
    }

    fun clearApplyMessage() {
        _applyMessage.value = null
    }

    fun showCreateJobSheet() {
        if (isEmployer) {
            _isCreateJobVisible.value = true
        } else {
            _uiState.value = JobsUiState.Error("Bạn cần đăng ký thông tin Nhà tuyển dụng để sử dụng tính năng này.")
        }
    }

    fun hideCreateJobSheet() {
        _isCreateJobVisible.value = false
    }

    fun createJob(
        title: String,
        salaryMin: Int?,
        salaryMax: Int?,
        jobType: JobType,
        experienceLevel: ExperienceLevel,
        description: String,
        requirements: List<String>,
        benefits: List<String>,
        skills: List<String>,
        deadline: String
    ) {
        viewModelScope.launch {
            try {
                // 1. Gói dữ liệu
                val request = CreateJobRequest(
                    title = title,
                    description = description,
                    jobType = jobType.name,
                    experienceLevel = experienceLevel.name,
                    salaryMin = salaryMin,
                    salaryMax = salaryMax,
                    requirements = requirements,
                    benefits = benefits,
                    skills = skills,
                    deadline = deadline
                )

                val response = repository.createJob(request)

                if (response.success) {
                    loadJobs() // Load lại danh sách mới nhất
                    _isCreateJobVisible.value = false // Đóng bottom sheet
                } else {
                    _uiState.value = JobsUiState.Error(response.message)
                }
            } catch (e: Exception) {
                e.printStackTrace()
                _uiState.value = JobsUiState.Error("Lỗi kết nối: ${e.message}")
            }
        }
    }

    fun showReportSheet(jobId: String, jobTitle: String) {
        _reportState.value = ReportState.Shown(jobId, jobTitle)
    }

    fun hideReportSheet() {
        _reportState.value = ReportState.Hidden
    }

    fun submitReport(jobId: String, reason: String, customText: String?) {
        viewModelScope.launch {
                try {
                    val response = repository.reportJob(jobId, reason, customText)
                    if(response.success) {
                        _allJobs.value = _allJobs.value.map {
                            job -> if (job.id == jobId) job.copy(isReported = true) else job
                        }
                        updateUiState()// Render lại UI
//                        Đóng Sheet báo cáo
                        _reportState.value = ReportState.Hidden

                    }else {
                        _uiState.value = JobsUiState.Error(response.message)
                    }
                }catch (e: Exception) {
                    e.printStackTrace()
                    _uiState.value = JobsUiState.Error("Lỗi kết nối: ${e.message}")
                }
        }
    }


    private fun updateUiState() {
        _uiState.value = JobsUiState.Success(
            jobs = _allJobs.value,
            featuredJobs = _featuredJobs.value,
            savedJobs = _savedJobs.value
        )
    }
}
