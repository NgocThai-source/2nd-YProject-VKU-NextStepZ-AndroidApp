package com.example.nextstepz.feeds.ui.viewmodel

import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.feeds.data.model.Comment
import com.example.nextstepz.feeds.data.model.Post
import com.example.nextstepz.feeds.data.model.PostType
import com.example.nextstepz.feeds.data.model.ReportReason
import com.example.nextstepz.feeds.data.model.UserReportReason
import com.example.nextstepz.feeds.data.repository.PostRepository
import kotlinx.coroutines.launch

sealed class FeedsUiState {
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
    data class Report(val post: Post) : ModalSheetState()
    data class ProfilePreview(val post: Post) : ModalSheetState()
    data class UserReport(val post: Post, val isSubmitted: Boolean = false) : ModalSheetState()
}

class FeedsViewModel : ViewModel() {

    private val repository = PostRepository()

    private val _uiState = mutableStateOf<FeedsUiState>(FeedsUiState.Loading)
    val uiState: State<FeedsUiState> = _uiState

    private val _isRefreshing = mutableStateOf(false)
    val isRefreshing: State<Boolean> = _isRefreshing

    private val _selectedFilter = mutableStateOf<PostType?>(null)
    val selectedFilter: State<PostType?> = _selectedFilter

    private val _posts = mutableStateOf(emptyList<Post>())
    val posts: State<List<Post>> = _posts

    private val _commentSheetState = mutableStateOf<CommentSheetState>(CommentSheetState.Hidden)
    val commentSheetState: State<CommentSheetState> = _commentSheetState

    private val _modalSheetState = mutableStateOf<ModalSheetState>(ModalSheetState.Hidden)
    val modalSheetState: State<ModalSheetState> = _modalSheetState

    private val _isCreatePostSheetVisible = mutableStateOf(false)
    val isCreatePostSheetVisible: State<Boolean> = _isCreatePostSheetVisible

    init {
        loadPosts()
    }

    fun loadPosts() {
        viewModelScope.launch {
            _uiState.value = FeedsUiState.Loading
            repository.getPosts(filterType = _selectedFilter.value)
                .onSuccess { loadedPosts ->
                    _posts.value = loadedPosts
                    _uiState.value = FeedsUiState.Success(loadedPosts)
                }
                .onFailure { error ->
                    _uiState.value = FeedsUiState.Error(error.message ?: "Đã xảy ra lỗi")
                }
        }
    }

    fun refreshPosts() {
        viewModelScope.launch {
            _isRefreshing.value = true
            repository.getPosts(filterType = _selectedFilter.value)
                .onSuccess { loadedPosts ->
                    _posts.value = loadedPosts
                    _uiState.value = FeedsUiState.Success(loadedPosts)
                }
                .onFailure { error ->
                    _uiState.value = FeedsUiState.Error(error.message ?: "Đã xảy ra lỗi khi làm mới")
                }
            _isRefreshing.value = false
        }
    }

    fun setFilter(type: PostType?) {
        if (_selectedFilter.value == type) return
        _selectedFilter.value = type
        loadPosts()
    }

    fun toggleLike(postId: String) {
        viewModelScope.launch {
            repository.toggleLike(postId)
                .onSuccess { updatedPost ->
                    _posts.value = _posts.value.map { if (it.id == postId) updatedPost else it }
                    _uiState.value = FeedsUiState.Success(_posts.value)
                }
        }
    }

    fun toggleBookmark(postId: String) {
        viewModelScope.launch {
            repository.toggleBookmark(postId)
                .onSuccess { updatedPost ->
                    _posts.value = _posts.value.map { if (it.id == postId) updatedPost else it }
                    _uiState.value = FeedsUiState.Success(_posts.value)
                }
        }
    }

    fun reportPost(postId: String, reason: ReportReason, customText: String = "") {
        viewModelScope.launch {
            repository.reportPost(postId, reason, customText)
                .onSuccess { updatedPost ->
                    _posts.value = _posts.value.map { if (it.id == postId) updatedPost else it }
                    _uiState.value = FeedsUiState.Success(_posts.value)
                }
        }
    }

    fun showCommentSheet(postId: String) {
        viewModelScope.launch {
            val post = _posts.value.find { it.id == postId } ?: return@launch
            _commentSheetState.value = CommentSheetState.Shown(post, post.comments)
        }
    }

    fun hideCommentSheet() {
        _commentSheetState.value = CommentSheetState.Hidden
    }

    fun loadComments(postId: String) {
        viewModelScope.launch {
            val currentPost = _posts.value.find { it.id == postId } ?: return@launch
            _commentSheetState.value = CommentSheetState.Loading
            repository.getComments(postId)
                .onSuccess { comments ->
                    _commentSheetState.value = CommentSheetState.Shown(
                        currentPost.copy(comments = comments),
                        comments
                    )
                    _posts.value = _posts.value.map { if (it.id == postId) currentPost.copy(comments = comments) else it }
                }
        }
    }

    fun addComment(postId: String, content: String) {
        if (content.isBlank()) return
        viewModelScope.launch {
            repository.addComment(postId, content)
                .onSuccess { newComment ->
                    val post = _posts.value.find { it.id == postId } ?: return@launch
                    val updatedComments = listOf(newComment) + post.comments
                    val updatedPost = post.copy(
                        comments = updatedComments,
                        commentCount = updatedComments.size
                    )
                    _posts.value = _posts.value.map { if (it.id == postId) updatedPost else it }
                    _uiState.value = FeedsUiState.Success(_posts.value)
                    _commentSheetState.value = CommentSheetState.Shown(updatedPost, updatedComments)
                }
        }
    }

    fun showCreatePostSheet() {
        _isCreatePostSheetVisible.value = true
    }

    fun hideCreatePostSheet() {
        _isCreatePostSheetVisible.value = false
    }

    fun createPost(content: String, type: PostType, skillTags: List<String>) {
        if (content.isBlank()) return
        viewModelScope.launch {
            repository.createPost(content, type, skillTags)
                .onSuccess { newPost ->
                    _posts.value = listOf(newPost) + _posts.value
                    _uiState.value = FeedsUiState.Success(_posts.value)
                    _isCreatePostSheetVisible.value = false
                }
        }
    }

    fun showPostMenu(postId: String) {
        val post = _posts.value.find { it.id == postId } ?: return
        _modalSheetState.value = ModalSheetState.PostMenu(post)
    }

    fun showProfilePreview(postId: String) {
        val post = _posts.value.find { it.id == postId } ?: return
        _modalSheetState.value = ModalSheetState.ProfilePreview(post)
    }

    fun showReportModal(postId: String) {
        val post = _posts.value.find { it.id == postId } ?: return
        _modalSheetState.value = ModalSheetState.Report(post)
    }

    fun hideModal() {
        _modalSheetState.value = ModalSheetState.Hidden
    }

    fun onMessageClick(authorId: String) {
        hideModal()
    }

    fun toggleCommentLike(postId: String, commentId: String) {
        viewModelScope.launch {
            repository.toggleCommentLike(postId, commentId)
                .onSuccess { updatedPost ->
                    _posts.value = _posts.value.map { if (it.id == postId) updatedPost else it }
                    _uiState.value = FeedsUiState.Success(_posts.value)
                    val currentState = _commentSheetState.value
                    if (currentState is CommentSheetState.Shown) {
                        _commentSheetState.value = CommentSheetState.Shown(updatedPost, updatedPost.comments)
                    }
                }
        }
    }

    fun reportUser(authorId: String, reason: UserReportReason) {
        viewModelScope.launch {
            repository.reportUser(authorId, reason)
            val currentState = _modalSheetState.value
            if (currentState is ModalSheetState.UserReport) {
                _modalSheetState.value = currentState.copy(isSubmitted = true)
            }
        }
    }

    fun reportUserWithReason(authorId: String, reason: UserReportReason, customText: String) {
        viewModelScope.launch {
            repository.reportUser(authorId, reason, customText)
            val currentState = _modalSheetState.value
            if (currentState is ModalSheetState.UserReport) {
                _modalSheetState.value = currentState.copy(isSubmitted = true)
            }
        }
    }

    fun showUserReportModal(post: Post) {
        _modalSheetState.value = ModalSheetState.UserReport(post, isSubmitted = false)
    }
}
