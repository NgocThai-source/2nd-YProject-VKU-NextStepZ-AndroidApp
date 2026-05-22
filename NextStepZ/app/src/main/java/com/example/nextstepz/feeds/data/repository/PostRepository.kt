package com.example.nextstepz.feeds.data.repository

import com.example.nextstepz.feeds.data.model.Comment
import com.example.nextstepz.feeds.data.model.Post
import com.example.nextstepz.feeds.data.model.PostType
import com.example.nextstepz.feeds.data.model.ReportReason
import com.example.nextstepz.feeds.data.model.UserReportReason
import kotlinx.coroutines.delay

class PostRepository {

    private val mockPosts = MockDataProvider.getMockPosts().toMutableList()
    private var nextPostId = 11L
    private var nextCommentId = 100L

    suspend fun getPosts(
        page: Int = 1,
        limit: Int = 20,
        filterType: PostType? = null
    ): Result<List<Post>> {
        delay(600)
        val filtered = if (filterType != null) {
            mockPosts.filter { it.type == filterType }
        } else {
            mockPosts.toList()
        }
        return Result.success(filtered)
    }

    suspend fun getPostById(id: String): Result<Post?> {
        delay(300)
        return Result.success(mockPosts.find { it.id == id })
    }

    suspend fun toggleLike(postId: String): Result<Post> {
        delay(200)
        val index = mockPosts.indexOfFirst { it.id == postId }
        if (index == -1) return Result.failure(Exception("Post not found"))

        val post = mockPosts[index]
        val updatedPost = post.copy(
            isLiked = !post.isLiked,
            likeCount = if (post.isLiked) post.likeCount - 1 else post.likeCount + 1
        )
        mockPosts[index] = updatedPost
        return Result.success(updatedPost)
    }

    suspend fun toggleBookmark(postId: String): Result<Post> {
        delay(200)
        val index = mockPosts.indexOfFirst { it.id == postId }
        if (index == -1) return Result.failure(Exception("Post not found"))

        val post = mockPosts[index]
        val updatedPost = post.copy(isBookmarked = !post.isBookmarked)
        mockPosts[index] = updatedPost
        return Result.success(updatedPost)
    }

    suspend fun reportPost(postId: String, reason: ReportReason, customText: String = ""): Result<Post> {
        delay(500)
        val index = mockPosts.indexOfFirst { it.id == postId }
        if (index == -1) return Result.failure(Exception("Post not found"))

        val post = mockPosts[index]
        val updatedPost = post.copy(isReported = true)
        mockPosts[index] = updatedPost
        return Result.success(updatedPost)
    }

    suspend fun reportUser(authorId: String, reason: UserReportReason, customText: String = ""): Result<Unit> {
        delay(500)
        val postIndex = mockPosts.indexOfFirst { it.authorId == authorId }
        if (postIndex != -1) {
            val post = mockPosts[postIndex]
            mockPosts[postIndex] = post.copy(reportedUsers = post.reportedUsers + authorId)
        }
        return Result.success(Unit)
    }

    suspend fun toggleCommentLike(postId: String, commentId: String): Result<Post> {
        delay(200)
        val index = mockPosts.indexOfFirst { it.id == postId }
        if (index == -1) return Result.failure(Exception("Post not found"))

        val post = mockPosts[index]
        val updatedComments = post.comments.map { comment ->
            if (comment.id == commentId) {
                comment.copy(
                    isLiked = !comment.isLiked,
                    likeCount = if (comment.isLiked) comment.likeCount - 1 else comment.likeCount + 1
                )
            } else comment
        }
        val updatedPost = post.copy(comments = updatedComments)
        mockPosts[index] = updatedPost
        return Result.success(updatedPost)
    }

    suspend fun getComments(postId: String): Result<List<Comment>> {
        delay(500)
        val post = mockPosts.find { it.id == postId }
        return Result.success(post?.comments ?: emptyList())
    }

    suspend fun addComment(postId: String, content: String): Result<Comment> {
        delay(400)
        val index = mockPosts.indexOfFirst { it.id == postId }
        if (index == -1) return Result.failure(Exception("Post not found"))

        val newComment = Comment(
            id = "c_${nextCommentId++}",
            authorName = "Bạn",
            authorAvatar = null,
            content = content,
            createdAt = "2026-05-22T04:00:00Z",
            likeCount = 0,
            isLiked = false
        )

        val post = mockPosts[index]
        val updatedComments = listOf(newComment) + post.comments
        val updatedPost = post.copy(
            comments = updatedComments,
            commentCount = updatedComments.size
        )
        mockPosts[index] = updatedPost
        return Result.success(newComment)
    }

    suspend fun createPost(
        content: String,
        type: PostType,
        skillTags: List<String>
    ): Result<Post> {
        delay(600)
        val newPost = Post(
            id = "post_${nextPostId++}",
            authorId = "current_user",
            authorName = "Bạn",
            authorAvatar = null,
            authorRole = "Sinh viên CNTT - VKU",
            type = type,
            content = content,
            images = emptyList(),
            skillTags = skillTags,
            likeCount = 0,
            commentCount = 0,
            isLiked = false,
            isBookmarked = false,
            createdAt = "2026-05-22T04:00:00Z",
            comments = emptyList()
        )
        mockPosts.add(0, newPost)
        return Result.success(newPost)
    }
}
