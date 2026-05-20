package com.example.nextstepz.ui.screens.chat

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nextstepz.ui.theme.*

// Dữ liệu giả
data class Message(val text: String, val isMine: Boolean, val time: String)

val dummyMessages = listOf(
    Message("Chào bạn, khỏe không?", false, "10:00"),
    Message("Mình khỏe, dạo này công việc thế nào rồi?", true, "10:05"),
    Message("Vẫn bình thường. Cuối tuần đi cafe nhé!", false, "10:06"),
    Message("Ok luôn, chốt kèo nha 😎", true, "10:30")
)

@Composable
fun ChatDetailScreen(
    onNavigateBack: () -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .systemBarsPadding()
    ) {
        // ─── Custom Glassmorphic Top Bar ────────────────────────
        Surface(
            color = GlassWhite,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .padding(horizontal = 8.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onNavigateBack) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Quay lại",
                        tint = TextPrimary
                    )
                }
                
                // Avatar
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(
                            brush = Brush.linearGradient(
                                listOf(GradientStart, GradientMid, GradientEnd)
                            )
                        )
                        .padding(1.5.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .clip(CircleShape)
                            .background(DarkSurfaceVariant),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("A", color = TextPrimary, fontWeight = FontWeight.Bold)
                    }
                }
                
                Spacer(modifier = Modifier.width(12.dp))
                
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Nguyễn Văn A",
                        style = MaterialTheme.typography.titleMedium,
                        color = TextPrimary,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Đang hoạt động",
                        style = MaterialTheme.typography.labelSmall,
                        color = SuccessGreen
                    )
                }

                IconButton(onClick = { }) { 
                    Icon(Icons.Default.Call, contentDescription = "Gọi điện", tint = TextPrimary) 
                }
                IconButton(onClick = { }) { 
                    Icon(Icons.Default.MoreVert, contentDescription = "Tuỳ chọn", tint = TextPrimary) 
                }
            }
        }

        // ─── Messages List ──────────────────────────────────────
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(dummyMessages) { message ->
                ChatBubble(message)
            }
        }

        // ─── Input Bar ──────────────────────────────────────────
        ChatInputBar()
    }
}

@Preview(showBackground = true)
@Composable
fun ChatDetailScreenPreview() {
    ChatDetailScreen()
}

@Composable
fun ChatBubble(message: Message) {
    val alignment = if (message.isMine) Alignment.CenterEnd else Alignment.CenterStart
    
    Box(modifier = Modifier.fillMaxWidth(), contentAlignment = alignment) {
        Column(
            horizontalAlignment = if (message.isMine) Alignment.End else Alignment.Start,
            modifier = Modifier.widthIn(max = 280.dp)
        ) {
            Surface(
                color = if (message.isMine) Color.Transparent else GlassWhite,
                shape = RoundedCornerShape(
                    topStart = 20.dp,
                    topEnd = 20.dp,
                    bottomStart = if (message.isMine) 20.dp else 4.dp,
                    bottomEnd = if (message.isMine) 4.dp else 20.dp
                ),
                modifier = if (message.isMine) {
                    Modifier
                        .background(
                            brush = Brush.linearGradient(listOf(GradientStart, GradientMid)),
                            shape = RoundedCornerShape(20.dp, 20.dp, 4.dp, 20.dp)
                        )
                } else {
                    Modifier.border(0.5.dp, GlassBorder, RoundedCornerShape(20.dp, 20.dp, 20.dp, 4.dp))
                }
            ) {
                Text(
                    text = message.text,
                    color = TextPrimary,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                    style = MaterialTheme.typography.bodyLarge
                )
            }
            
            Text(
                text = message.time,
                style = MaterialTheme.typography.labelSmall,
                color = TextTertiary,
                modifier = Modifier.padding(top = 4.dp, start = 4.dp, end = 4.dp)
            )
        }
    }
}

@Composable
fun ChatInputBar() {
    var text by remember { mutableStateOf("") }

    Surface(
        color = NavBarBackground,
        modifier = Modifier
            .fillMaxWidth()
            .border(width = 0.5.dp, color = GlassBorder)
    ) {
        Row(
            modifier = Modifier
                .padding(horizontal = 8.dp, vertical = 12.dp)
                .imePadding(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = { }) {
                Icon(Icons.Default.Add, contentDescription = "Đính kèm", tint = TextSecondary)
            }

            OutlinedTextField(
                value = text,
                onValueChange = { text = it },
                placeholder = { Text("Nhập tin nhắn...", color = InputPlaceholder) },
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 8.dp),
                shape = RoundedCornerShape(24.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary,
                    unfocusedContainerColor = InputBackground,
                    focusedContainerColor = InputBackground,
                    unfocusedBorderColor = InputBorder,
                    focusedBorderColor = InputBorderFocused
                ),
                maxLines = 4
            )

            IconButton(
                onClick = { if (text.isNotBlank()) text = "" },
                modifier = Modifier
                    .size(44.dp)
                    .background(
                        brush = Brush.linearGradient(listOf(GradientMid, GradientEnd)),
                        shape = CircleShape
                    )
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.Send,
                    contentDescription = "Gửi",
                    tint = Color.White,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}
