package com.example.nextstepz.feeds.jobs.viewmodel

import com.example.nextstepz.feeds.jobs.data.model.Job
import com.example.nextstepz.feeds.jobs.data.model.JobFilterParams

sealed class JobsUiState {
    object Loading : JobsUiState()
    data class Success(
        val jobs: List<Job>,
        val featuredJobs: List<Job> = emptyList(),
        val savedJobs: List<Job> = emptyList()
    ) : JobsUiState()
    data class Error(val message: String) : JobsUiState()
}

sealed class JobDetailState {
    object Hidden : JobDetailState()
    data class Shown(val job: Job?) : JobDetailState()
}

sealed class JobFilterState {
    object Hidden : JobFilterState()
    data class Shown(val currentParams: JobFilterParams) : JobFilterState()
}

sealed class ReportState {
    object Hidden : ReportState()
    data class Shown(val jobId: String, val jobTitle: String) : ReportState()
}
