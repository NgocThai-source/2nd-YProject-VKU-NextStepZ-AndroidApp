package com.example.nextstepz.feeds.applications.data.remote

import com.example.nextstepz.feeds.applications.data.model.JobApplicationsResponse
import com.example.nextstepz.feeds.applications.data.model.UpdateStatusRequest
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.Path

interface ApplicationApi {
    @GET("api/jobs/{id}/applications")
    suspend fun getJobApplications(@Path("id") id: String?): JobApplicationsResponse

    @GET("api/employer/applications/all")
    suspend fun getAllEmployerApplications(): JobApplicationsResponse

    @PATCH("api/applications/{id}/status")
    suspend fun updateApplicationStatus(@Path("id") id: String?, @Body request: UpdateStatusRequest): JobApplicationsResponse
}