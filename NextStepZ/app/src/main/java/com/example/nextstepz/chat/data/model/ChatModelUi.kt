package com.example.nextstepz.chat.data.model

data class ConversationUi(
    val conversationId: String,
    val partnerName: String,
    val partnerId: String,
    val lastMessage: String,
    val lastMessageTime: String,
    val unreadCount: Int
)

data class ChatMessageUi(
    val id: String,
    val text: String,
    val senderId: String,
    val senderName: String,
    val isMyMessage: Boolean,
    val timestamp: String,
    val isEdited: Boolean,
    val isDeleted: Boolean,
    val messageType: String
)
