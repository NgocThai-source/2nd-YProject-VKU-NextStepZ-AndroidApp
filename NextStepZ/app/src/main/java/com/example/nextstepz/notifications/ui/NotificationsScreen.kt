package com.example.nextstepz.notifications.ui

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
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Article
import androidx.compose.material.icons.filled.Business
import androidx.compose.material.icons.filled.DoneAll
import androidx.compose.material.icons.filled.Flag
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.NotificationsNone
import androidx.compose.material.icons.filled.Report
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material.icons.filled.WorkOutline
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.PullToRefreshDefaults
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.nextstepz.notifications.data.model.NotificationCategory
import com.example.nextstepz.notifications.data.model.NotificationItem
import com.example.nextstepz.notifications.data.model.NotificationOutcome
import com.example.nextstepz.notifications.viewmodel.NotificationsUiState
import com.example.nextstepz.notifications.viewmodel.NotificationsViewModel
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassOverlay
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.InfoBlue
import com.example.nextstepz.ui.theme.SuccessGreen
import com.example.nextstepz.ui.theme.TextOnGradient
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary
import com.example.nextstepz.ui.theme.TextTertiary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationsScreen(
    viewModel: NotificationsViewModel = viewModel(),
) {
    val uiState by viewModel.uiState
    val isRefreshing by viewModel.isRefreshing
    val pullState = rememberPullToRefreshState()

    // Auto-load / refresh every time the tab is opened.
    LaunchedEffect(Unit) { viewModel.load() }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding()
    ) {
        PullToRefreshBox(
            isRefreshing = isRefreshing,
            onRefresh = { viewModel.refresh() },
            modifier = Modifier.fillMaxSize(),
            state = pullState,
            indicator = {
                PullToRefreshDefaults.Indicator(
                    state = pullState,
                    isRefreshing = isRefreshing,
                    modifier = Modifier.align(Alignment.TopCenter),
                    containerColor = com.example.nextstepz.ui.theme.DarkSurface,
                    color = GradientMid,
                )
            },
        ) {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 16.dp, bottom = 100.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                item {
                    NotificationsHeader(
                        unreadCount = (uiState as? NotificationsUiState.Success)?.unreadCount ?: 0,
                        onMarkAll = { viewModel.markAllRead() }
                    )
                }

                when (val state = uiState) {
                    is NotificationsUiState.Loading -> item { CenterState { LoadingContent() } }
                    is NotificationsUiState.Error -> item {
                        CenterState {
                            InfoContent(
                                icon = Icons.Filled.NotificationsNone,
                                title = "Không tải được thông báo",
                                subtitle = state.message,
                            )
                        }
                    }
                    is NotificationsUiState.SignedOut -> item {
                        CenterState {
                            InfoContent(
                                icon = Icons.Filled.NotificationsNone,
                                title = "Bạn chưa đăng nhập",
                                subtitle = "Đăng nhập để xem các thông báo dành cho bạn.",
                            )
                        }
                    }
                    is NotificationsUiState.Success -> {
                        if (state.items.isEmpty()) {
                            item {
                                CenterState {
                                    InfoContent(
                                        icon = Icons.Filled.NotificationsNone,
                                        title = "Chưa có thông báo",
                                        subtitle = "Các cập nhật về ứng tuyển, duyệt tin và báo cáo sẽ xuất hiện ở đây.",
                                    )
                                }
                            }
                        } else {
                            items(state.items, key = { it.id }) { item ->
                                NotificationCard(
                                    item = item,
                                    onClick = { viewModel.markAsRead(item.id) }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

// ─── Header ───────────────────────────────────────────────────────────────────

@Composable
private fun NotificationsHeader(
    unreadCount: Int,
    onMarkAll: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(46.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(Brush.linearGradient(listOf(GradientStart, GradientMid, GradientEnd))),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Filled.Notifications,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(24.dp)
            )
        }
        Spacer(modifier = Modifier.width(14.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = "Thông báo",
                style = MaterialTheme.typography.headlineSmall,
                color = TextPrimary
            )
            Text(
                text = if (unreadCount > 0) "Bạn có $unreadCount thông báo chưa đọc"
                else "Bạn đã xem hết thông báo",
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary
            )
        }
        if (unreadCount > 0) {
            Spacer(modifier = Modifier.width(8.dp))
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(20.dp))
                    .background(GlassWhite)
                    .border(1.dp, GlassBorder, RoundedCornerShape(20.dp))
                    .clickable(onClick = onMarkAll)
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Filled.DoneAll,
                    contentDescription = null,
                    tint = GradientMid,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Đọc tất cả",
                    style = MaterialTheme.typography.labelMedium,
                    color = TextPrimary
                )
            }
        }
    }
}

// ─── Notification card ──────────────────────────────────────────────────────────

@Composable
private fun NotificationCard(
    item: NotificationItem,
    onClick: () -> Unit,
) {
    val accent = item.outcome.accentColor()
    val containerColor = if (item.isRead) GlassOverlay else GlassWhite

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(containerColor)
            .border(
                width = 1.dp,
                color = if (item.isRead) GlassBorder.copy(alpha = 0.5f) else accent.copy(alpha = 0.45f),
                shape = RoundedCornerShape(20.dp)
            )
            .clickable(onClick = onClick)
            .padding(16.dp)
    ) {
        Row(verticalAlignment = Alignment.Top) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(accent.copy(alpha = 0.16f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = item.category.icon(),
                    contentDescription = null,
                    tint = accent,
                    modifier = Modifier.size(22.dp)
                )
            }
            Spacer(modifier = Modifier.width(14.dp))
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = item.title,
                        style = MaterialTheme.typography.titleSmall.copy(
                            fontWeight = if (item.isRead) FontWeight.Medium else FontWeight.SemiBold
                        ),
                        color = TextPrimary,
                        modifier = Modifier.weight(1f),
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                    if (!item.isRead) {
                        Spacer(modifier = Modifier.width(8.dp))
                        Box(
                            modifier = Modifier
                                .size(9.dp)
                                .clip(CircleShape)
                                .background(
                                    Brush.linearGradient(listOf(GradientStart, GradientMid, GradientEnd))
                                )
                        )
                    }
                }
                Spacer(modifier = Modifier.height(5.dp))
                Text(
                    text = item.message,
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary,
                    maxLines = 4,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    NotificationTag(label = item.category.label, accent = accent)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = item.timeLabel,
                        style = MaterialTheme.typography.labelSmall,
                        color = TextTertiary
                    )
                }
            }
        }
    }
}

@Composable
private fun NotificationTag(label: String, accent: Color) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(accent.copy(alpha = 0.14f))
            .padding(horizontal = 8.dp, vertical = 3.dp)
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Medium),
            color = accent
        )
    }
}

// ─── States ─────────────────────────────────────────────────────────────────

@Composable
private fun CenterState(content: @Composable () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(420.dp),
        contentAlignment = Alignment.Center
    ) { content() }
}

@Composable
private fun LoadingContent() {
    CircularProgressIndicator(color = GradientMid)
}

@Composable
private fun InfoContent(
    icon: ImageVector,
    title: String,
    subtitle: String,
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.padding(horizontal = 24.dp)
    ) {
        Box(
            modifier = Modifier
                .size(88.dp)
                .clip(RoundedCornerShape(28.dp))
                .background(GlassWhite),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = GradientMid,
                modifier = Modifier.size(40.dp)
            )
        }
        Spacer(modifier = Modifier.height(18.dp))
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            color = TextPrimary,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = subtitle,
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary,
            textAlign = TextAlign.Center
        )
    }
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

private fun NotificationOutcome.accentColor(): Color = when (this) {
    NotificationOutcome.POSITIVE -> SuccessGreen
    NotificationOutcome.NEGATIVE -> ErrorRed
    NotificationOutcome.NEUTRAL -> InfoBlue
}

private fun NotificationCategory.icon(): ImageVector = when (this) {
    NotificationCategory.APPLICATION -> Icons.Filled.WorkOutline
    NotificationCategory.JOB_REPORT -> Icons.Filled.Flag
    NotificationCategory.POST_REPORT -> Icons.AutoMirrored.Filled.Article
    NotificationCategory.USER_REPORT -> Icons.Filled.Report
    NotificationCategory.JOB_APPROVAL -> Icons.Filled.VerifiedUser
    NotificationCategory.EMPLOYER_APPROVAL -> Icons.Filled.Business
    NotificationCategory.GENERAL -> Icons.Filled.Notifications
}
