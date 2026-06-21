package com.example.nextstepz.posthistory.data.remote

import com.google.gson.annotations.SerializedName

/** Row of `posts` authored by the current user. */
data class PostHistoryDto(
    val id: String,
    val content: String? = null,
    val type: String? = null,
    @SerializedName("created_at") val createdAt: String? = null,
    @SerializedName("like_count") val likeCount: Int? = null,
    @SerializedName("comment_count") val commentCount: Int? = null,
    val status: String? = null,
)

/** Row of `jobs` posted by the current employer. */
data class JobHistoryDto(
    val id: String,
    val title: String? = null,
    val status: String? = null,
    @SerializedName("created_at") val createdAt: String? = null,
    @SerializedName("salary_min") val salaryMin: Int? = null,
    @SerializedName("salary_max") val salaryMax: Int? = null,
    @SerializedName("application_count") val applicationCount: Int? = null,
    val deadline: String? = null,
    @SerializedName("job_type") val jobType: String? = null,
)
