package com.example.nextstepz.ui.components
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.example.nextstepz.chat.data.model.ChatMessage

@Composable
fun MessageBubble(message: ChatMessage) {
    // Nếu là tin của mình thì căn phải, màu xanh. Của người khác thì căn trái, màu xám.
    val alignment = if (message.isMyMessage) Alignment.CenterEnd else Alignment.CenterStart
    val backgroundColor = if (message.isMyMessage) Color(0xFF007AFF) else Color(0xFFE5E5EA)
    val textColor = if (message.isMyMessage) Color.White else Color.Black

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        contentAlignment = alignment
    ) {
        Surface(
            color = backgroundColor,
            shape = RoundedCornerShape(
                topStart = 16.dp,
                topEnd = 16.dp,
                bottomStart = if (message.isMyMessage) 16.dp else 0.dp,
                bottomEnd = if (message.isMyMessage) 0.dp else 16.dp
            ),
            modifier = Modifier.widthIn(max = 280.dp) // Không cho tin nhắn dài tràn viền
        ) {
            Text(
                text = message.text,
                color = textColor,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                style = MaterialTheme.typography.bodyLarge
            )
        }
    }
}