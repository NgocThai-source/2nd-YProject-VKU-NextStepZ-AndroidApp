package com.example.nextstepz.feeds.data.model

enum class PostType {
    Article,
    Job,
    Tips,
    Story
}

enum class UserRole {
    Student,
    Employer,
    Guest
}

data class Comment(
    val id: String,
    val authorName: String,
    val authorAvatar: String?,
    val content: String,
    val createdAt: String,
    val likeCount: Int,
    val isLiked: Boolean = false
)

data class Post(
    val id: String,
    val authorId: String,
    val authorName: String,
    val authorAvatar: String?,
    val authorRole: String?,
    val type: PostType,
    val content: String,
    val images: List<String> = emptyList(),
    val skillTags: List<String> = emptyList(),
    val likeCount: Int,
    val commentCount: Int,
    val isLiked: Boolean,
    val isBookmarked: Boolean,
    val isReported: Boolean = false,
    val createdAt: String,
    val comments: List<Comment> = emptyList(),
    val authorEmail: String = "",
    val authorPhone: String = "",
    val authorUserRole: UserRole = UserRole.Guest,
    val reportedUsers: Set<String> = emptySet()
)