package com.example.nextstepz.notifications.data.remote

import com.google.gson.annotations.SerializedName

/** Row of the Supabase `notifications` table. */
data class NotificationDto(
    val id: Long,
    @SerializedName("user_id") val userId: String? = null,
    val category: String? = null,
    val outcome: String? = null,
    val title: String? = null,
    val message: String? = null,
    @SerializedName("reference_id") val referenceId: String? = null,
    @SerializedName("is_read") val isRead: Boolean? = null,
    @SerializedName("created_at") val createdAt: String? = null,
)
