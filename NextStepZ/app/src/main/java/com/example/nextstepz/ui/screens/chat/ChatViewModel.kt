package com.example.nextstepz.ui.screens.chat
import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.chat.data.model.ChatMessage
import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.json.JSONObject

class ChatViewModel(application: Application) : AndroidViewModel(application) {
    private var socket: Socket? = null

    // Danh sách tin nhắn để UI lắng nghe
    private val _messages = MutableStateFlow<List<ChatMessage>>(emptyList())
    val messages: StateFlow<List<ChatMessage>> = _messages.asStateFlow()

    fun connectSocket(conversationId: String, currentUserId: String) {
        try {
            //Lấy Token từ bộ nhớ ra
            val sharedPref = getApplication<Application>().getSharedPreferences("AppPrefs", Application.MODE_PRIVATE)
            val token = sharedPref.getString("ACCESS_TOKEN", "")
            // Nhớ dùng 10.0.2.2 cho máy ảo Android gọi xuống localhost của máy tính
            Log.d("ChatApp", "Token gửi qua Socket có bị rỗng không? -> [${token}]")
            val opts = IO.Options().apply {
                auth = mapOf("token" to token) // Node.js sẽ móc Token từ chỗ này!
            }
            socket = IO.socket("http://10.0.2.2:5000", opts)

            socket?.connect()

            // 1. Khi kết nối thành công, xin join vào phòng chat
            socket?.on(Socket.EVENT_CONNECT) {
                Log.d("Chat", "Socket connected!")
                socket?.emit("join_conversation", conversationId)
                Log.d("ChatApp", "Đã gửi yêu cầu join_conversation: $conversationId")
            }

            // 2. Lắng nghe tin nhắn mới từ Backend đẩy về
            socket?.on("receive_message") { args ->
                Log.d("ChatApp", "1. ĐÃ NHẬN ĐƯỢC TIN NHẮN TỪ SERVER!") // Ktra xem có vào đây không

                if (args.isNotEmpty()) {
                    try {
                        val data = args[0] as JSONObject
                        Log.d("ChatApp", "2. Dữ liệu thô từ Server: $data")

                        val content = data.getString("content")
                        val senderId = data.getString("sender_id")
                        val isMine = senderId == currentUserId
                        Log.d("ChatApp", "3. Parse thành công -> Nội dung: $content | Của mình: $isMine")

                        val newMessage = ChatMessage(
                            text = content,
                            senderId = senderId,
                            isMyMessage = isMine
                        )

                        // Cập nhật lên UI
                        viewModelScope.launch(Dispatchers.Main) {
                            val newList = _messages.value + newMessage
                            _messages.value = newList
                            Log.d("ChatApp", "4. Đã cập nhật List UI. Tổng số tin nhắn: ${newList.size}")
                        }
                    } catch (e: Exception) {
                        Log.e("ChatApp", "LỖI PARSE JSON: ${e.message}")
                    }
                }
            }

        } catch (e: Exception) {
            Log.e("Chat", "Socket error", e)
        }
    }

    // 3. Gửi tin nhắn lên Backend
    fun sendMessage(conversationId: String, content: String) {
        val messageData = JSONObject().apply {
            put("conversationId", conversationId)
            put("content", content)
        }
        socket?.emit("send_message", messageData)
    }

    override fun onCleared() {
        super.onCleared()
        socket?.disconnect() // Nhớ ngắt kết nối khi ViewModel bị hủy
    }
}