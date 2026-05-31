package com.example.nextstepz.ui.screens.chat
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.tooling.preview.Preview
import com.example.nextstepz.chat.data.model.ChatMessage
import com.example.nextstepz.ui.components.MessageBubble

@Composable
fun ChatSandboxScreen(
    viewModel: ChatViewModel,
    currentUserId: String, // Trích xuất từ Session đăng nhập hiện tại
    conversationId: String // Hardcode ID mà bạn vừa tạo bằng tay trên Supabase
) {
    val messages by viewModel.messages.collectAsState()

    // Gọi event kết nối Socket ngay khi vào màn hình
    LaunchedEffect(Unit) {
        viewModel.connectSocket(conversationId, currentUserId)
    }

    ChatSandboxContent(
        messages = messages,
        onSendMessage = { viewModel.sendMessage(it) }
    )
}

@Composable
fun ChatSandboxContent(
    messages: List<ChatMessageUi>,
    onSendMessage: (String) -> Unit
) {
    var inputText by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF9F9F9))
    ) {
        // 1. Khu vực hiển thị danh sách tin nhắn
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            contentPadding = PaddingValues(16.dp)
        ) {
            items(messages) { uiMessage ->
                MessageBubble(
                    message = ChatMessage(
                        id = uiMessage.id,
                        text = uiMessage.text,
                        senderId = uiMessage.senderId,
                        isMyMessage = uiMessage.isMyMessage
                    )
                )
            }
        }

        // 2. Khu vực nhập và gửi tin nhắn
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .padding(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = inputText,
                onValueChange = { inputText = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Nhập tin nhắn...", color = Color.Gray) },
                shape = CircleShape,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.Black,
                    unfocusedBorderColor = Color.Black,
                    focusedBorderColor = Color(0xFF007AFF)
                )
            )

            Spacer(modifier = Modifier.width(8.dp))

            IconButton(
                onClick = {
                    if (inputText.isNotBlank()) {
                        onSendMessage(inputText)
                        inputText = "" // Xóa text sau khi gửi
                    }
                },
                modifier = Modifier
                    .background(Color(0xFF007AFF), CircleShape)
                    .size(48.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Send,
                    contentDescription = "Gửi",
                    tint = Color.White
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ChatSandboxPreview() {
    val sampleMessages = listOf(
        ChatMessageUi(
            id = "1",
            text = "Chào bạn!",
            senderId = "user1",
            senderName = "Người gửi",
            isMyMessage = false,
            timestamp = "10:00",
            isEdited = false,
            isDeleted = false,
            messageType = "text"
        ),
        ChatMessageUi(
            id = "2",
            text = "Chào! Bạn thế nào?",
            senderId = "me",
            senderName = "Tôi",
            isMyMessage = true,
            timestamp = "10:01",
            isEdited = false,
            isDeleted = false,
            messageType = "text"
        )
    )

    ChatSandboxContent(
        messages = sampleMessages,
        onSendMessage = {}
    )
}
