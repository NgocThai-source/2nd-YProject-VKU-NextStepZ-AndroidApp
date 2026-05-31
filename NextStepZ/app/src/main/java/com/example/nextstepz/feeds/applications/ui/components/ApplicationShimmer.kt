package com.example.nextstepz.feeds.applications.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart

@Composable
fun ApplicationShimmer(
    modifier: Modifier = Modifier
) {
    val infinite = rememberInfiniteTransition(label = "app_shimmer")
    val progress by infinite.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "app_shimmer_val"
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(GlassWhite)
            .padding(16.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            AppShimmerBlock(
                width = 48.dp,
                height = 48.dp,
                progress = progress,
                isCircle = true
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                AppShimmerBlock(
                    width = 160.dp,
                    height = 16.dp,
                    progress = progress,
                    modifier = Modifier.height(16.dp)
                )
                Spacer(modifier = Modifier.height(6.dp))
                AppShimmerBlock(
                    width = 200.dp,
                    height = 12.dp,
                    progress = progress,
                    modifier = Modifier.height(12.dp)
                )
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            AppShimmerBlock(
                width = 100.dp,
                height = 24.dp,
                progress = progress
            )
            Spacer(modifier = Modifier.width(8.dp))
            AppShimmerBlock(
                width = 80.dp,
                height = 24.dp,
                progress = progress
            )
        }
        Spacer(modifier = Modifier.height(12.dp))
        AppShimmerBlock(
            fillMax = true,
            height = 1.dp,
            progress = progress,
            isBrand = true
        )
    }
}

@Composable
private fun AppShimmerBlock(
    height: Dp,
    progress: Float,
    modifier: Modifier = Modifier,
    width: Dp? = null,
    fillMax: Boolean = false,
    isCircle: Boolean = false,
    isBrand: Boolean = false
) {
    val baseColors = if (isBrand) {
        listOf(
            GradientStart.copy(alpha = 0f),
            GradientMid.copy(alpha = 0.45f),
            GradientEnd.copy(alpha = 0.3f),
            GradientMid.copy(alpha = 0.45f),
            GradientStart.copy(alpha = 0f)
        )
    } else {
        listOf(
            GlassBorder.copy(alpha = 0.15f),
            GlassBorder.copy(alpha = 0.45f),
            GlassBorder.copy(alpha = 0.15f)
        )
    }

    Box(
        modifier = modifier
            .then(
                when {
                    fillMax -> Modifier.fillMaxWidth()
                    width != null -> Modifier.width(width)
                    else -> Modifier
                }
            )
            .height(height)
            .clip(if (isCircle) RoundedCornerShape(50) else RoundedCornerShape(6.dp))
            .background(
                Brush.horizontalGradient(
                    colorStops = baseColors.mapIndexed { idx, color ->
                        val stop = idx.toFloat() / (baseColors.size - 1)
                        val animatedStop = (stop + progress - 0.5f).coerceIn(0f, 1f)
                        animatedStop to color
                    }.toTypedArray()
                )
            )
    )
}
