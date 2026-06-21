package com.example.nextstepz.notifications.data.remote

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PATCH
import retrofit2.http.Query

/**
 * PostgREST surface for the `notifications` table.
 * `user_id` / `id` / `is_read` are passed as pre-formatted PostgREST filters
 * (e.g. "eq.<uuid>").
 */
interface NotificationApi {

    @GET("rest/v1/notifications")
    suspend fun getNotifications(
        @Query(value = "user_id", encoded = true) userId: String,
        @Query(value = "select", encoded = true) select: String = "*",
        @Query(value = "order", encoded = true) order: String = "created_at.desc",
    ): List<NotificationDto>

    /** Lightweight query for the unread badge — only ids of unread rows. */
    @GET("rest/v1/notifications")
    suspend fun getUnread(
        @Query(value = "user_id", encoded = true) userId: String,
        @Query(value = "is_read", encoded = true) isRead: String = "eq.false",
        @Query(value = "select", encoded = true) select: String = "id",
    ): List<NotificationDto>

    @PATCH("rest/v1/notifications")
    suspend fun markRead(
        @Query(value = "id", encoded = true) id: String,
        @Body body: Map<String, @JvmSuppressWildcards Any?>,
        @Header("Prefer") prefer: String = "return=minimal",
    ): Response<Unit>

    @PATCH("rest/v1/notifications")
    suspend fun markAllRead(
        @Query(value = "user_id", encoded = true) userId: String,
        @Query(value = "is_read", encoded = true) isRead: String,
        @Body body: Map<String, @JvmSuppressWildcards Any?>,
        @Header("Prefer") prefer: String = "return=minimal",
    ): Response<Unit>
}
