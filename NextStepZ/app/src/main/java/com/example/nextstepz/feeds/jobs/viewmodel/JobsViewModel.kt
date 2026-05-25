package com.example.nextstepz.feeds.jobs.viewmodel

import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.feeds.jobs.data.model.ExperienceLevel
import com.example.nextstepz.feeds.jobs.data.model.Job
import com.example.nextstepz.feeds.jobs.data.model.JobCategory
import com.example.nextstepz.feeds.jobs.data.model.JobFilterParams
import com.example.nextstepz.feeds.jobs.data.model.JobType
import com.example.nextstepz.feeds.jobs.data.repository.JobRepository
import kotlinx.coroutines.launch

class JobsViewModel : ViewModel() {

    private val repository = JobRepository()

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

    init {
        loadJobs()
        loadFeaturedJobs()
    }

    fun loadJobs() {
        viewModelScope.launch {
            _uiState.value = JobsUiState.Loading

            val params = JobFilterParams(
                keyword = _searchQuery.value,
                category = _selectedCategory.value
            )

            repository.getJobs(params)
                .onSuccess { jobs ->
                    _allJobs.value = jobs
                    _uiState.value = JobsUiState.Success(
                        jobs = jobs,
                        featuredJobs = _featuredJobs.value,
                        savedJobs = _savedJobs.value
                    )
                }
                .onFailure { error ->
                    _uiState.value = JobsUiState.Error(error.message ?: "Đã xảy ra lỗi")
                }
        }
    }

    fun refreshJobs() {
        viewModelScope.launch {
            _isRefreshing.value = true

            val params = JobFilterParams(
                keyword = _searchQuery.value,
                category = _selectedCategory.value
            )

            repository.getJobs(params)
                .onSuccess { jobs ->
                    _allJobs.value = jobs
                }
                .onFailure { error ->
                    _uiState.value = JobsUiState.Error(error.message ?: "Đã xảy ra lỗi khi làm mới")
                }

            repository.getFeaturedJobs()
                .onSuccess { featured ->
                    _featuredJobs.value = featured
                }

            _uiState.value = JobsUiState.Success(
                jobs = _allJobs.value,
                featuredJobs = _featuredJobs.value,
                savedJobs = _savedJobs.value
            )

            _isRefreshing.value = false
        }
    }

    private fun loadFeaturedJobs() {
        viewModelScope.launch {
            repository.getFeaturedJobs()
                .onSuccess { jobs ->
                    _featuredJobs.value = jobs
                    if (_uiState.value is JobsUiState.Success) {
                        _uiState.value = JobsUiState.Success(
                            jobs = _allJobs.value,
                            featuredJobs = jobs,
                            savedJobs = _savedJobs.value
                        )
                    }
                }
        }
    }

    private fun loadSavedJobs() {
        viewModelScope.launch {
            repository.getSavedJobs()
                .onSuccess { jobs ->
                    _savedJobs.value = jobs
                }
        }
    }

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
            repository.toggleSaveJob(jobId)
                .onSuccess { updatedJob ->
                    _allJobs.value = _allJobs.value.map {
                        if (it.id == jobId) updatedJob else it
                    }
                    _featuredJobs.value = _featuredJobs.value.map {
                        if (it.id == jobId) updatedJob else it
                    }
                    if (updatedJob.isSaved) {
                        _savedJobs.value = _savedJobs.value + updatedJob
                    } else {
                        _savedJobs.value = _savedJobs.value.filter { it.id != jobId }
                    }
                    updateUiState()

                    if (_detailState.value is JobDetailState.Shown) {
                        val detail = _detailState.value as JobDetailState.Shown
                        if (detail.job.id == jobId) {
                            _detailState.value = JobDetailState.Shown(updatedJob)
                        }
                    }
                }
        }
    }

    fun showJobDetail(jobId: String) {
        viewModelScope.launch {
            repository.getJobById(jobId)
                .onSuccess { job ->
                    if (job != null) {
                        _detailState.value = JobDetailState.Shown(job)
                    }
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
            repository.applyJob(jobId)
                .onSuccess { message ->
                    _applyMessage.value = message
                }
                .onFailure {
                    _applyMessage.value = "Đã xảy ra lỗi khi ứng tuyển"
                }
            _isApplying.value = false
        }
    }

    fun clearApplyMessage() {
        _applyMessage.value = null
    }

    fun showCreateJobSheet() {
        _isCreateJobVisible.value = true
    }

    fun hideCreateJobSheet() {
        _isCreateJobVisible.value = false
    }

    fun createJob(
        title: String,
        companyName: String,
        companyAddress: String,
        location: String,
        salaryMin: Int?,
        salaryMax: Int?,
        jobType: JobType,
        experienceLevel: ExperienceLevel,
        description: String,
        requirements: List<String>,
        benefits: List<String>,
        skills: List<String>,
        deadline: String,
        companyWebsite: String? = null
    ) {
        viewModelScope.launch {
            repository.createJob(
                title, companyName, companyAddress, location,
                salaryMin, salaryMax, jobType, experienceLevel,
                description, requirements, benefits, skills, deadline,
                companyWebsite
            )
                .onSuccess { newJob ->
                    _allJobs.value = listOf(newJob) + _allJobs.value
                    updateUiState()
                    _isCreateJobVisible.value = false
                }
        }
    }

    fun showReportSheet(jobId: String, jobTitle: String) {
        _reportState.value = ReportState.Shown(jobId, jobTitle)
    }

    fun hideReportSheet() {
        _reportState.value = ReportState.Hidden
    }

    fun submitReport(jobId: String, reason: String) {
        viewModelScope.launch {
            repository.reportJob(jobId, reason)
                .onSuccess { message ->
                    _reportState.value = ReportState.Hidden
                }
                .onFailure {
                    _reportState.value = ReportState.Hidden
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
