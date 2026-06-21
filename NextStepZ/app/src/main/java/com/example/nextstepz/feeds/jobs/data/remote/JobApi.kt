package com.example.nextstepz.feeds.jobs.data.remote

import com.example.nextstepz.feeds.jobs.data.model.CreateJobRequest
import com.example.nextstepz.feeds.jobs.data.model.JobResponse
import com.example.nextstepz.feeds.jobs.data.model.JobsResponse
import com.example.nextstepz.feeds.jobs.data.model.ReportJobRequest
import com.example.nextstepz.feeds.jobs.data.model.SaveJobResponse
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface JobApi {
    @GET("api/jobs")
    suspend fun getJobs(
        @Query("page") page: Int,
        @Query("limit") limit: Int = 20,
        @Query("jobType") jobType: String? = null,
        @Query("keyword") keyword: String? = null,
        @Query("savedOnly") savedOnly: Boolean = false,
    ): JobsResponse

    @GET("api/jobs/{id}")
    suspend fun getJobById(@Path("id") id: String): JobResponse

    @POST("api/jobs/")
    suspend fun createJob(@Body request: CreateJobRequest): JobResponse

    @POST("api/jobs/{id}/save")
    suspend fun saveJob(@Path("id") id: String): SaveJobResponse

    @DELETE("api/jobs/{id}/save")
    suspend fun unsaveJob(@Path("id") id: String): SaveJobResponse

    @POST("api/jobs/{id}/report")
    suspend fun reportJob(@Path("id") id: String, @Body response: ReportJobRequest): SaveJobResponse

    @POST("api/jobs/{id}/apply")
    suspend fun applyJob(@Path("id") id: String): SaveJobResponse
}