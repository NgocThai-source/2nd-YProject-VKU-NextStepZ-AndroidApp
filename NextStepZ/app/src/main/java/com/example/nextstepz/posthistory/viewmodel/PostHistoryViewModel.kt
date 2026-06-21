package com.example.nextstepz.posthistory.viewmodel

import android.app.Application
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.auth.data.local.TokenManager
import com.example.nextstepz.posthistory.data.model.JobHistoryItem
import com.example.nextstepz.posthistory.data.model.PostHistoryItem
import com.example.nextstepz.posthistory.data.repository.PostHistoryRepository
import kotlinx.coroutines.launch

data class PostHistoryUiState(
    val isLoading: Boolean = true,
    val isRefreshing: Boolean = false,
    val isEmployer: Boolean = false,
    val signedOut: Boolean = false,
    val posts: List<PostHistoryItem> = emptyList(),
    val jobs: List<JobHistoryItem> = emptyList(),
    val error: String? = null,
)

class PostHistoryViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = PostHistoryRepository()
    private val tokenManager = TokenManager(application)

    private val _uiState = mutableStateOf(PostHistoryUiState())
    val uiState: State<PostHistoryUiState> = _uiState

    private fun userId(): String? = tokenManager.userId?.takeIf { it.isNotBlank() }
    private fun isEmployer(): Boolean = tokenManager.userRole.equals("employer", ignoreCase = true)

    init {
        load(showLoading = true)
    }

    fun refresh() = load(showLoading = false)

    private fun load(showLoading: Boolean) {
        val uid = userId()
        val employer = isEmployer()
        if (uid == null) {
            _uiState.value = PostHistoryUiState(isLoading = false, signedOut = true)
            return
        }
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = showLoading,
                isRefreshing = !showLoading,
                isEmployer = employer,
                error = null,
            )
            try {
                val posts = repository.getPosts(uid)
                val jobs = if (employer) repository.getJobs(uid) else emptyList()
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    isRefreshing = false,
                    isEmployer = employer,
                    posts = posts,
                    jobs = jobs,
                    error = null,
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    isRefreshing = false,
                    error = e.message ?: "Không tải được lịch sử bài đăng",
                )
            }
        }
    }
}
