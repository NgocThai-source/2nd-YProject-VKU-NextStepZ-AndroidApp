package com.example.nextstepz.feeds.data.model
data class PostsResponse(
    val success: Boolean,
    val message: String,
    val posts: List<Post>,
    val page: Int,
    val totalPages: Int
)

data class PostResponse(
    val success: Boolean,
    val message: String,
    val post: Post?
)

data class CommentsResponse(
    val success: Boolean,
    val message: String,
    val comments: List<Comment>
)
//
data class CommentResponse(
    val success: Boolean,
    val message: String,
    val comment: Comment?
)

data class BookmarkedPostsResponse(
    val success: Boolean,
    val message: String,
    val posts: List<Post>
)
data class InteractionResponse(
    val success: Boolean,
    val message: String,
    val isLiked: Boolean? = null,
    val isBookmarked: Boolean? = null,
    val likeCount: Int? = null
)