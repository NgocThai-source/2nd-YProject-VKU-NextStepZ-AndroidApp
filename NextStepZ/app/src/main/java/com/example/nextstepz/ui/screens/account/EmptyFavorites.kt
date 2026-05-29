package com.example.nextstepz.ui.screens.account

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.BookmarkBorder
import androidx.compose.material.icons.outlined.WorkOutline
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.nextstepz.ui.components.GradientButton
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextSecondary
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun EmptyFavorites(
    type: EmptyFavoriteType,
    onExploreClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "empty_fav_anim")
    val animProgress by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 4000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "float_anim"
    )

    val floatY = sin(Math.toRadians(animProgress.toDouble())).toFloat() * 8f

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 64.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(80.dp)
                .scale(1f + (floatY / 80f) * 0.05f),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(
                        Brush.linearGradient(
                            listOf(
                                GradientStart.copy(alpha = 0.12f),
                                GradientMid.copy(alpha = 0.08f),
                                GradientEnd.copy(alpha = 0.05f)
                            )
                        )
                    )
                    .padding(2.dp)
                    .clip(RoundedCornerShape(22.dp))
                    .background(GlassWhite)
                    .padding(2.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(
                        Brush.linearGradient(
                            listOf(
                                GradientStart.copy(alpha = 0.08f),
                                GradientMid.copy(alpha = 0.04f)
                            )
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (type == EmptyFavoriteType.FEEDS)
                        Icons.Outlined.BookmarkBorder else Icons.Outlined.WorkOutline,
                    contentDescription = null,
                    modifier = Modifier.size(36.dp),
                    tint = GradientMid.copy(alpha = 0.6f)
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = when (type) {
                EmptyFavoriteType.FEEDS -> "Chưa có bài viết nào được lưu"
                EmptyFavoriteType.JOBS -> "Chưa có việc làm nào được lưu"
            },
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
            color = TextSecondary,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = when (type) {
                EmptyFavoriteType.FEEDS -> "Lưu lại những bài viết hữu ích\nđể xem lại sau nhé!"
                EmptyFavoriteType.JOBS -> "Lưu lại những công việc yêu thích\nđể ứng tuyển khi cần!"
            },
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary.copy(alpha = 0.6f),
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(24.dp))

        GradientButton(
            text = "Khám phá ngay",
            onClick = onExploreClick,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 32.dp)
        )
    }
}

enum class EmptyFavoriteType {
    FEEDS,
    JOBS
}
