package com.example.nextstepz.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import com.example.nextstepz.ui.theme.BlueBackground
import com.example.nextstepz.ui.theme.BluePrimary
import com.example.nextstepz.ui.theme.CyanPrimary
import com.example.nextstepz.ui.theme.PurplePrimary
import com.example.nextstepz.ui.theme.SlateBackground
import kotlin.math.cos
import kotlin.math.sin

// Animated Gradient Background with floating orbs
@Composable
fun AnimatedGradientBackground(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "bg_transition")

    val orb1Progress by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 8000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "orb1"
    )

    val orb2Progress by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 10000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "orb2"
    )

    val orb3Progress by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 12000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "orb3"
    )

    Box(modifier = modifier.fillMaxSize()) {
        // Base gradient background
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            SlateBackground,
                            BlueBackground,
                            SlateBackground
                        )
                    )
                )
        )

        // Animated gradient orbs
        Canvas(modifier = Modifier.fillMaxSize()) {
            val w = size.width
            val h = size.height

            // Orb 1: Cyan (top-right)
            val orb1X = w * 0.8f + 50f * cos(Math.toRadians(orb1Progress.toDouble())).toFloat()
            val orb1Y = h * 0.15f + 30f * sin(Math.toRadians(orb1Progress.toDouble())).toFloat()
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        CyanPrimary.copy(alpha = 0.15f),
                        CyanPrimary.copy(alpha = 0.05f),
                        Color.Transparent
                    ),
                    center = Offset(orb1X, orb1Y),
                    radius = w * 0.45f
                ),
                radius = w * 0.45f,
                center = Offset(orb1X, orb1Y)
            )

            // Orb 2: Blue (bottom-left)
            val orb2X = w * 0.2f - 50f * cos(Math.toRadians(orb2Progress.toDouble())).toFloat()
            val orb2Y = h * 0.85f - 30f * sin(Math.toRadians(orb2Progress.toDouble())).toFloat()
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        BluePrimary.copy(alpha = 0.12f),
                        BluePrimary.copy(alpha = 0.04f),
                        Color.Transparent
                    ),
                    center = Offset(orb2X, orb2Y),
                    radius = w * 0.45f
                ),
                radius = w * 0.45f,
                center = Offset(orb2X, orb2Y)
            )

            // Orb 3: Purple (center-right)
            val orb3X = w * 0.65f + 30f * cos(Math.toRadians(orb3Progress.toDouble())).toFloat()
            val orb3Y = h * 0.4f - 40f * sin(Math.toRadians(orb3Progress.toDouble())).toFloat()
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        PurplePrimary.copy(alpha = 0.10f),
                        PurplePrimary.copy(alpha = 0.03f),
                        Color.Transparent
                    ),
                    center = Offset(orb3X, orb3Y),
                    radius = w * 0.35f
                ),
                radius = w * 0.35f,
                center = Offset(orb3X, orb3Y)
            )
        }

        content()
    }
}
