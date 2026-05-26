package com.example.nextstepz.ui.screens.notification.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.LockOpen
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.outlined.Article
import androidx.compose.material.icons.outlined.WorkOutline
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import com.example.nextstepz.data.model.NotificationIconType
import com.example.nextstepz.data.model.NotificationItem
import com.example.nextstepz.ui.theme.AccentEmerald
import com.example.nextstepz.ui.theme.AccentOrange
import com.example.nextstepz.ui.theme.BrandBlue
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary
import com.example.nextstepz.ui.theme.WarningYellow

@Composable
fun NotificationCard(
    notification: NotificationItem,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val backgroundColor by animateColorAsState(
        targetValue = if (notification.isRead) GlassWhite else GlassWhite.copy(alpha = 0.25f),
        label = "cardBackground"
    )

    val (icon, iconBackgroundColor) = getIconAndColor(notification.iconType)

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(backgroundColor)
            .clickable(onClick = onClick)
            .padding(16.dp),
        verticalAlignment = Alignment.Top
    ) {
        // Icon
        Box(
            modifier = Modifier
                .size(44.dp)
                .clip(CircleShape)
                .background(iconBackgroundColor),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(22.dp)
            )
        }

        Spacer(modifier = Modifier.width(14.dp))

        // Content
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.Center
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = notification.title,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = if (!notification.isRead) FontWeight.SemiBold else FontWeight.Medium
                    ),
                    color = TextPrimary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )

                Spacer(modifier = Modifier.width(8.dp))

                // Unread dot
                if (!notification.isRead) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(BrandBlue)
                    )
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = notification.message,
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = notification.timestamp,
                style = MaterialTheme.typography.labelSmall,
                color = TextSecondary.copy(alpha = 0.6f)
            )
        }
    }
}

private fun getIconAndColor(iconType: NotificationIconType): Pair<ImageVector, Color> {
    return when (iconType) {
        NotificationIconType.SUCCESS -> Icons.Filled.Check to AccentEmerald
        NotificationIconType.WARNING -> Icons.Filled.Warning to WarningYellow
        NotificationIconType.COMMENT -> Icons.Outlined.Article to BrandBlue
        NotificationIconType.HEART -> Icons.Filled.Favorite to AccentOrange
        NotificationIconType.APPROVED -> Icons.Filled.Check to AccentEmerald
        NotificationIconType.REJECTED -> Icons.Filled.Close to ErrorRed
        NotificationIconType.INFO -> Icons.Filled.Notifications to GradientMid
        NotificationIconType.LOCK -> Icons.Filled.Lock to ErrorRed
        NotificationIconType.UNLOCK -> Icons.Filled.LockOpen to AccentEmerald
        NotificationIconType.JOB -> Icons.Outlined.WorkOutline to BrandBlue
        NotificationIconType.POST -> Icons.Outlined.Article to GradientMid
    }
}
