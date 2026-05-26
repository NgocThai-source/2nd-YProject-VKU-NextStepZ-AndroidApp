package com.example.nextstepz.ui.screens.notification

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.NotificationsNone
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.nextstepz.data.model.NotificationCategory
import com.example.nextstepz.ui.components.GradientIcon
import com.example.nextstepz.ui.screens.notification.components.NotificationCard
import com.example.nextstepz.ui.screens.notification.components.NotificationFilterChips
import com.example.nextstepz.ui.screens.notification.components.NotificationHeader
import com.example.nextstepz.ui.screens.notification.components.NotificationTabItem
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextSecondary

@Composable
fun NotificationScreen(
    viewModel: NotificationViewModel = NotificationViewModel(),
    modifier: Modifier = Modifier
) {
    val notifications by viewModel.filteredNotifications.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val unreadCount by viewModel.unreadCount.collectAsState()

    val tabs = listOf(
        NotificationTabItem(category = NotificationCategory.ALL, label = "Tất cả", unreadCount = unreadCount),
        NotificationTabItem(category = NotificationCategory.POST, label = "Bài viết", unreadCount = notifications.count { !it.isRead && it.category == NotificationCategory.POST }),
        NotificationTabItem(category = NotificationCategory.ACCOUNT, label = "Tài khoản", unreadCount = notifications.count { !it.isRead && it.category == NotificationCategory.ACCOUNT }),
        NotificationTabItem(category = NotificationCategory.JOB, label = "Việc làm", unreadCount = notifications.count { !it.isRead && it.category == NotificationCategory.JOB })
    )

    Column(
        modifier = modifier
            .fillMaxSize()
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        NotificationHeader(
            onMarkAllAsRead = { viewModel.markAllAsRead() }
        )

        Spacer(modifier = Modifier.height(16.dp))

        NotificationFilterChips(
            tabs = tabs,
            selectedCategory = selectedCategory,
            onCategorySelected = { viewModel.selectCategory(it) }
        )

        Spacer(modifier = Modifier.height(12.dp))

        AnimatedVisibility(
            visible = notifications.isEmpty(),
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            EmptyNotificationState()
        }

        AnimatedVisibility(
            visible = notifications.isNotEmpty(),
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(
                    start = 20.dp,
                    end = 20.dp,
                    top = 4.dp,
                    bottom = 24.dp
                ),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(
                    items = notifications,
                    key = { it.id }
                ) { notification ->
                    NotificationCard(
                        notification = notification,
                        onClick = { viewModel.markAsRead(notification.id) }
                    )
                }
            }
        }
    }
}

@Composable
private fun EmptyNotificationState() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(40.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            GradientIcon(
                imageVector = Icons.Outlined.NotificationsNone,
                contentDescription = null,
                modifier = Modifier.size(80.dp),
                brush = Brush.linearGradient(
                    listOf(
                        GradientStart.copy(alpha = 0.4f),
                        GradientMid.copy(alpha = 0.4f),
                        GradientEnd.copy(alpha = 0.4f)
                    )
                )
            )

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "Không có thông báo",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                color = TextSecondary
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Bạn sẽ nhận được thông báo khi có cập nhật mới",
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary.copy(alpha = 0.6f),
                textAlign = TextAlign.Center
            )
        }
    }
}
