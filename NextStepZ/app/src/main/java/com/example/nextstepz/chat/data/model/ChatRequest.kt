package com.example.nextstepz.chat.data.model

data class ChatMessage(
    val id: String = java.util.UUID.randomUUID().toString(),
    val text: String,
    val senderId: String,
    val isMyMessage: Boolean // Rất quan trọng để UI biết xếp bên trái hay phải
)