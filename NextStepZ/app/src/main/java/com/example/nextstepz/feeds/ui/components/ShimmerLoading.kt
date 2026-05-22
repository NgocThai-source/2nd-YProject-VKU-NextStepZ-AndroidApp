package com.example.nextstepz.feeds.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
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
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart

@Composable
fun ShimmerPostCard(modifier: Modifier = Modifier) {
    val infinite = rememberInfiniteTransition(label = "card_shimmer")
    val progress by infinite.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "card_progress"
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(GlassWhite)
            .padding(20.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            ShimmerBlock(
                width = 48.dp,
                height = 48.dp,
                shape = RoundedCornerShape(24.dp),
                progress = progress,
                isBrand = false
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                ShimmerBlock(
                    width = 130.dp,
                    height = 14.dp,
                    progress = progress,
                    isBrand = false
                )
                Spacer(modifier = Modifier.height(6.dp))
                ShimmerBlock(
                    width = 90.dp,
                    height = 10.dp,
                    progress = progress,
                    isBrand = false
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        repeat(3) {
            ShimmerBlock(
                fillMax = true,
                height = 12.dp,
                progress = progress,
                isBrand = false
            )
            Spacer(modifier = Modifier.height(8.dp))
        }

        Spacer(modifier = Modifier.height(4.dp))

        ShimmerBlock(
            width = 160.dp,
            height = 12.dp,
            progress = progress,
            isBrand = false
        )

        Spacer(modifier = Modifier.height(16.dp))

        ShimmerBlock(
            fillMax = true,
            height = 1.dp,
            progress = progress,
            isBrand = true
        )
    }
}

@Composable
private fun ShimmerBlock(
    height: Dp,
    progress: Float,
    modifier: Modifier = Modifier,
    width: Dp? = null,
    fillMax: Boolean = false,
    shape: RoundedCornerShape = RoundedCornerShape(6.dp),
    isBrand: Boolean = false
) {
    val baseColors = if (isBrand) {
        listOf(
            GradientStart.copy(alpha = 0f),
            GradientMid.copy(alpha = 0.5f),
            GradientEnd.copy(alpha = 0.3f),
            GradientMid.copy(alpha = 0.5f),
            GradientStart.copy(alpha = 0f)
        )
    } else {
        listOf(
            GlassBorder.copy(alpha = 0.15f),
            GlassBorder.copy(alpha = 0.5f),
            GlassBorder.copy(alpha = 0.15f)
        )
    }

    Box(
        modifier = modifier
            .then(
                if (fillMax) Modifier.fillMaxWidth()
                else if (width != null) Modifier.width(width)
                else Modifier
            )
            .height(height)
            .clip(shape)
            .background(
                Brush.horizontalGradient(
                    colorStops = baseColors.mapIndexed { index, color ->
                        val stop = index.toFloat() / (baseColors.size - 1)
                        val animatedStop = (stop + progress - 0.5f).coerceIn(0f, 1f)
                        animatedStop to color
                    }.toTypedArray()
                )
            )
    )
}

@Composable
fun ShimmerLoadingList(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        repeat(4) {
            ShimmerPostCard()
        }
    }
}

@Composable
fun RefreshSpinner(modifier: Modifier = Modifier) {
    val infinite = rememberInfiniteTransition(label = "spinner")
    val rotation by infinite.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "spinner_rot"
    )

    Box(
        modifier = modifier.size(32.dp),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .size(32.dp)
                .rotate(rotation)
                .clip(CircleShape)
                .background(
                    Brush.sweepGradient(
                        listOf(
                            Color.Transparent,
                            GradientStart,
                            GradientMid,
                            GradientEnd,
                            GradientStart,
                            Color.Transparent
                        )
                    )
                )
        )
        Box(
            modifier = Modifier
                .size(22.dp)
                .clip(CircleShape)
                .background(DarkBackground)
        )
    }
}

@Composable
fun RefreshHeader(
    isRefreshing: Boolean,
    modifier: Modifier = Modifier
) {
    if (isRefreshing) {
        Column(
            modifier = modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            RefreshSpinner()
        }
    }
}
