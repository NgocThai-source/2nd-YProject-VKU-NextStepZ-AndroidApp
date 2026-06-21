package com.example.nextstepz.feeds.jobs.data.model

data class CreateJobRequest (
    val title: String,
    val description: String,
    val jobType: String,
    val experienceLevel: String,
    val salaryMin: Int? = null,
    val salaryMax: Int? = null,
    val salaryUnit: String = "triệu/tháng",
    val requirements: List<String> = emptyList(),
    val benefits: List<String> = emptyList(),
    val skills: List<String> = emptyList(),
    val deadline: String
)
data class SaveJobRequest(
    val jobId: String
)

data class ApplyJobRequest(
    val jobId: String,
    val coverLetter: String = "",
    val resumeUrl: String = ""
)
data class ReportJobRequest(
    val reason: String,
    val customText: String? = null
)