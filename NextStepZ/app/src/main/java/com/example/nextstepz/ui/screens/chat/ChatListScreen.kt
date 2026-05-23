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
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Chat
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.nextstepz.ui.components.GradientIcon
import com.example.nextstepz.ui.components.NextStepZTextField
import com.example.nextstepz.ui.components.SectionHeader
import com.example.nextstepz.ui.theme.AccentCyan
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextOnGradient
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary
import com.example.nextstepz.ui.theme.TextTertiary
import androidx.compose.ui.tooling.preview.Preview
import com.example.nextstepz.chat.data.model.ConversationUi
import com.example.nextstepz.ui.theme.NextStepZTheme
import kotlinx.coroutines.delay

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun ChatListScreen(
    currentUserId: String,
    onConversationClick: (conversationId: String, partnerName: String, partnerId: String) -> Unit,
    viewModel: ChatViewModel = viewModel()
) {
    val conversations by viewModel.conversations.collectAsState()
    val conversationsState by viewModel.conversationsState.collectAsState()

    LaunchedEffect(currentUserId) {
        viewModel.fetchConversations(currentUserId)
    }

    ChatListScreenContent(
        conversations = conversations,
        conversationsState = conversationsState,
        onConversationClick = onConversationClick
    )
}

@Composable
fun ChatListScreenContent(
    conversations: List<ConversationUi>,
    conversationsState: ChatUiState<List<ConversationUi>>,
    onConversationClick: (conversationId: String, partnerName: String, partnerId: String) -> Unit,
    showAnimations: Boolean = true
) {
    var headerVisible by remember { mutableStateOf(!showAnimations) }
    var searchVisible by remember { mutableStateOf(!showAnimations) }
    var listVisible by remember { mutableStateOf(!showAnimations) }

    LaunchedEffect(Unit) {
        if (showAnimations) {
            headerVisible = true
            delay(150)
            searchVisible = true
            delay(150)
            listVisible = true
        }
    }

    var searchQuery by remember { mutableStateOf("") }

    val filteredConversations = conversations.filter {
        it.partnerName.contains(searchQuery, ignoreCase = true)
    }

    val fadeInSpec = fadeIn(tween(durationMillis = 600, easing = FastOutSlowInEasing))
    val slideInSpec = slideInVertically(
        initialOffsetY = { it / 6 },
        animationSpec = tween(durationMillis = 600, easing = FastOutSlowInEasing)
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp)
    ) {
        Spacer(modifier = Modifier.height(32.dp))

        AnimatedVisibility(
            visible = headerVisible,
            enter = fadeInSpec + slideInSpec
        ) {
            Column {
                SectionHeader(
                    title = "Tin nhắn",
                    subtitle = "Kết nối và trò chuyện với mọi người"
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        AnimatedVisibility(
            visible = searchVisible,
            enter = fadeInSpec + slideInSpec
        ) {
            NextStepZTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                label = "Tìm kiếm",
                placeholder = "Nhập tên người dùng...",
                leadingIcon = Icons.Outlined.Search,
                singleLine = true
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        AnimatedVisibility(
            visible = listVisible,
            enter = fadeInSpec + slideInSpec
        ) {
            when (conversationsState) {
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
                            text = conversationsState.message,
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextSecondary,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.padding(horizontal = 24.dp)
                        )
                    }
                }

                else -> {
                    if (filteredConversations.isEmpty()) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .weight(1f),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                GradientIcon(
                                    imageVector = Icons.Outlined.Chat,
                                    contentDescription = null,
                                    modifier = Modifier.size(64.dp)
                                )
                                Spacer(modifier = Modifier.height(16.dp))
                                Text(
                                    text = "Chưa có cuộc trò chuyện nào",
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        fontWeight = FontWeight.SemiBold
                                    ),
                                    color = TextSecondary
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "Bắt đầu trò chuyện với bạn bè hoặc nhà tuyển dụng",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = TextTertiary,
                                    textAlign = TextAlign.Center,
                                    modifier = Modifier.padding(horizontal = 32.dp)
                                )
                            }
                        }
                    } else {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            verticalArrangement = Arrangement.spacedBy(12.dp),
                            contentPadding = PaddingValues(bottom = 24.dp)
                        ) {
                            items(
                                items = filteredConversations,
                                key = { it.conversationId }
                            ) { conversation ->
                                ConversationItem(
                                    conversation = conversation,
                                    onClick = {
                                        onConversationClick(
                                            conversation.conversationId,
                                            conversation.partnerName,
                                            conversation.partnerId
                                        )
                                    }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ConversationItem(
    conversation: ConversationUi,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(GlassWhite)
            .border(
                width = 0.5.dp,
                color = GlassBorder,
                shape = RoundedCornerShape(20.dp)
            )
            .clickable(onClick = onClick)
            .padding(16.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            AvatarWithGradientBorder(name = conversation.partnerName)

            Spacer(modifier = Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = conversation.partnerName,
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold
                        ),
                        color = TextPrimary
                    )
                    if (conversation.lastMessageTime.isNotEmpty()) {
                        Text(
                            text = conversation.lastMessageTime,
                            style = MaterialTheme.typography.labelSmall,
                            color = TextTertiary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = conversation.lastMessage,
                        style = MaterialTheme.typography.bodyMedium,
                        color = if (conversation.unreadCount > 0) TextPrimary else TextSecondary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f)
                    )

                    if (conversation.unreadCount > 0) {
                        Spacer(modifier = Modifier.width(8.dp))
                        UnreadBadge(count = conversation.unreadCount)
                    }
                }
            }
        }
    }
}

@Composable
private fun AvatarWithGradientBorder(name: String) {
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
                .background(AccentCyan.copy(alpha = 0.2f)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = name.firstOrNull()?.uppercase() ?: "?",
                color = TextPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
private fun UnreadBadge(count: Int) {
    Box(
        modifier = Modifier
            .size(22.dp)
            .clip(CircleShape)
            .background(
                brush = Brush.horizontalGradient(
                    listOf(GradientMid, GradientEnd)
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = if (count > 1) "n+" else count.toString(),
            color = TextOnGradient,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold
        )
    }
}

@Preview(showBackground = true)
@Composable
fun ChatListScreenPreview() {
    val sampleConversations = listOf(
        ConversationUi(
            conversationId = "1",
            partnerName = "Nguyễn Văn A",
            partnerId = "p1",
            lastMessage = "Chào bạn, mình đã xem CV của bạn.",
            lastMessageTime = "10:30",
            unreadCount = 2
        ),
        ConversationUi(
            conversationId = "2",
            partnerName = "Trần Thị B",
            partnerId = "p2",
            lastMessage = "Hẹn gặp bạn vào buổi phỏng vấn ngày mai.",
            lastMessageTime = "09:15",
            unreadCount = 0
        ),
        ConversationUi(
            conversationId = "3",
            partnerName = "Công ty TechNext",
            partnerId = "p3",
            lastMessage = "Cảm ơn bạn đã quan tâm đến vị trí Android Developer.",
            lastMessageTime = "Yesterday",
            unreadCount = 0
        )
    )

    NextStepZTheme {
        Surface(color = MaterialTheme.colorScheme.background) {
            ChatListScreenContent(
                conversations = sampleConversations,
                conversationsState = ChatUiState.Success(sampleConversations),
                onConversationClick = { _, _, _ -> },
                showAnimations = false
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ChatListScreenEmptyPreview() {
    NextStepZTheme {
        Surface(color = MaterialTheme.colorScheme.background) {
            ChatListScreenContent(
                conversations = emptyList(),
                conversationsState = ChatUiState.Success(emptyList()),
                onConversationClick = { _, _, _ -> },
                showAnimations = false
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ChatListScreenLoadingPreview() {
    NextStepZTheme {
        Surface(color = MaterialTheme.colorScheme.background) {
            ChatListScreenContent(
                conversations = emptyList(),
                conversationsState = ChatUiState.Loading,
                onConversationClick = { _, _, _ -> },
                showAnimations = false
            )
        }
    }
}
