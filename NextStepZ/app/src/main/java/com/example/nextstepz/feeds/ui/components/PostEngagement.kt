package com.example.nextstepz.feeds.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.outlined.BookmarkBorder
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextSecondary
import java.util.Locale
import kotlin.math.cos
import kotlin.math.sin

private val particleColors = listOf(
    ErrorRed,
    GradientStart,
    GradientMid,
    GradientEnd
)

@Composable
fun PostEngagement(
    likeCount: Int,
    commentCount: Int,
    isLiked: Boolean,
    isBookmarked: Boolean,
    onLikeClick: () -> Unit,
    onCommentClick: () -> Unit,
    onBookmarkClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.Start,
        verticalAlignment = Alignment.CenterVertically
    ) {
        AnimatedEngagementButton(
            icon = if (isLiked) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
            count = likeCount,
            isActive = isLiked,
            activeColor = ErrorRed,
            onClick = onLikeClick,
            enableParticle = true
        )

        Spacer(modifier = Modifier.width(28.dp))

        EngagementButton(
            icon = Icons.Outlined.ChatBubbleOutline,
            count = commentCount,
            isActive = false,
            onClick = onCommentClick
        )

        Spacer(modifier = Modifier.weight(1f))

        AnimatedEngagementButton(
            icon = if (isBookmarked) Icons.Filled.Bookmark else Icons.Outlined.BookmarkBorder,
            count = null,
            isActive = isBookmarked,
            activeColor = GradientMid,
            onClick = onBookmarkClick,
            enableParticle = false
        )
    }
}

@Composable
private fun AnimatedEngagementButton(
    icon: ImageVector,
    count: Int?,
    isActive: Boolean,
    activeColor: Color,
    onClick: () -> Unit,
    enableParticle: Boolean
) {
    val interactionSource = remember { MutableInteractionSource() }
    var clickCount by remember { mutableIntStateOf(0) }
    var particleProgress by remember { mutableFloatStateOf(0f) }

    LaunchedEffect(clickCount) {
        if (clickCount > 0) {
            particleProgress = 1f
            kotlinx.coroutines.delay(500)
            particleProgress = 0f
        }
    }

    val iconColor by animateColorAsState(
        targetValue = if (isActive) activeColor else TextSecondary,
        animationSpec = tween(durationMillis = 250),
        label = "icon_color"
    )

    val scale by animateFloatAsState(
        targetValue = if (isActive) 1.3f else 1f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "engagement_scale"
    )

    Row(
        modifier = Modifier
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = {
                    onClick()
                    if (enableParticle) {
                        clickCount += 1
                    }
                }
            )
            .padding(4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .drawBehind {
                    if (enableParticle && particleProgress > 0f) {
                        val center = Offset(size.width / 2, size.height / 2)
                        for (i in 0 until 8) {
                            val angle = (i * 45f) * (Math.PI / 180f)
                            val dist = 18.dp.toPx() * particleProgress
                            val alpha = (1f - particleProgress).coerceIn(0f, 1f)
                            val pSize = (4.dp.toPx() * (1f - particleProgress * 0.5f)).coerceAtLeast(1f)
                            val color = particleColors[i % particleColors.size]
                            drawCircle(
                                color = color.copy(alpha = alpha * 0.8f),
                                radius = pSize,
                                center = Offset(
                                    center.x + (cos(angle) * dist).toFloat(),
                                    center.y + (sin(angle) * dist).toFloat()
                                )
                            )
                        }
                    }
                },
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = iconColor,
                modifier = Modifier
                    .size(22.dp)
                    .scale(scale)
            )
        }

        if (count != null && count > 0) {
            Spacer(modifier = Modifier.width(5.dp))
            val countScale by animateFloatAsState(
                targetValue = if (isActive) 1.1f else 1f,
                animationSpec = spring(
                    dampingRatio = Spring.DampingRatioMediumBouncy,
                    stiffness = Spring.StiffnessLow
                ),
                label = "count_scale"
            )
            Text(
                text = formatCount(count),
                style = MaterialTheme.typography.labelMedium,
                color = iconColor,
                fontWeight = if (isActive) FontWeight.Bold else FontWeight.Normal,
                modifier = Modifier.scale(countScale)
            )
        }
    }
}

@Composable
private fun EngagementButton(
    icon: ImageVector,
    count: Int?,
    isActive: Boolean,
    activeColor: Color = GradientMid,
    onClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }

    val iconColor by animateColorAsState(
        targetValue = if (isActive) activeColor else TextSecondary,
        animationSpec = tween(durationMillis = 250),
        label = "icon_color"
    )

    Row(
        modifier = Modifier
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = onClick
            )
            .padding(4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = iconColor,
            modifier = Modifier.size(22.dp)
        )

        if (count != null && count > 0) {
            Spacer(modifier = Modifier.width(5.dp))
            Text(
                text = formatCount(count),
                style = MaterialTheme.typography.labelMedium,
                color = iconColor,
                fontWeight = if (isActive) FontWeight.SemiBold else FontWeight.Normal
            )
        }
    }
}

private fun formatCount(count: Int): String {
    return when {
        count >= 1_000_000 -> String.format(Locale.ROOT, "%.1fM", count / 1_000_000.0)
        count >= 1_000 -> String.format(Locale.ROOT, "%.1fK", count / 1_000.0)
        else -> count.toString()
    }
}
