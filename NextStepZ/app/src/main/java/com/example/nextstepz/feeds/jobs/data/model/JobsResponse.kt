package com.example.nextstepz.feeds.jobs.data.model

data class JobsResponse(
    val success: Boolean,
    val message: String,
    val jobs: List<Job>,
    val page: Int = 1,
    val totalPages: Int = 1,
    val totalJobs: Int = 0
)

data class JobResponse(
    val success: Boolean,
    val message: String,
    val job: Job?
)

data class ApplyJobResponse(
    val success: Boolean,
    val message: String,
    val applicationId: String?
)

data class SaveJobResponse(
    val success: Boolean,
    val message: String
)

data class JobFilterParams(
    val keyword: String = "",
    val category: JobCategory = JobCategory.All,
    val location: String? = null,
    val jobType: JobType? = null,
    val experienceLevel: ExperienceLevel? = null,
    val salaryMin: Int? = null,
    val salaryMax: Int? = null,
    val sortBy: JobSortBy = JobSortBy.Newest,
    val page: Int = 1,
    val limit: Int = 20
)
