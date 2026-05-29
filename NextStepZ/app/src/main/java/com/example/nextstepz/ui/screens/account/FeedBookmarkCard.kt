package com.example.nextstepz.ui.screens.account

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
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
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.outlined.BookmarkBorder
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.nextstepz.feeds.data.model.Post
import com.example.nextstepz.feeds.data.model.PostType
import com.example.nextstepz.ui.theme.AccentAmber
import com.example.nextstepz.ui.theme.AccentCyan
import com.example.nextstepz.ui.theme.AccentEmerald
import com.example.nextstepz.ui.theme.AccentOrange
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary
import com.example.nextstepz.ui.theme.TextTertiary
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

@Composable
fun FeedBookmarkCard(
    post: Post,
    onRemove: () -> Unit,
    onLikeClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.98f else 1f,
        animationSpec = tween(durationMillis = 100),
        label = "card_scale"
    )

    val bookmarkScale by animateFloatAsState(
        targetValue = 1f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "bookmark_scale"
    )

    val bookmarkColor by animateColorAsState(
        targetValue = AccentAmber,
        animationSpec = tween(250),
        label = "bookmark_color"
    )

    val likeColor by animateColorAsState(
        targetValue = if (post.isLiked) ErrorRed else TextTertiary,
        animationSpec = tween(250),
        label = "like_color"
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .scale(scale)
            .clip(RoundedCornerShape(20.dp))
            .background(GlassWhite)
            .border(
                width = 1.dp,
                color = GlassBorder,
                shape = RoundedCornerShape(20.dp)
            )
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = { }
            )
            .padding(20.dp)
    ) {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(
                                listOf(GradientStart, GradientMid, GradientEnd)
                            )
                        )
                        .padding(2.dp)
                        .clip(CircleShape)
                        .background(GlassWhite),
                    contentAlignment = Alignment.Center
                ) {
                    if (post.authorAvatar != null) {
                        AsyncImage(
                            model = post.authorAvatar,
                            contentDescription = "Avatar ${post.authorName}",
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape),
                            contentScale = ContentScale.Crop
                        )
                    } else {
                        Icon(
                            imageVector = Icons.Outlined.Person,
                            contentDescription = "Avatar",
                            tint = TextPrimary.copy(alpha = 0.8f),
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = post.authorName,
                        style = MaterialTheme.typography.titleSmall.copy(
                            fontWeight = FontWeight.SemiBold
                        ),
                        color = TextPrimary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        if (post.authorRole != null) {
                            Text(
                                text = post.authorRole,
                                style = MaterialTheme.typography.bodySmall,
                                color = TextTertiary,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                                modifier = Modifier.weight(1f, fill = false)
                            )
                            Text(
                                text = " · ",
                                style = MaterialTheme.typography.bodySmall,
                                color = TextTertiary
                            )
                        }
                        Text(
                            text = formatTimeAgo(post.createdAt),
                            style = MaterialTheme.typography.bodySmall,
                            color = TextTertiary
                        )
                    }
                }

                IconButton(onClick = onRemove, modifier = Modifier.size(36.dp)) {
                    Icon(
                        imageVector = if (post.isBookmarked) Icons.Filled.Bookmark else Icons.Outlined.BookmarkBorder,
                        contentDescription = "Xóa khỏi yêu thích",
                        tint = bookmarkColor,
                        modifier = Modifier
                            .size(20.dp)
                            .scale(bookmarkScale)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            PostTypeBadge(type = post.type)

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = post.content,
                style = MaterialTheme.typography.bodyMedium,
                color = TextPrimary,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.fillMaxWidth()
            )

            if (post.skillTags.isNotEmpty()) {
                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    post.skillTags.take(3).forEach { tag ->
                        SkillTagSmall(tag = tag)
                    }
                    if (post.skillTags.size > 3) {
                        Text(
                            text = "+${post.skillTags.size - 3}",
                            style = MaterialTheme.typography.labelSmall,
                            color = TextSecondary,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(
                        Brush.horizontalGradient(
                            listOf(
                                GradientStart.copy(alpha = 0f),
                                GradientMid.copy(alpha = 0.2f),
                                GradientEnd.copy(alpha = 0f)
                            )
                        )
                    )
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Start,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = onLikeClick,
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        imageVector = if (post.isLiked) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                        contentDescription = "Thích",
                        tint = likeColor,
                        modifier = Modifier.size(20.dp)
                    )
                }
                if (post.likeCount > 0) {
                    Text(
                        text = formatCount(post.likeCount),
                        style = MaterialTheme.typography.labelMedium,
                        color = likeColor
                    )
                }

                Spacer(modifier = Modifier.width(20.dp))

                Icon(
                    imageVector = Icons.Outlined.ChatBubbleOutline,
                    contentDescription = null,
                    tint = TextTertiary,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(5.dp))
                Text(
                    text = formatCount(post.commentCount),
                    style = MaterialTheme.typography.labelMedium,
                    color = TextSecondary
                )
            }
        }
    }
}

@Composable
private fun PostTypeBadge(type: PostType) {
    val (label, color) = when (type) {
        PostType.Article -> "Bài viết" to GradientMid
        PostType.Job -> "Việc làm" to AccentEmerald
        PostType.Tips -> "Mẹo nghề" to AccentAmber
        PostType.Story -> "Chia sẻ" to AccentCyan
    }

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(
                Brush.horizontalGradient(
                    listOf(
                        color.copy(alpha = 0.15f),
                        color.copy(alpha = 0.08f)
                    )
                )
            )
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium.copy(
                fontWeight = FontWeight.SemiBold,
                fontSize = 11.sp
            ),
            color = color
        )
    }
}

@Composable
private fun SkillTagSmall(tag: String) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(GlassBorder.copy(alpha = 0.3f))
            .border(
                width = 0.5.dp,
                color = GlassBorder.copy(alpha = 0.5f),
                shape = RoundedCornerShape(6.dp)
            )
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(
            text = "#$tag",
            style = MaterialTheme.typography.labelSmall.copy(fontSize = 11.sp),
            color = TextSecondary
        )
    }
}

private fun formatTimeAgo(isoDate: String): String {
    return try {
        val instant = Instant.parse(isoDate)
        val now = Instant.now()
        val duration = Duration.between(instant, now)

        when {
            duration.toMinutes() < 1 -> "Vừa xong"
            duration.toMinutes() < 60 -> "${duration.toMinutes()} phút trước"
            duration.toHours() < 24 -> "${duration.toHours()} giờ trước"
            duration.toDays() < 7 -> "${duration.toDays()} ngày trước"
            else -> {
                val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")
                    .withZone(ZoneId.systemDefault())
                formatter.format(instant)
            }
        }
    } catch (e: Exception) {
        isoDate
    }
}

private fun formatCount(count: Int): String {
    return when {
        count >= 1_000_000 -> String.format(Locale.ROOT, "%.1fM", count / 1_000_000.0)
        count >= 1_000 -> String.format(Locale.ROOT, "%.1fK", count / 1_000.0)
        else -> count.toString()
    }
}
