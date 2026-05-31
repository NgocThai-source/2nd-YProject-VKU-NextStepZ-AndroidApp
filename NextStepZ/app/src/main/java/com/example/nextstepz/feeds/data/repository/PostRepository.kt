package com.example.nextstepz.feeds.data.repository

import android.content.Context
import com.example.nextstepz.auth.data.remote.RetrofitClientPost
import com.example.nextstepz.feeds.data.model.BookmarkedPostsResponse
import com.example.nextstepz.feeds.data.model.CommentResponse
import com.example.nextstepz.feeds.data.model.CommentsResponse
import com.example.nextstepz.feeds.data.model.CreateCommentRequest
import com.example.nextstepz.feeds.data.model.CreatePostRequest
import com.example.nextstepz.feeds.data.model.InteractionResponse
import com.example.nextstepz.feeds.data.model.PostResponse
import com.example.nextstepz.feeds.data.model.PostsResponse
import com.example.nextstepz.feeds.data.model.ReportRequest
import com.example.nextstepz.feeds.data.model.UserReportRequest
import com.example.nextstepz.feeds.data.remote.PostApi

class PostRepository(
    private val context: Context
) {
    suspend fun createPost(request: CreatePostRequest): PostResponse {
        return RetrofitClientPost.getApiInterface(context).createPost(request)
    }

    suspend fun getPosts(page: Int = 1, limit: Int = 20, type: String? = null, bookmarkedOnly: Boolean = false): PostsResponse {
        return RetrofitClientPost.getApiInterface(context).getPosts(page = page, limit = limit, type = type, bookmarkedOnly = bookmarkedOnly)
    }

    suspend fun addComments(postId: String, request: CreateCommentRequest): CommentResponse {
        return RetrofitClientPost.getApiInterface(context).addComment(postId, request)
    }
    suspend fun getComments(postId: String): CommentsResponse {
        return RetrofitClientPost.getApiInterface(context).getComments(postId)
    }

    suspend fun likeComment(postId: String, commentId: String): InteractionResponse {
        return RetrofitClientPost.getApiInterface(context).likeComment(postId, commentId)
    }

    suspend fun unlikeComment(postId: String, commentId: String): InteractionResponse {
        return RetrofitClientPost.getApiInterface(context).unlikeComment(postId, commentId)
    }

    suspend fun likePost(postId: String): InteractionResponse {
        return RetrofitClientPost.getApiInterface(context).likePost(postId)
    }
    suspend fun unlikePost(postId: String): InteractionResponse {
        return RetrofitClientPost.getApiInterface(context).unlikePost(postId)
    }
    suspend fun reportPost(postId: String, request: ReportRequest) : InteractionResponse {
        return RetrofitClientPost.getApiInterface(context).reportPost(postId, request)
    }
    suspend fun reportUser(userId: String, request: UserReportRequest) : InteractionResponse {
        return RetrofitClientPost.getApiInterface(context).reportUser(userId, request)
    }

    suspend fun bookmarkPost(postId: String): InteractionResponse {
        return RetrofitClientPost.getApiInterface(context).bookmarkPost(postId)
    }
    suspend fun unbookmarkPost(postId: String): InteractionResponse {
        return RetrofitClientPost.getApiInterface(context).unbookmarkPost(postId)
    }
}

//    suspend fun getPostById(id: String): Result<Post?> {
//        return try {
//            val response = postApi.getPostById(id)
//
//            if (response.success) {
//                Result.success(response.post)
//            } else {
//                Result.failure(Exception(response.message))
//            }
//        } catch (e: Exception) {
//            Result.failure(e)
//        }
//    }
