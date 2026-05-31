package com.example.nextstepz.chat.data.model

data class ConversationResponse(
    val success: Boolean,
    val message: String,
    val data: List<ConversationItem>?
)

data class ConversationItem(
    val conversation_id: String,
    val last_read_at: String?,
    val conversations: ConversationData
)

data class ConversationData(
    val id: String,
    val last_message_at: String?,
    val type: String,
    val participants: List<ParticipantWrapper>
)

data class ParticipantWrapper(
    val profiles: ParticipantProfile?
)

data class ParticipantProfile(
    val id: String,
    val full_name: String?,
    val role: String?
)

data class MessageResponse(
    val success: Boolean,
    val message: String,
    val data: List<MessageItem>?
)

data class MessageItem(
    val id: String,
    val content: String,
    val message_type: String?,
    val created_at: String,
    val is_edited: Boolean,
    val is_deleted: Boolean,
    val sender: ParticipantProfile?
)

data class CreateConversationRequest(
    val myProfileId: String,
    val partnerProfileId: String
)

data class CreateConversationResponse(
    val success: Boolean,
    val message: String,
    val data: String?
)
