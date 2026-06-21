package com.example.nextstepz.ui.screens.chat

import android.app.Application
import android.content.Context
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.chat.data.model.ChatMessageUi
import com.example.nextstepz.chat.data.model.ConversationItem
import com.example.nextstepz.chat.data.model.ConversationUi
import com.example.nextstepz.chat.data.repository.ChatRepository
import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.json.JSONObject

class ChatViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = ChatRepository(application) // Đảm bảo Repo nhận context
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
    @RequiresApi(Build.VERSION_CODES.O)
    fun fetchConversations(profileId: String) {
        _currentUserId = profileId
        viewModelScope.launch {
            _conversationsState.value = ChatUiState.Loading
            repository.getConversations().fold( // Đã xóa myProfileId theo chuẩn bảo mật
                onSuccess = { response ->
                    Log.d("CHECK_JSON", "Data từ Server: ${com.google.gson.Gson().toJson(response)}")
                    val list = response.data?.mapNotNull { item ->
                        // 1. Chốt chặn an toàn: Nếu object conversations bị null từ Server thì BỎ QUA item này luôn
                        val convDetail = item.conversations ?: return@mapNotNull null
                        val partner = convDetail.participants
                            ?.firstOrNull { it.profiles?.id != profileId }
                            ?.profiles
                        ConversationUi(
                            conversationId = item.conversations.id,
                            partnerName = partner?.getDisplayName() ?: "Người dùng",
                            partnerId = partner?.id ?: "",
                            lastMessage = item.conversations.lastMessageContent ?: "Chưa có tin nhắn",
                            lastMessageTime = item.conversations.lastMessageAt?.let { formatTime(it) } ?: "",
                            unreadCount = calculateUnread(item)
                        )
                    } ?: emptyList()
                    _conversations.value = list
                    _conversationsState.value = ChatUiState.Success(list)
                },
                onFailure = { e ->
                    _conversationsState.value = ChatUiState.Error(e.message ?: "Lỗi khi tải danh sách")
                    Log.e("ChatViewModel", "fetchConversations error: ${e.message}")
                }
            )
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
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
                            text = if (item.isDeleted) "Tin nhắn đã bị thu hồi" else item.content,
                            senderId = item.senderId, // Đã map chuẩn từ JSON
                            senderName = item.sender?.getDisplayName() ?: "Người dùng",
                            isMyMessage = item.senderId == profileId,
                            timestamp = formatTime(item.createdAt),
                            isEdited = item.isEdited,
                            isDeleted = item.isDeleted,
                            messageType = item.messageType ?: "text"
                        )
                    } ?: emptyList()
                    // Khi lấy lịch sử về thì lật ngược lại nếu UI Compose của bạn cần list từ dưới lên
                    _messages.value = list
                    _messagesState.value = ChatUiState.Success(list)
                },
                onFailure = { e ->
                    _messagesState.value = ChatUiState.Error(e.message ?: "Lỗi tải tin nhắn")
                    Log.e("ChatViewModel", "fetchMessages error: ${e.message}")
                }
            )
        }
    }
    fun createOrGetConversation(
        partnerProfileId: String,
        onResult: (String?) -> Unit
    ) {
        viewModelScope.launch {
            repository.createOrGetConversation(partnerProfileId).fold(
                onSuccess = { response ->
                    Log.d(
                        "CREATE_CHAT_RESPONSE",
                        "Response từ BE: ${com.google.gson.Gson().toJson(response)}"
                    )

                    val conversationId = response.data?.conversationId

                    Log.d(
                        "CREATE_CHAT_RESPONSE",
                        "conversationId parse được: $conversationId"
                    )

                    onResult(conversationId)
                },
                onFailure = { e ->
                    Log.e(
                        "CREATE_CHAT_RESPONSE",
                        "Lỗi gọi API create conversation: ${e.message}",
                        e
                    )

                    onResult(null)
                }
            )
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    fun connectSocket(conversationId: String, currentUserId: String) {
        _currentUserId = currentUserId
        _currentConversationId = conversationId
        try {
            val sharedPref =
                getApplication<Application>().getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
            val token = sharedPref.getString("ACCESS_TOKEN", "")

            val opts = IO.Options().apply { auth = mapOf("token" to token) }
            socket = IO.socket("http://10.0.2.2:5000", opts)

            socket?.on(Socket.EVENT_CONNECT) {
                Log.d("Chat", "Socket connected!")
                socket?.emit("join_conversation", conversationId)
            }

            // Lắng nghe tin nhắn mới
            socket?.on("receive_message") { args ->
                if (args.isNotEmpty()) {
                    try {
                        val data = args[0] as JSONObject

                        // Parse JSON cẩn thận, chọc sâu vào object sender để lấy tên
                        val content = data.optString("content", "")
                        val senderId = data.optString("sender_id", "")
                        val isDeleted = data.optBoolean("is_deleted", false)
                        val isEdited = data.optBoolean("is_edited", false)
                        val messageId = data.optString("id", java.util.UUID.randomUUID().toString())
                        val createdAt = data.optString("created_at", "")

                        val senderObject = data.optJSONObject("sender")
                        val senderName = senderObject?.optString("full_name") ?: "Người dùng"

                        val newMessage = ChatMessageUi(
                            id = messageId,
                            text = if (isDeleted) "Tin nhắn đã bị thu hồi" else content,
                            senderId = senderId,
                            senderName = senderName,
                            isMyMessage = senderId == currentUserId,
                            timestamp = formatTime(createdAt),
                            isEdited = isEdited,
                            isDeleted = isDeleted,
                            messageType = data.optString("message_type", "text")
                        )

                        // THÊM TIN NHẮN MỚI LÊN ĐẦU HOẶC CUỐI LIST TÙY VÀO UI COMPOSE CỦA BẠN
                        viewModelScope.launch(Dispatchers.Main) {
                            val currentList = _messages.value
                            _messages.value = listOf(newMessage) + currentList
                            // Nếu list trong Jetpack Compose bị ngược, đổi thành: listOf(newMessage) + currentList
                        }
                    } catch (e: Exception) {
                        Log.e("ChatApp", "LỖI PARSE JSON SOCKET: ${e.message}")
                    }
                }
            }

            // Lắng nghe Edit
            socket?.on("message_edited") { args ->
                if (args.isNotEmpty()) {
                    val data = args[0] as JSONObject
                    val messageId = data.optString("id", "")
                    val newContent = data.optString("content", "")
                    viewModelScope.launch(Dispatchers.Main) {
                        _messages.value = _messages.value.map {
                            if (it.id == messageId) it.copy(
                                text = newContent,
                                isEdited = true
                            ) else it
                        }
                    }
                }
            }

            // Lắng nghe Delete
            socket?.on("message_deleted") { args ->
                if (args.isNotEmpty()) {
                    val data = args[0] as JSONObject
                    val messageId = data.optString("id", "")
                    viewModelScope.launch(Dispatchers.Main) {
                        _messages.value = _messages.value.map {
                            if (it.id == messageId) it.copy(
                                text = "Tin nhắn đã bị thu hồi",
                                isDeleted = true
                            ) else it
                        }
                    }
                }
            }

            // NHỚ ĐỂ CONNECT Ở CUỐI CÙNG TRÁNH LỖI RACE CONDITION
            socket?.connect()

        } catch (e: Exception) {
            Log.e("Chat", "Socket error", e)
        }
    }

    fun sendMessage(content: String) {
        if (content.isBlank() || _currentConversationId.isBlank() || _currentUserId.isBlank()) return

        val messageData = JSONObject().apply {
            put("conversationId", _currentConversationId)
            put("content", content)
        }
        socket?.emit("send_message", messageData)
    }

    fun editMessage(messageId: String, newContent: String) {
        val editData = JSONObject().apply {
            put("conversationId", _currentConversationId)
            put("messageId", messageId)
            put("newContent", newContent)
        }
        socket?.emit("edit_message", editData)
    }

    fun deleteMessage(messageId: String) {
        val deleteData = JSONObject().apply {
            put("conversationId", _currentConversationId)
            put("messageId", messageId)
        }
        socket?.emit("delete_message", deleteData)
    }

    fun clearMessages() {
        _messages.value = emptyList()
        _messagesState.value = ChatUiState.Idle
    }

    @RequiresApi(Build.VERSION_CODES.O)
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

    @RequiresApi(Build.VERSION_CODES.O)
    private fun calculateUnread(item: ConversationItem): Int {
        val lastMessageTime = item.conversations?.lastMessageAt ?: return 0
        val lastReadAt = item.lastReadAt ?: return 1
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