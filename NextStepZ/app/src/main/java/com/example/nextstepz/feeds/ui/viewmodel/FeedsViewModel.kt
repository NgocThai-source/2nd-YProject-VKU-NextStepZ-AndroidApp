package com.example.nextstepz.feeds.ui.viewmodel

import android.app.Application
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.auth.data.local.TokenManager
import com.example.nextstepz.feeds.data.model.Comment
import com.example.nextstepz.feeds.data.model.CreateCommentRequest
import com.example.nextstepz.feeds.data.model.CreatePostRequest
import com.example.nextstepz.feeds.data.model.Post
import com.example.nextstepz.feeds.data.model.PostType
import com.example.nextstepz.feeds.data.model.ReportReason
import com.example.nextstepz.feeds.data.model.ReportRequest
import com.example.nextstepz.feeds.data.model.UserReportReason
import com.example.nextstepz.feeds.data.model.UserReportRequest
import com.example.nextstepz.feeds.data.repository.PostRepository
import kotlinx.coroutines.launch
import org.json.JSONObject
import retrofit2.HttpException

sealed class FeedsUiState {
    object Idle : FeedsUiState()
    object Loading : FeedsUiState()
    data class Success(val posts: List<Post>) : FeedsUiState()
    data class Error(val message: String) : FeedsUiState()
}

sealed class CommentSheetState {
    object Hidden : CommentSheetState()
    object Loading : CommentSheetState()
    data class Shown(val post: Post, val comments: List<Comment>) : CommentSheetState()
}

sealed class ModalSheetState {
    object Hidden : ModalSheetState()
    data class PostMenu(val post: Post) : ModalSheetState()
    data class Report(val post: Post, val isSubmitting: Boolean = false, val isSubmitted: Boolean = false, val errorMessage: String? = null) : ModalSheetState()
    data class ProfilePreview(val post: Post) : ModalSheetState()
    data class UserReport(val post: Post, val isSubmitting: Boolean = false, val isSubmitted: Boolean = false, val errorMessage: String? = null) : ModalSheetState()
}

class FeedsViewModel(
    application: Application
) : AndroidViewModel(application) {

    private val postRepository = PostRepository(application)

    private val _uiState = mutableStateOf<FeedsUiState>(FeedsUiState.Idle)
    val uiState: State<FeedsUiState> = _uiState

    private val _isRefreshing = mutableStateOf(false)
    val isRefreshing: State<Boolean> = _isRefreshing

    private val _selectedFilter = mutableStateOf<PostType?>(null)
    val selectedFilter: State<PostType?> = _selectedFilter

    private val _posts = mutableStateOf(emptyList<Post>())
    val posts: State<List<Post>> = _posts

    private val _modalSheetState = mutableStateOf<ModalSheetState>(ModalSheetState.Hidden)
    val modalSheetState: State<ModalSheetState> = _modalSheetState

    private val _isCreatePostSheetVisible = mutableStateOf(false)
    val isCreatePostSheetVisible: State<Boolean> = _isCreatePostSheetVisible

    private val _commentSheetState = mutableStateOf<CommentSheetState>(CommentSheetState.Hidden)
    val commentSheetState: State<CommentSheetState> = _commentSheetState

    private val processingCommentLikeIds = mutableSetOf<String>()

    private val processingBookmarkPostIds = mutableSetOf<String>()
    private val tokenManager = TokenManager(application)
    init {
        loadPosts()
    }

    fun showCommentSheet(postId: String) {
        loadComments(postId)
    }

    fun hideCommentSheet() {
        _commentSheetState.value = CommentSheetState.Hidden
    }

    fun addComment(postId: String, content: String) {
        if (content.isBlank()) {
            _uiState.value = FeedsUiState.Error("Nội dung bình luận không được để trống")
            return
        }
        viewModelScope.launch {
            try {
                val response = postRepository.addComments(postId, request = CreateCommentRequest(content = content))
                if (response.success && response.comment != null) {
                    val currentPost = _posts.value.find { it.id == postId } ?: return@launch
                    val currentComments = currentPost.comments
                    val updatedComments = listOf(response.comment) + currentComments

                    val updatedPost = currentPost.copy(
                        comments = updatedComments,
                        commentCount = updatedComments.size
                    )

                    _posts.value = _posts.value.map {
                        if (it.id == postId) updatedPost else it
                    }

                    _uiState.value = FeedsUiState.Success(_posts.value)

                    _commentSheetState.value = CommentSheetState.Shown(
                        post = updatedPost,
                        comments = updatedComments
                    )
                }
            }catch (e: Exception) {

            }
        }
    }
    fun loadComments(postId: String) {
        viewModelScope.launch {
            val currentPost = _posts.value.find { it.id == postId } ?: return@launch

            _commentSheetState.value = CommentSheetState.Loading

            try {
                val response = postRepository.getComments(postId)

                if (response.success) {
                    val updatedPost = currentPost.copy(comments = response.comments, commentCount = response.comments.size)

                    _posts.value = _posts.value.map {
                        if (it.id == postId) updatedPost else it
                    }

                    _commentSheetState.value = CommentSheetState.Shown(
                        post = updatedPost,
                        comments = response.comments
                    )
                } else {
                    _commentSheetState.value = CommentSheetState.Shown(
                        post = currentPost,
                        comments = emptyList()
                    )
                }
            } catch (e: Exception) {
                _commentSheetState.value = CommentSheetState.Shown(
                    post = currentPost,
                    comments = emptyList()
                )
            }
        }
    }

    private fun getErrorMessage(e: Exception): String {
        return if (e is HttpException) {
            val errorBodyString = e.response()?.errorBody()?.string()

            try {
                JSONObject(errorBodyString ?: "")
                    .optString("message", "Không thể thực hiện yêu cầu")
            } catch (_: Exception) {
                "Không thể đọc phản hồi từ server"
            }
        } else {
            e.message ?: "Đã xảy ra lỗi kết nối"
        }
    }

    fun createPost(content: String, type: PostType, skillTags: List<String>) {
        if (content.isBlank()) {
            _uiState.value = FeedsUiState.Error("Nội dung bài viết không được để trống")
            return
        }

        viewModelScope.launch {
            try {
                val request = CreatePostRequest(
                    content = content,
                    type = type.name,
                    skillTags = skillTags
                )

                val response = postRepository.createPost(request)

                if (response.success && response.post != null) {
                    val newPosts = listOf(response.post) + _posts.value

                    _posts.value = newPosts
                    _uiState.value = FeedsUiState.Success(newPosts)
                    _isCreatePostSheetVisible.value = false
                } else {
                    _uiState.value = FeedsUiState.Error(response.message)
                }
            } catch (e: Exception) {
                _uiState.value = FeedsUiState.Error(getErrorMessage(e))
            }
        }
    }

    fun loadPosts() {
        viewModelScope.launch {
            _uiState.value = FeedsUiState.Loading

            try {
                val response = postRepository.getPosts(
                    page = 1,
                    limit = 20,
                    type = _selectedFilter.value?.name
                )

                if (response.success) {
                    _posts.value = response.posts
                    _uiState.value = FeedsUiState.Success(response.posts)
                } else {
                    _uiState.value = FeedsUiState.Error(response.message)
                }
            } catch (e: Exception) {
                _uiState.value = FeedsUiState.Error(getErrorMessage(e))
            }
        }
    }

    fun refreshPosts() {
        viewModelScope.launch {
            _isRefreshing.value = true

            try {
                val response = postRepository.getPosts(
                    page = 1,
                    limit = 20,
                    type = _selectedFilter.value?.name
                )

                if (response.success) {
                    _posts.value = response.posts
                    _uiState.value = FeedsUiState.Success(response.posts)
                } else {
                    _uiState.value = FeedsUiState.Error(response.message)
                }
            } catch (e: Exception) {
                _uiState.value = FeedsUiState.Error(getErrorMessage(e))
            } finally {
                _isRefreshing.value = false
            }
        }
    }

    fun toggleLike(postId: String) {
        val currentPost = _posts.value.find { it.id == postId } ?: return

        viewModelScope.launch {
            try {
                val response = if (currentPost.isLiked) {
                    postRepository.unlikePost(postId)
                } else {
                    postRepository.likePost(postId)
                }

                if (response.success) {
                    val newIsLiked = response.isLiked ?: !currentPost.isLiked

                    val newLikeCount = response.likeCount ?: if (newIsLiked) {
                        currentPost.likeCount + 1
                    } else {
                        (currentPost.likeCount - 1).coerceAtLeast(0)
                    }

                    val updatedPost = currentPost.copy(
                        isLiked = newIsLiked,
                        likeCount = newLikeCount
                    )

                    val updatedPosts = _posts.value.map { post ->
                        if (post.id == postId) updatedPost else post
                    }

                    _posts.value = updatedPosts
                    _uiState.value = FeedsUiState.Success(updatedPosts)
                }
            } catch (e: Exception) {
                println("Like post error: ${e.message}")
            }
        }
    }

    fun toggleCommentLike(
        postId: String,
        commentId: String
    ) {
        val actionKey = "$postId-$commentId"

        if (!processingCommentLikeIds.add(actionKey)) return

        val currentPost = _posts.value.find { it.id == postId }

        val currentComment = currentPost
            ?.comments
            ?.find { it.id == commentId }

        if (currentPost == null || currentComment == null) {
            processingCommentLikeIds.remove(actionKey)
            return
        }

        val isUnlikeAction = currentComment.isLiked

        viewModelScope.launch {
            try {
                val response = if (isUnlikeAction) {
                    postRepository.unlikeComment(
                        postId = postId,
                        commentId = commentId
                    )
                } else {
                    postRepository.likeComment(
                        postId = postId,
                        commentId = commentId
                    )
                }

                if (response.success) {
                    val latestPost = _posts.value.find { it.id == postId }
                        ?: return@launch

                    val latestComment = latestPost.comments.find { it.id == commentId }
                        ?: return@launch

                    val newIsLiked = response.isLiked ?: !isUnlikeAction

                    val fallbackLikeCount = if (newIsLiked) {
                        latestComment.likeCount + 1
                    } else {
                        (latestComment.likeCount - 1).coerceAtLeast(0)
                    }

                    val newLikeCount = response.likeCount ?: fallbackLikeCount

                    val updatedComments = latestPost.comments.map { comment ->
                        if (comment.id == commentId) {
                            comment.copy(
                                isLiked = newIsLiked,
                                likeCount = newLikeCount
                            )
                        } else {
                            comment
                        }
                    }

                    val updatedPost = latestPost.copy(
                        comments = updatedComments
                    )

                    val updatedPosts = _posts.value.map { post ->
                        if (post.id == postId) updatedPost else post
                    }

                    _posts.value = updatedPosts
                    _uiState.value = FeedsUiState.Success(updatedPosts)

                    val currentSheetState = _commentSheetState.value

                    if (
                        currentSheetState is CommentSheetState.Shown &&
                        currentSheetState.post.id == postId
                    ) {
                        _commentSheetState.value = currentSheetState.copy(
                            post = updatedPost,
                            comments = updatedComments
                        )
                    }
                }
            } catch (e: Exception) {
                println("Like comment error: ${getErrorMessage(e)}")
            } finally {
                processingCommentLikeIds.remove(actionKey)
            }
        }
    }

    fun toggleBookmark(postId: String) {
        if(!processingBookmarkPostIds.add(postId)) return

        val currentPost = _posts.value.find { it.id == postId } ?: run {
            processingBookmarkPostIds.remove(postId)
            return
        }
        viewModelScope.launch {
            try {
                val response  = if (currentPost.isBookmarked) {
                    postRepository.unbookmarkPost(postId)
                }else {
                    postRepository.bookmarkPost(postId)
                }
                if(response.success) {
                    val updatedPost = currentPost.copy(isBookmarked = response.isBookmarked ?: !currentPost.isBookmarked)
                    val updatedPosts = _posts.value.map {
                        post -> if(post.id == postId) updatedPost else post
                    }
                    _posts.value = updatedPosts
                    _uiState.value = FeedsUiState.Success(updatedPosts)
                }
            }catch (e: Exception) {
                processingBookmarkPostIds.remove(postId)
            }
        }
    }
    fun reportPost(
        postId: String,
        reason: ReportReason,
        customText: String = ""
    ) {
        val currentState =
            _modalSheetState.value as? ModalSheetState.Report ?: return

        viewModelScope.launch {
            _modalSheetState.value = currentState.copy(
                isSubmitting = true,
                isSubmitted = false,
                errorMessage = null
            )

            try {
                val response = postRepository.reportPost(
                    postId = postId,
                    request = ReportRequest(
                        reason = reason.name,
                        customText = customText
                    )
                )

                if (response.success) {
                    val updatedPosts = _posts.value.map { post ->
                        if (post.id == postId) {
                            post.copy(isReported = true)
                        } else {
                            post
                        }
                    }

                    _posts.value = updatedPosts
                    _uiState.value = FeedsUiState.Success(updatedPosts)

                    val updatedPost = updatedPosts.find { it.id == postId }
                        ?: currentState.post

                    _modalSheetState.value = currentState.copy(
                        post = updatedPost,
                        isSubmitting = false,
                        isSubmitted = true,
                        errorMessage = null
                    )
                } else {
                    _modalSheetState.value = currentState.copy(
                        isSubmitting = false,
                        isSubmitted = false,
                        errorMessage = response.message
                    )
                }

            } catch (e: Exception) {
                _modalSheetState.value = currentState.copy(
                    isSubmitting = false,
                    isSubmitted = false,
                    errorMessage = getErrorMessage(e)
                )
            }
        }
    }

    fun reportUser(
        userId: String,
        reason: UserReportReason,
        customText: String = ""
    ) {
        val currentState =
            _modalSheetState.value as? ModalSheetState.UserReport ?: return

        viewModelScope.launch {
            _modalSheetState.value = currentState.copy(
                isSubmitting = true,
                isSubmitted = false,
                errorMessage = null
            )

            try {
                val response = postRepository.reportUser(
                    userId = userId,
                    request = UserReportRequest(
                        reason = reason.name,
                        customText = customText
                    )
                )

                if (response.success) {
                    val updatedPosts = _posts.value.map { post ->
                        if (post.authorId == userId) {
                            post.copy(
                                reportedUsers = post.reportedUsers + userId
                            )
                        } else {
                            post
                        }
                    }

                    _posts.value = updatedPosts
                    _uiState.value = FeedsUiState.Success(updatedPosts)

                    val updatedPost = updatedPosts.find { it.id == currentState.post.id }
                        ?: currentState.post

                    _modalSheetState.value = currentState.copy(
                        post = updatedPost,
                        isSubmitting = false,
                        isSubmitted = true,
                        errorMessage = null
                    )
                } else {
                    _modalSheetState.value = currentState.copy(
                        isSubmitting = false,
                        isSubmitted = false,
                        errorMessage = response.message
                    )
                }
            } catch (e: Exception) {
                _modalSheetState.value = currentState.copy(
                    isSubmitting = false,
                    isSubmitted = false,
                    errorMessage = getErrorMessage(e)
                )
            }
        }
    }
    fun setFilter(type: PostType?) {
        if (_selectedFilter.value == type) return

        _selectedFilter.value = type
        loadPosts()
    }

    fun showCreatePostSheet() {
        val role = tokenManager.userRole;
        if(role == "student" || role == "employer") {
            _isCreatePostSheetVisible.value = true
        }else {
            _uiState.value = FeedsUiState.Error("Bạn cần đăng ký thông tin Sinh viên hoặc Nhà tuyển dụng để sử dụng tính năng này.")
        }
    }

    fun hideCreatePostSheet() {
        _isCreatePostSheetVisible.value = false
    }

    fun showPostMenu(postId: String) {
        val post = _posts.value.find { it.id == postId } ?: return
        _modalSheetState.value = ModalSheetState.PostMenu(post)
    }

    fun showProfilePreview(postId: String) {
        val currentPost = _posts.value.find { it.id == postId } ?: return
        _modalSheetState.value = ModalSheetState.ProfilePreview(currentPost)
    }

    fun showReportModal(postId: String) {
        val post = _posts.value.find { it.id == postId } ?: return
        _modalSheetState.value = ModalSheetState.Report(post)
    }

    fun hideModal() {
        _modalSheetState.value = ModalSheetState.Hidden
    }


    fun showUserReportModal(post: Post) {
        _modalSheetState.value = ModalSheetState.UserReport(post)
    }
}