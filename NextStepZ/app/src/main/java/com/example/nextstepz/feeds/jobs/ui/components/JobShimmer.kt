package com.example.nextstepz.feeds.jobs.ui.components

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
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Money
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.dp
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextSecondary

@Composable
fun JobShimmer(modifier: Modifier = Modifier) {
    val infinite = rememberInfiniteTransition(label = "job_shimmer")
    val progress by infinite.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "shimmer_val"
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(GlassWhite)
            .padding(16.dp)
    ) {
        // Row 1: Company avatar + name + location (44dp)
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.height(44.dp)
        ) {
            ShimmerBlock(
                width = 44.dp,
                height = 44.dp,
                progress = progress,
                isCircle = true
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                ShimmerBlock(
                    width = 130.dp,
                    height = 18.dp,
                    progress = progress,
                    modifier = Modifier.height(18.dp)
                )
                Spacer(modifier = Modifier.height(6.dp))
                ShimmerBlock(
                    width = 80.dp,
                    height = 14.dp,
                    progress = progress,
                    modifier = Modifier.height(14.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Row 2: Job title (min 44dp)
        ShimmerBlock(
            width = 220.dp,
            height = 22.dp,
            progress = progress,
            modifier = Modifier.heightIn(min = 44.dp)
        )

        Spacer(modifier = Modifier.height(10.dp))

        // Row 3: Meta chips (24dp)
        Row(
            modifier = Modifier.height(24.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            ShimmerBlock(width = 80.dp, height = 24.dp, progress = progress)
            ShimmerBlock(width = 100.dp, height = 24.dp, progress = progress)
            ShimmerBlock(width = 70.dp, height = 24.dp, progress = progress)
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Row 4: Skills (max 62dp)
        Row(
            modifier = Modifier.heightIn(max = 62.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            ShimmerBlock(width = 60.dp, height = 24.dp, progress = progress)
            ShimmerBlock(width = 80.dp, height = 24.dp, progress = progress)
            ShimmerBlock(width = 50.dp, height = 24.dp, progress = progress)
            ShimmerBlock(width = 70.dp, height = 24.dp, progress = progress)
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Divider
        ShimmerBlock(fillMax = true, height = 1.dp, progress = progress, isBrand = true)

        Spacer(modifier = Modifier.height(10.dp))

        // Row 5: Footer (32dp)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(32.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            ShimmerBlock(width = 120.dp, height = 14.dp, progress = progress)
            ShimmerBlock(width = 32.dp, height = 32.dp, progress = progress, isCircle = true)
        }
    }
}

@Composable
fun FeaturedJobShimmer(modifier: Modifier = Modifier) {
    val infinite = rememberInfiniteTransition(label = "featured_shimmer")
    val progress by infinite.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "shimmer_val"
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(GlassWhite)
            .padding(16.dp)
    ) {
        // Row 1: Badge + Avatar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            ShimmerBlock(width = 100.dp, height = 28.dp, progress = progress)
            ShimmerBlock(width = 40.dp, height = 40.dp, progress = progress, isCircle = true)
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Row 2: Job title (min 44dp)
        ShimmerBlock(
            width = 220.dp,
            height = 22.dp,
            progress = progress,
            modifier = Modifier.heightIn(min = 44.dp)
        )

        Spacer(modifier = Modifier.height(4.dp))

        // Row 3: Company name (18dp)
        ShimmerBlock(width = 150.dp, height = 18.dp, progress = progress)

        Spacer(modifier = Modifier.height(10.dp))

        // Row 4: Location + Salary (18dp)
        Row(
            modifier = Modifier.height(18.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            ShimmerBlock(width = 100.dp, height = 18.dp, progress = progress)
            ShimmerBlock(width = 120.dp, height = 18.dp, progress = progress)
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Row 5: Tags + count (26dp)
        Row(
            modifier = Modifier.height(26.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            ShimmerBlock(width = 80.dp, height = 22.dp, progress = progress)
            ShimmerBlock(width = 100.dp, height = 22.dp, progress = progress)
            Spacer(modifier = Modifier.width(4.dp))
            ShimmerBlock(width = 90.dp, height = 14.dp, progress = progress)
        }
    }
}

@Composable
private fun ShimmerBlock(
    width: androidx.compose.ui.unit.Dp? = null,
    height: androidx.compose.ui.unit.Dp,
    progress: Float,
    modifier: Modifier = Modifier,
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
            .clip(if (isCircle) CircleShape else RoundedCornerShape(6.dp))
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
