package com.example.nextstepz.ui.screens.account

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.feeds.data.model.Post
import com.example.nextstepz.feeds.data.repository.PostRepository
import com.example.nextstepz.feeds.jobs.data.model.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.json.JSONObject
import retrofit2.HttpException

class FavoritesViewModel(
    application: Application
) : AndroidViewModel(application) {

    private val postRepository = PostRepository(application.applicationContext)

    private val _uiState =
        MutableStateFlow<FavoritesUiState>(FavoritesUiState.Loading)
    val uiState: StateFlow<FavoritesUiState> = _uiState.asStateFlow()

    private val _isRefreshing = MutableStateFlow(false)
    val isRefreshing: StateFlow<Boolean> = _isRefreshing.asStateFlow()

    private val _selectedTab = MutableStateFlow(FavoriteTab.FEEDS)
    val selectedTab: StateFlow<FavoriteTab> = _selectedTab.asStateFlow()

    private val _feedBookmarks = MutableStateFlow<List<Post>>(emptyList())

    // Chưa nối API bookmark việc làm thì tạm để rỗng
    private val _jobBookmarks = MutableStateFlow<List<Job>>(emptyList())

    fun loadData() {
        viewModelScope.launch {
            _uiState.value = FavoritesUiState.Loading

            try {
                val response = postRepository.getPosts(
                    page = 1,
                    limit = 50,
                    bookmarkedOnly = true
                )

                if (response.success) {
                    _feedBookmarks.value = response.posts
                    publishSuccessState()
                } else {
                    _uiState.value = FavoritesUiState.Error(response.message)
                }
            } catch (e: Exception) {
                _uiState.value = FavoritesUiState.Error(getErrorMessage(e))
            }
        }
    }

    fun refresh() {
        viewModelScope.launch {
            _isRefreshing.value = true

            try {
                val response = postRepository.getPosts(
                    page = 1,
                    limit = 50,
                    bookmarkedOnly = true
                )

                if (response.success) {
                    _feedBookmarks.value = response.posts
                    publishSuccessState()
                } else {
                    _uiState.value = FavoritesUiState.Error(response.message)
                }
            } catch (e: Exception) {
                _uiState.value = FavoritesUiState.Error(getErrorMessage(e))
            } finally {
                _isRefreshing.value = false
            }
        }
    }

    fun selectTab(tab: FavoriteTab) {
        _selectedTab.value = tab
    }

    fun removeFeedBookmark(postId: String) {
        viewModelScope.launch {
            try {
                val response = postRepository.unbookmarkPost(postId)

                if (response.success) {
                    _feedBookmarks.value =
                        _feedBookmarks.value.filter { post -> post.id != postId }

                    publishSuccessState()
                } else {
                    _uiState.value = FavoritesUiState.Error(response.message)
                }
            } catch (e: Exception) {
                _uiState.value = FavoritesUiState.Error(getErrorMessage(e))
            }
        }
    }

    fun removeJobBookmark(jobId: String) {
        _jobBookmarks.value =
            _jobBookmarks.value.filter { job -> job.id != jobId }

        publishSuccessState()
    }

    private fun publishSuccessState() {
        _uiState.value = FavoritesUiState.Success(
            feedBookmarks = _feedBookmarks.value,
            jobBookmarks = _jobBookmarks.value
        )
    }

    private fun getErrorMessage(e: Exception): String {
        return if (e is HttpException) {
            val errorBodyString = e.response()?.errorBody()?.string()

            try {
                JSONObject(errorBodyString ?: "")
                    .optString("message", "Không thể tải danh sách yêu thích")
            } catch (_: Exception) {
                "Không thể đọc phản hồi từ server"
            }
        } else {
            e.message ?: "Không thể kết nối đến server"
        }
    }
}