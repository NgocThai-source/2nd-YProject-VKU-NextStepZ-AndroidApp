package com.example.nextstepz.ui.screens.account

import com.example.nextstepz.feeds.data.model.Post
import com.example.nextstepz.feeds.jobs.data.model.Job

enum class FavoriteTab {
    FEEDS,
    JOBS
}

sealed class FavoritesUiState {
    object Loading : FavoritesUiState()
    data class Success(
        val feedBookmarks: List<Post>,
        val jobBookmarks: List<Job>
    ) : FavoritesUiState()
    data class Error(val message: String) : FavoritesUiState()
}
