package com.example.nextstepz.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import com.example.nextstepz.ui.theme.BrandMagenta
import com.example.nextstepz.ui.theme.BrandPurple
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import kotlin.math.cos
import kotlin.math.sin

/**
 * Animated gradient background with floating orbs.
 * Creates a premium dark background with subtle, slowly-moving gradient orbs
 * that give the UI a living, breathing feel.
 */
@Composable
fun AnimatedGradientBackground(
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "bg_anim")

    val animProgress1 by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 20000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "orb1"
    )

    val animProgress2 by infiniteTransition.animateFloat(
        initialValue = 180f,
        targetValue = 540f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 25000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "orb2"
    )

    val animProgress3 by infiniteTransition.animateFloat(
        initialValue = 90f,
        targetValue = 450f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 30000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "orb3"
    )

    Canvas(modifier = modifier.fillMaxSize()) {
        val w = size.width
        val h = size.height

        // Dark background base
        drawRect(color = DarkBackground)

        // Floating orb 1 — Blue (top-right area)
        val orb1X = w * 0.7f + cos(Math.toRadians(animProgress1.toDouble())).toFloat() * w * 0.15f
        val orb1Y = h * 0.2f + sin(Math.toRadians(animProgress1.toDouble())).toFloat() * h * 0.1f
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(
                    GradientStart.copy(alpha = 0.20f),
                    GradientStart.copy(alpha = 0.05f),
                    Color.Transparent
                ),
                center = Offset(orb1X, orb1Y),
                radius = w * 0.5f
            ),
            radius = w * 0.5f,
            center = Offset(orb1X, orb1Y)
        )

        // Floating orb 2 — Purple (center-left area)
        val orb2X = w * 0.25f + cos(Math.toRadians(animProgress2.toDouble())).toFloat() * w * 0.12f
        val orb2Y = h * 0.55f + sin(Math.toRadians(animProgress2.toDouble())).toFloat() * h * 0.08f
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(
                    GradientMid.copy(alpha = 0.15f),
                    BrandPurple.copy(alpha = 0.05f),
                    Color.Transparent
                ),
                center = Offset(orb2X, orb2Y),
                radius = w * 0.45f
            ),
            radius = w * 0.45f,
            center = Offset(orb2X, orb2Y)
        )

        // Floating orb 3 — Magenta (bottom-right area)
        val orb3X = w * 0.8f + cos(Math.toRadians(animProgress3.toDouble())).toFloat() * w * 0.1f
        val orb3Y = h * 0.85f + sin(Math.toRadians(animProgress3.toDouble())).toFloat() * h * 0.06f
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(
                    GradientEnd.copy(alpha = 0.12f),
                    BrandMagenta.copy(alpha = 0.04f),
                    Color.Transparent
                ),
                center = Offset(orb3X, orb3Y),
                radius = w * 0.4f
            ),
            radius = w * 0.4f,
            center = Offset(orb3X, orb3Y)
        )
    }
}
