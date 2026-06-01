package com.example.nextstepz.ui.screens.chat

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.tooling.preview.Preview
import com.example.nextstepz.chat.data.model.ChatMessageUi
import com.example.nextstepz.ui.theme.DarkSurfaceVariant
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.InputBackground
import com.example.nextstepz.ui.theme.InputBorder
import com.example.nextstepz.ui.theme.InputBorderFocused
import com.example.nextstepz.ui.theme.InputPlaceholder
import com.example.nextstepz.ui.theme.NavBarBackground
import com.example.nextstepz.ui.theme.SuccessGreen
import com.example.nextstepz.ui.theme.TextOnGradient
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary
import com.example.nextstepz.ui.theme.TextTertiary
import kotlinx.coroutines.delay

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun ChatDetailScreen(
    conversationId: String,
    partnerName: String,
    currentUserId: String,
    onNavigateBack: () -> Unit,
    viewModel: ChatViewModel
) {
    LaunchedEffect(conversationId) {
        viewModel.fetchMessages(conversationId, currentUserId)
        viewModel.connectSocket(conversationId, currentUserId)
    }

    LaunchedEffect(Unit) {
        viewModel.clearMessages()
    }

    val messages by viewModel.messages.collectAsState()
    val messagesState by viewModel.messagesState.collectAsState()
    val isSending by viewModel.isSending.collectAsState()

    ChatDetailContent(
        partnerName = partnerName,
        messages = messages,
        messagesState = messagesState,
        isSending = isSending,
        onNavigateBack = onNavigateBack,
        onSendMessage = { content ->
            viewModel.sendMessage(content)
        }
    )
}

@Composable
fun ChatDetailContent(
    partnerName: String,
    messages: List<ChatMessageUi>,
    messagesState: ChatUiState<List<ChatMessageUi>>,
    isSending: Boolean,
    onNavigateBack: () -> Unit,
    onSendMessage: (String) -> Unit
) {
    var topBarVisible by remember { mutableStateOf(false) }
    var contentVisible by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        topBarVisible = true
        delay(100)
        contentVisible = true
    }

    val listState = rememberLazyListState()

    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(0) // Đổi từ (messages.size - 1) thành 0
        }
    }

    val fadeInSpec = fadeIn(tween(durationMillis = 500, easing = FastOutSlowInEasing))
    val slideInSpec = slideInVertically(
        initialOffsetY = { -it / 6 },
        animationSpec = tween(durationMillis = 500, easing = FastOutSlowInEasing)
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding()
            .imePadding()
            .navigationBarsPadding()
    ) {
        AnimatedVisibility(
            visible = topBarVisible,
            enter = fadeInSpec + slideInSpec
        ) {
            GlassmorphicTopBar(
                partnerName = partnerName,
                onNavigateBack = onNavigateBack
            )
        }

        AnimatedVisibility(
            visible = contentVisible,
            modifier = Modifier.weight(1f),
            enter = fadeIn()
        ) {
            Column(modifier = Modifier.fillMaxWidth()) {
                when (messagesState) {
                    is ChatUiState.Loading -> {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .weight(1f),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator(
                                color = GradientMid,
                                strokeWidth = 2.5.dp,
                                modifier = Modifier.size(32.dp)
                            )
                        }
                    }

                    is ChatUiState.Error -> {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .weight(1f),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = messagesState.message,
                                style = MaterialTheme.typography.bodyMedium,
                                color = TextSecondary,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(24.dp)
                            )
                        }
                    }

                    else -> {
                        if (messages.isEmpty()) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .weight(1f),
                            ) {
                                Text(
                                    text = "Bắt đầu cuộc trò chuyện",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = TextTertiary,
                                    modifier = Modifier.align(Alignment.Center)
                                )
                            }
                        } else {

                            LazyColumn(
                                state = listState,
                                modifier = Modifier.fillMaxSize(),
                                reverseLayout = true,
                                contentPadding = androidx.compose.foundation.layout.PaddingValues(
                                    horizontal = 16.dp,
                                    vertical = 12.dp
                                ),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                items(
                                    items = messages,
                                    key = { it.id }
                                ) { message ->
                                    MessageBubbleItem(
                                        message = message,
                                        onLongPress = { /* TODO: show delete/edit options */ }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        ChatInputBar(
            isSending = isSending,
            onSendMessage = onSendMessage
        )
    }
}

@Composable
private fun GlassmorphicTopBar(
    partnerName: String,
    onNavigateBack: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                color = NavBarBackground.copy(alpha = 0.95f)
            )
            .border(
                width = 0.5.dp,
                brush = Brush.verticalGradient(
                    listOf(
                        GlassBorder.copy(alpha = 0f),
                        GlassBorder,
                        GlassBorder.copy(alpha = 0f)
                    )
                ),
                shape = RectangleShape
            )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onNavigateBack) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Quay lại",
                    tint = TextPrimary,
                    modifier = Modifier.size(24.dp)
                )
            }

            Spacer(modifier = Modifier.width(4.dp))

            Box(
                modifier = Modifier
                    .size(42.dp)
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
                    Text(
                        text = partnerName.firstOrNull()?.uppercase() ?: "?",
                        color = TextPrimary,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = partnerName,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold
                    ),
                    color = TextPrimary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(7.dp)
                            .clip(CircleShape)
                            .background(SuccessGreen)
                    )
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = "Đang hoạt động",
                        style = MaterialTheme.typography.labelSmall,
                        color = SuccessGreen
                    )
                }
            }

            IconButton(onClick = { }) {
                Icon(
                    imageVector = Icons.Default.Call,
                    contentDescription = "Gọi điện",
                    tint = TextPrimary,
                    modifier = Modifier.size(22.dp)
                )
            }

            IconButton(onClick = { }) {
                Icon(
                    imageVector = Icons.Default.MoreVert,
                    contentDescription = "Tuỳ chọn",
                    tint = TextPrimary,
                    modifier = Modifier.size(22.dp)
                )
            }
        }
    }
}

@Composable
private fun MessageBubbleItem(
    message: ChatMessageUi,
    onLongPress: () -> Unit
) {
    val alignment = if (message.isMyMessage) Alignment.CenterEnd else Alignment.CenterStart

    Box(
        modifier = Modifier.fillMaxWidth(),
        contentAlignment = alignment
    ) {
        Column(
            horizontalAlignment = if (message.isMyMessage) Alignment.End else Alignment.Start,
            modifier = Modifier.widthIn(max = 300.dp)
        ) {
            Box(
                modifier = Modifier
                    .then(
                        if (message.isMyMessage) {
                            Modifier
                                .background(
                                    brush = Brush.horizontalGradient(
                                        listOf(GradientStart, GradientMid)
                                    ),
                                    shape = RoundedCornerShape(
                                        topStart = 20.dp,
                                        topEnd = 20.dp,
                                        bottomStart = 20.dp,
                                        bottomEnd = 4.dp
                                    )
                                )
                        } else {
                            Modifier
                                .background(
                                    color = GlassWhite,
                                    shape = RoundedCornerShape(
                                        topStart = 20.dp,
                                        topEnd = 20.dp,
                                        bottomStart = 4.dp,
                                        bottomEnd = 20.dp
                                    )
                                )
                                .border(
                                    width = 0.5.dp,
                                    color = GlassBorder,
                                    shape = RoundedCornerShape(
                                        topStart = 20.dp,
                                        topEnd = 20.dp,
                                        bottomStart = 4.dp,
                                        bottomEnd = 20.dp
                                    )
                                )
                        }
                    )
                    .padding(horizontal = 16.dp, vertical = 10.dp)
            ) {
                Text(
                    text = message.text,
                    style = MaterialTheme.typography.bodyLarge.copy(
                        fontStyle = if (message.isDeleted) FontStyle.Italic else FontStyle.Normal
                    ),
                    color = if (message.isDeleted) TextTertiary else TextPrimary
                )
            }

            Spacer(modifier = Modifier.height(3.dp))

            Row(
                horizontalArrangement = if (message.isMyMessage) Arrangement.End else Arrangement.Start,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = message.timestamp,
                    style = MaterialTheme.typography.labelSmall,
                    color = TextTertiary
                )
                if (message.isEdited && !message.isDeleted) {
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Đã sửa",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontSize = 9.sp
                        ),
                        color = TextTertiary
                    )
                }
            }
        }
    }
}

@Composable
private fun ChatInputBar(
    isSending: Boolean,
    onSendMessage: (String) -> Unit
) {
    var inputText by remember { mutableStateOf("") }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(NavBarBackground.copy(alpha = 0.98f))
            .border(
                width = 0.5.dp,
                brush = Brush.verticalGradient(
                    listOf(
                        GlassBorder.copy(alpha = 0.3f),
                        GlassBorder.copy(alpha = 0.1f)
                    )
                ),
                shape = RectangleShape
            )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = { },
                modifier = Modifier.size(40.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Đính kèm",
                    tint = TextSecondary,
                    modifier = Modifier.size(24.dp)
                )
            }

            Box(
                modifier = Modifier
                    .weight(1f)
                    .height(44.dp)
                    .clip(RoundedCornerShape(22.dp))
                    .background(InputBackground)
                    .border(
                        width = 1.dp,
                        color = InputBorder,
                        shape = RoundedCornerShape(22.dp)
                    )
                    .padding(horizontal = 16.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                androidx.compose.foundation.text.BasicTextField(
                    value = inputText,
                    onValueChange = { inputText = it },
                    modifier = Modifier.fillMaxWidth(),
                    textStyle = MaterialTheme.typography.bodyMedium.copy(
                        color = TextPrimary
                    ),
                    singleLine = false,
                    maxLines = 4,
                    cursorBrush = androidx.compose.ui.graphics.SolidColor(InputBorderFocused),
                    decorationBox = { innerTextField ->
                        Box {
                            if (inputText.isEmpty()) {
                                Text(
                                    text = "Nhập tin nhắn...",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = InputPlaceholder
                                )
                            }
                            innerTextField()
                        }
                    }
                )
            }

            Spacer(modifier = Modifier.width(8.dp))

            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(
                        brush = if (inputText.isNotBlank()) {
                            Brush.horizontalGradient(listOf(GradientMid, GradientEnd))
                        } else {
                            Brush.horizontalGradient(
                                listOf(InputBorder, InputBorder)
                            )
                        }
                    )
                    .clickable(
                        enabled = inputText.isNotBlank() && !isSending,
                        onClick = {
                            if (inputText.isNotBlank()) {
                                onSendMessage(inputText)
                                inputText = ""
                            }
                        }
                    ),
                contentAlignment = Alignment.Center
            ) {
                if (isSending) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        color = TextPrimary,
                        strokeWidth = 2.dp
                    )
                } else {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.Send,
                        contentDescription = "Gửi",
                        tint = if (inputText.isNotBlank()) TextOnGradient else TextTertiary,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ChatDetailPreview() {
    val sampleMessages = listOf(
        ChatMessageUi(
            id = "1",
            text = "Chào bạn! Mình có thể giúp gì cho bạn?",
            senderId = "partner",
            senderName = "Nguyễn Văn A",
            isMyMessage = false,
            timestamp = "10:00",
            isEdited = false,
            isDeleted = false,
            messageType = "text"
        ),
        ChatMessageUi(
            id = "2",
            text = "Chào! Mình muốn hỏi về dự án NextStepZ.",
            senderId = "me",
            senderName = "Tôi",
            isMyMessage = true,
            timestamp = "10:01",
            isEdited = false,
            isDeleted = false,
            messageType = "text"
        ),
        ChatMessageUi(
            id = "3",
            text = "Dự án này rất tuyệt vời!",
            senderId = "partner",
            senderName = "Nguyễn Văn A",
            isMyMessage = false,
            timestamp = "10:02",
            isEdited = true,
            isDeleted = false,
            messageType = "text"
        ),
        ChatMessageUi(
            id = "4",
            text = "Tin nhắn này đã bị xoá",
            senderId = "me",
            senderName = "Tôi",
            isMyMessage = true,
            timestamp = "10:03",
            isEdited = false,
            isDeleted = true,
            messageType = "text"
        )
    )

    Box(modifier = Modifier.background(DarkSurfaceVariant)) {
        ChatDetailContent(
            partnerName = "Nguyễn Văn A",
            messages = sampleMessages,
            messagesState = ChatUiState.Success(sampleMessages),
            isSending = false,
            onNavigateBack = {},
            onSendMessage = {}
        )
    }
}
