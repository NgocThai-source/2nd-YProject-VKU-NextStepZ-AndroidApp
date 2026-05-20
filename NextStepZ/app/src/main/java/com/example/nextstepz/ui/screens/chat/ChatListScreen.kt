package com.example.nextstepz.ui.screens.chat

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nextstepz.ui.components.NextStepZTextField
import com.example.nextstepz.ui.theme.*

// Dữ liệu giả
data class ChatPreview(val id: Int, val name: String, val lastMessage: String, val time: String, val unread: Int)

val dummyChats = listOf(
    ChatPreview(1, "Nguyễn Văn A", "Cuối tuần này đi cafe không bạn?", "10:30", 2),
    ChatPreview(2, "Nhóm Gia đình", "Mẹ: Nhớ ăn cơm sớm nha", "Hôm qua", 0),
    ChatPreview(3, "Trần Thị B", "Okay, để mình gửi file cho", "Hôm qua", 5),
    ChatPreview(4, "Công ty - Team Dev", "Sếp: Mọi người chú ý deadline", "Thứ 2", 0)
)

/**
 * Màn hình danh sách chat với giao diện đồng bộ Dark Theme & Glassmorphism.
 */
@Composable
fun ChatListScreen(
    onChatClick: (ChatPreview) -> Unit = {}
) {
    var searchEmail by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .systemBarsPadding()
            .padding(horizontal = 24.dp)
    ) {
        Spacer(modifier = Modifier.height(32.dp))

        // ─── Tiêu đề ─────────────────────────────────────────────
        Text(
            text = "Tin nhắn",
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Bold
            ),
            color = TextPrimary
        )
        Text(
            text = "Kết nối và trò chuyện với mọi người",
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary
        )

        Spacer(modifier = Modifier.height(32.dp))

        // ─── Thanh tìm kiếm Email ────────────────────────────────
        NextStepZTextField(
            value = searchEmail,
            onValueChange = { searchEmail = it },
            label = "Tìm kiếm",
            placeholder = "Nhập email người dùng...",
            leadingIcon = Icons.Outlined.Search,
            singleLine = true
        )

        Spacer(modifier = Modifier.height(24.dp))

        // ─── Danh sách Chat ──────────────────────────────────────
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(bottom = 24.dp)
        ) {
            items(dummyChats) { chat ->
                ChatItem(chat, onClick = { onChatClick(chat) })
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ChatListScreenPreview() {
    ChatListScreen()
}

@Composable
fun ChatItem(chat: ChatPreview, onClick: () -> Unit) {
    Surface(
        color = GlassWhite,
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Avatar với viền Gradient
            Box(
                modifier = Modifier
                    .size(52.dp)
                    .clip(CircleShape)
                    .background(
                        brush = Brush.linearGradient(
                            listOf(GradientStart, GradientMid, GradientEnd)
                        )
                    )
                    .padding(2.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .clip(CircleShape)
                        .background(DarkSurfaceVariant),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = chat.name.first().toString(),
                        color = TextPrimary,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
            Spacer(modifier = Modifier.width(16.dp))

            // Nội dung tin nhắn
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = chat.name,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold
                    ),
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = chat.lastMessage,
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (chat.unread > 0) TextPrimary else TextSecondary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            // Thời gian và Badge
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = chat.time,
                    style = MaterialTheme.typography.labelSmall,
                    color = TextTertiary
                )
                if (chat.unread > 0) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Box(
                        modifier = Modifier
                            .size(20.dp)
                            .clip(CircleShape)
                            .background(
                                brush = Brush.horizontalGradient(
                                    listOf(GradientMid, GradientEnd)
                                )
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = chat.unread.toString(),
                            color = TextOnGradient,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}
