package com.example.nextstepz.ui.screens.chat

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.chat.data.model.ConversationItem
import com.example.nextstepz.chat.data.model.MessageItem
import com.example.nextstepz.chat.data.repository.ChatRepository
import com.example.nextstepz.chat.data.model.ChatMessage
import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.json.JSONObject

data class ConversationUi(
    val conversationId: String,
    val partnerName: String,
    val partnerId: String,
    val lastMessage: String,
    val lastMessageTime: String,
    val unreadCount: Int
)

sealed class ChatUiState<out T> {
    data object Idle : ChatUiState<Nothing>()
    data object Loading : ChatUiState<Nothing>()
    data class Success<T>(val data: T) : ChatUiState<T>()
    data class Error(val message: String) : ChatUiState<Nothing>()
}

class ChatViewModel : ViewModel() {
    private val repository = ChatRepository()
    private var socket: Socket? = null

    private var _currentUserId: String = ""
    private var _currentConversationId: String = ""

    private val _conversations = MutableStateFlow<List<ConversationUi>>(emptyList())
    val conversations: StateFlow<List<ConversationUi>> = _conversations.asStateFlow()

    private val _messages = MutableStateFlow<List<ChatMessageUi>>(emptyList())
    val messages: StateFlow<List<ChatMessageUi>> = _messages.asStateFlow()

    private val _conversationsState = MutableStateFlow<ChatUiState<List<ConversationUi>>>(ChatUiState.Idle)
    val conversationsState: StateFlow<ChatUiState<List<ConversationUi>>> = _conversationsState.asStateFlow()

    private val _messagesState = MutableStateFlow<ChatUiState<List<ChatMessageUi>>>(ChatUiState.Idle)
    val messagesState: StateFlow<ChatUiState<List<ChatMessageUi>>> = _messagesState.asStateFlow()

    private val _isSending = MutableStateFlow(false)
    val isSending: StateFlow<Boolean> = _isSending.asStateFlow()

    fun fetchConversations(profileId: String) {
        _currentUserId = profileId
        viewModelScope.launch {
            _conversationsState.value = ChatUiState.Loading
            repository.getConversations(profileId).fold(
                onSuccess = { response ->
                    val list = response.data?.map { item ->
                        val partner = item.conversations.participants
                            .firstOrNull { it.profiles?.id != profileId }
                            ?.profiles
                        ConversationUi(
                            conversationId = item.conversations.id,
                            partnerName = partner?.full_name ?: "Người dùng",
                            partnerId = partner?.id ?: "",
                            lastMessage = "Chưa có tin nhắn",
                            lastMessageTime = item.conversations.last_message_at?.let { formatTime(it) } ?: "",
                            unreadCount = calculateUnread(item)
                        )
                    } ?: emptyList()
                    _conversations.value = list
                    _conversationsState.value = ChatUiState.Success(list)
                },
                onFailure = { e ->
                    _conversationsState.value = ChatUiState.Error(e.message ?: "Lỗi khi tải danh sách cuộc trò chuyện")
                    Log.e("ChatViewModel", "fetchConversations error: ${e.message}")
                }
            )
        }
    }

    fun fetchMessages(conversationId: String, profileId: String) {
        _currentUserId = profileId
        _currentConversationId = conversationId
        viewModelScope.launch {
            _messagesState.value = ChatUiState.Loading
            repository.getMessages(conversationId).fold(
                onSuccess = { response ->
                    val list = response.data?.map { item ->
                        ChatMessageUi(
                            id = item.id,
                            text = if (item.is_deleted) "Tin nhắn đã bị thu hồi" else item.content,
                            senderId = item.sender?.id ?: "",
                            senderName = item.sender?.full_name ?: "Người dùng",
                            isMyMessage = item.sender?.id == profileId,
                            timestamp = formatTime(item.created_at),
                            isEdited = item.is_edited,
                            isDeleted = item.is_deleted,
                            messageType = item.message_type ?: "text"
                        )
                    } ?: emptyList()
                    _messages.value = list
                    _messagesState.value = ChatUiState.Success(list)
                },
                onFailure = { e ->
                    _messagesState.value = ChatUiState.Error(e.message ?: "Lỗi khi tải tin nhắn")
                    Log.e("ChatViewModel", "fetchMessages error: ${e.message}")
                }
            )
        }
    }

    fun connectSocket(conversationId: String, profileId: String) {
        _currentUserId = profileId
        _currentConversationId = conversationId
        try {
            val opts = IO.Options()
            socket = IO.socket("http://10.0.2.2:5000", opts)
            socket?.connect()

            socket?.on(Socket.EVENT_CONNECT) {
                Log.d("Chat", "Socket connected!")
                socket?.emit("user_connected", profileId)
                socket?.emit("join_conversation", conversationId)
            }

            socket?.on("receive_message") { args ->
                if (args.isNotEmpty()) {
                    try {
                        val data = args[0] as JSONObject
                        val content = data.optString("content", "")
                        val senderId = data.optString("sender_id", "")
                        val isDeleted = data.optBoolean("is_deleted", false)
                        val isEdited = data.optBoolean("is_edited", false)
                        val messageId = data.optString("id", java.util.UUID.randomUUID().toString())
                        val createdAt = data.optString("created_at", "")
                        val senderName = data.optString("sender_name", "Người dùng")

                        val newMessage = ChatMessageUi(
                            id = messageId,
                            text = if (isDeleted) "Tin nhắn đã bị thu hồi" else content,
                            senderId = senderId,
                            senderName = senderName,
                            isMyMessage = senderId == profileId,
                            timestamp = formatTime(createdAt),
                            isEdited = isEdited,
                            isDeleted = isDeleted,
                            messageType = data.optString("message_type", "text")
                        )

                        viewModelScope.launch(Dispatchers.Main) {
                            _messages.value = _messages.value + newMessage
                            Log.d("ChatApp", "receive_message: ${newMessage.text}")
                        }
                    } catch (e: Exception) {
                        Log.e("ChatApp", "receive_message parse error: ${e.message}")
                    }
                }
            }

            socket?.on("message_edited") { args ->
                if (args.isNotEmpty()) {
                    try {
                        val data = args[0] as JSONObject
                        val messageId = data.optString("id", "")
                        val newContent = data.optString("content", "")
                        viewModelScope.launch(Dispatchers.Main) {
                            _messages.value = _messages.value.map {
                                if (it.id == messageId) it.copy(text = newContent, isEdited = true) else it
                            }
                        }
                    } catch (e: Exception) {
                        Log.e("ChatApp", "message_edited error: ${e.message}")
                    }
                }
            }

            socket?.on("message_deleted") { args ->
                if (args.isNotEmpty()) {
                    try {
                        val data = args[0] as JSONObject
                        val messageId = data.optString("id", "")
                        viewModelScope.launch(Dispatchers.Main) {
                            _messages.value = _messages.value.map {
                                if (it.id == messageId) it.copy(text = "Tin nhắn đã bị thu hồi", isDeleted = true) else it
                            }
                        }
                    } catch (e: Exception) {
                        Log.e("ChatApp", "message_deleted error: ${e.message}")
                    }
                }
            }

            socket?.on("error_message") { args ->
                if (args.isNotEmpty()) {
                    try {
                        val data = args[0] as JSONObject
                        Log.e("ChatApp", "Socket error: ${data.optString("message", "Unknown error")}")
                    } catch (e: Exception) {
                        Log.e("ChatApp", "error_message parse error: ${e.message}")
                    }
                }
            }

        } catch (e: Exception) {
            Log.e("Chat", "Socket connection error", e)
        }
    }

    fun sendMessage(content: String) {
        if (content.isBlank() || _currentConversationId.isBlank() || _currentUserId.isBlank()) return
        _isSending.value = true
        val messageData = JSONObject().apply {
            put("conversationId", _currentConversationId)
            put("senderId", _currentUserId)
            put("content", content)
        }
        socket?.emit("send_message", messageData)
        _isSending.value = false
    }

    fun editMessage(messageId: String, newContent: String) {
        val editData = JSONObject().apply {
            put("messageId", messageId)
            put("newContent", newContent)
            put("senderId", _currentUserId)
            put("conversationId", _currentConversationId)
        }
        socket?.emit("edit_message", editData)
    }

    fun deleteMessage(messageId: String) {
        val deleteData = JSONObject().apply {
            put("messageId", messageId)
            put("senderId", _currentUserId)
            put("conversationId", _currentConversationId)
        }
        socket?.emit("delete_message", deleteData)
    }

    fun createOrGetConversation(myProfileId: String, partnerProfileId: String, onResult: (String?) -> Unit) {
        viewModelScope.launch {
            repository.createOrGetConversation(myProfileId, partnerProfileId).fold(
                onSuccess = { response ->
                    onResult(response.data)
                },
                onFailure = { e ->
                    Log.e("ChatViewModel", "createOrGetConversation error: ${e.message}")
                    onResult(null)
                }
            )
        }
    }

    fun clearMessages() {
        _messages.value = emptyList()
        _messagesState.value = ChatUiState.Idle
    }

    private fun formatTime(isoString: String): String {
        return try {
            val instant = java.time.Instant.parse(isoString)
            val formatter = java.time.format.DateTimeFormatter.ofPattern("HH:mm")
                .withZone(java.time.ZoneId.systemDefault())
            formatter.format(instant)
        } catch (e: Exception) {
            isoString.take(5)
        }
    }

    private fun calculateUnread(item: ConversationItem): Int {
        val lastMessageTime = item.conversations.last_message_at ?: return 0
        val lastReadAt = item.last_read_at ?: return 1
        return try {
            if (java.time.Instant.parse(lastMessageTime) > java.time.Instant.parse(lastReadAt)) 1 else 0
        } catch (e: Exception) {
            0
        }
    }

    override fun onCleared() {
        super.onCleared()
        socket?.disconnect()
    }
}

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
