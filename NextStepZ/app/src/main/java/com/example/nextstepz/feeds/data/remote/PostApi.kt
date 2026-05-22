package com.example.nextstepz.feeds.data.remote

import com.example.nextstepz.feeds.data.model.CommentResponse
import com.example.nextstepz.feeds.data.model.CommentsResponse
import com.example.nextstepz.feeds.data.model.CreateCommentRequest
import com.example.nextstepz.feeds.data.model.CreatePostRequest
import com.example.nextstepz.feeds.data.model.InteractionResponse
import com.example.nextstepz.feeds.data.model.PostResponse
import com.example.nextstepz.feeds.data.model.PostsResponse
import com.example.nextstepz.feeds.data.model.ReportRequest
import com.example.nextstepz.feeds.data.model.UserReportRequest
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface PostApi {
    @GET("api/posts")
    suspend fun getPosts(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): PostsResponse

    @GET("api/posts/{id}")
    suspend fun getPostById(@Path("id") id: String): PostResponse

    @POST("api/posts")
    suspend fun createPost(@Body request: CreatePostRequest): PostResponse

    @POST("api/posts/{id}/like")
    suspend fun likePost(@Path("id") id: String): InteractionResponse

    @DELETE("api/posts/{id}/like")
    suspend fun unlikePost(@Path("id") id: String): InteractionResponse

    @POST("api/posts/{id}/bookmark")
    suspend fun bookmarkPost(@Path("id") id: String): InteractionResponse

    @DELETE("api/posts/{id}/bookmark")
    suspend fun unbookmarkPost(@Path("id") id: String): InteractionResponse

    @GET("api/posts/{id}/comments")
    suspend fun getComments(@Path("id") id: String): CommentsResponse

    @POST("api/posts/{id}/comments")
    suspend fun addComment(
        @Path("id") id: String,
        @Body request: CreateCommentRequest
    ): CommentResponse

    @POST("api/posts/{id}/report")
    suspend fun reportPost(
        @Path("id") id: String,
        @Body request: ReportRequest
    ): InteractionResponse

    @POST("api/users/{id}/report")
    suspend fun reportUser(
        @Path("id") id: String,
        @Body request: UserReportRequest
    ): InteractionResponse

    @POST("api/posts/{postId}/comments/{commentId}/like")
    suspend fun likeComment(
        @Path("postId") postId: String,
        @Path("commentId") commentId: String
    ): InteractionResponse

    @DELETE("api/posts/{postId}/comments/{commentId}/like")
    suspend fun unlikeComment(
        @Path("postId") postId: String,
        @Path("commentId") commentId: String
    ): InteractionResponse
}
