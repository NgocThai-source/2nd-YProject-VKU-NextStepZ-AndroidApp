package com.example.nextstepz.feeds.data.model

enum class UserRole {
    Guest,
    Student,
    Employer
}

data class UserProfile(
    val id: String,
    val name: String,
    val avatar: String? = null,
    val email: String,
    val phone: String,
    val role: UserRole
)

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

data class CreatePostRequest(
    val content: String,
    val type: String,
    val skillTags: List<String> = emptyList()
)

data class CreateCommentRequest(
    val content: String
)

data class CommentsResponse(
    val success: Boolean,
    val message: String,
    val comments: List<Comment>
)

data class CommentResponse(
    val success: Boolean,
    val message: String,
    val comment: Comment?
)

data class InteractionResponse(
    val success: Boolean,
    val message: String
)

data class ReportRequest(
    val postId: String,
    val reason: String
)

data class UserReportRequest(
    val userId: String,
    val reason: String
)

enum class ReportReason(val label: String) {
    Spam("Spam hoặc quảng cáo"),
    Harassment("Bắt nạt hoặc quấy rối"),
    Misinformation("Thông tin sai lệch"),
    Inappropriate("Nội dung không phù hợp"),
    Other("Khác")
}

enum class UserReportReason(val label: String) {
    FakeAccount("Tài khoản giả mạo"),
    Harassment("Quấy rối hoặc lăng mạ"),
    Inappropriate("Hành vi không phù hợp"),
    Spam("Spam hoặc lừa đảo"),
    Other("Khác")
}
