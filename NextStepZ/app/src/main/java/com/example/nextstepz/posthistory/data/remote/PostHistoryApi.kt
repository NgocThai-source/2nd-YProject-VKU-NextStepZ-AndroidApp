package com.example.nextstepz.posthistory.data.remote

import retrofit2.http.GET
import retrofit2.http.Query

interface PostHistoryApi {

    @GET("rest/v1/posts")
    suspend fun getPosts(
        @Query(value = "author_id", encoded = true) authorId: String,
        @Query(value = "select", encoded = true) select: String,
        @Query(value = "order", encoded = true) order: String = "created_at.desc",
    ): List<PostHistoryDto>

    @GET("rest/v1/jobs")
    suspend fun getJobs(
        @Query(value = "employer_id", encoded = true) employerId: String,
        @Query(value = "select", encoded = true) select: String,
        @Query(value = "order", encoded = true) order: String = "created_at.desc",
    ): List<JobHistoryDto>
}
