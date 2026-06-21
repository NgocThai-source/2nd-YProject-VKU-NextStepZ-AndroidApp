package com.example.nextstepz.feeds.applications.data.model
data class JobApplicationsResponse(
    val success: Boolean,
    val message: String?,
    val applications: List<Application> = emptyList()
)