package com.example.nextstepz.chat.data.model

import com.google.gson.annotations.SerializedName

data class CreateConversationResponse (
    @SerializedName("success") val success: Boolean,
    @SerializedName("message") val message: String,
    @SerializedName("data") val data: ConversationIdData?
)
data class ConversationIdData (
    @SerializedName("conversation_id") val conversationId: String
)
data class StudentInfo(
    @SerializedName("contact_full_name") val contactFullName: String?
)

data class EmployerInfo(
    @SerializedName("employer_name") val employerName: String?
)

// Model dùng chung cho cả thông tin người gửi
data class ParticipantProfile (
    @SerializedName("id") val id: String,
    @SerializedName("full_name") val fullName: String?,
    @SerializedName("role") val role: String?,
    @SerializedName("avatar_url") val avatarUrl: String?,

    @SerializedName("students") val students: StudentInfo?,
    @SerializedName("employers") val employers: EmployerInfo?
) {
    fun getDisplayName(): String {
        val employerName = employers?.employerName
        if (!employerName.isNullOrBlank()) return employerName

        // 2. Nếu là Student có tên thật -> Lấy tên sinh viên
        val studentName = students?.contactFullName
        if (!studentName.isNullOrBlank()) return studentName

        // 3. Nếu chưa đăng ký Role gì cả -> Lấy tên đăng nhập hệ thống
        return  fullName ?: "Người dùng"
    }
}

data class MessageResponse (
    @SerializedName("success") val success: Boolean,
    @SerializedName("message") val message: String,
    @SerializedName("data") val data: List<MessageItem>?
)

data class MessageItem(
    @SerializedName("id") val id: String,
    @SerializedName("conversation_id") val conversationId: String,
    @SerializedName("sender_id") val senderId: String, // Giữ lại vòng ngoài để check isMine cực nhanh
    @SerializedName("content") val content: String,
    @SerializedName("message_type") val messageType: String?,
    @SerializedName("created_at") val createdAt: String,
    @SerializedName("is_edited") val isEdited: Boolean,
    @SerializedName("is_deleted") val isDeleted: Boolean,
    @SerializedName("sender") val sender: ParticipantProfile? // Object thông tin chi tiết người gửi
)

data class MyConversationResponse (
    @SerializedName("success") val success: Boolean,
    @SerializedName("message") val message: String,
    @SerializedName("data") val data: List<ConversationItem>?
)

data class  ConversationItem (
    @SerializedName("conversation_id") val conversationId: String,
    @SerializedName("last_read_at") val lastReadAt: String?,
    @SerializedName("conversations") val conversations: ConversationDetail
)
data class ConversationDetail (
    @SerializedName("id") val id: String,
    @SerializedName("last_message_at") val lastMessageAt: String?,
    @SerializedName("last_message_content") val lastMessageContent: String?,
    @SerializedName("type") val type: String,
    @SerializedName("participants") val participants: List<ParticipantWrapper>
)
data class ParticipantWrapper(
    @SerializedName("profiles") val profiles: ParticipantProfile?
)