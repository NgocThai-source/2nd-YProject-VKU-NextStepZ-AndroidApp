package com.example.nextstepz.ui.screens.chat

sealed class ChatUiState<out T> {
    data object Idle : ChatUiState<Nothing>()
    data object Loading : ChatUiState<Nothing>()
    data class Success<T>(val data: T) : ChatUiState<T>()
    data class Error(val message: String) : ChatUiState<Nothing>()
}