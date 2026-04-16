package com.example.nextstepz.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.example.nextstepz.ui.theme.CyanPrimary
import com.example.nextstepz.ui.theme.BluePrimary
import com.example.nextstepz.ui.theme.PurplePrimary
import com.example.nextstepz.ui.theme.GlassBorder

// Glassmorphism Card - Semi-transparent with gradient border
@Composable
fun GlassmorphismCard(
    modifier: Modifier = Modifier,
    cornerRadius: Dp = 24.dp,
    content: @Composable () -> Unit
) {
    val shape = RoundedCornerShape(cornerRadius)

    Box(
        modifier = modifier
            .clip(shape)
            .background(
                Brush.linearGradient(
                    colors = listOf(
                        CyanPrimary.copy(alpha = 0.12f),
                        BluePrimary.copy(alpha = 0.08f),
                        PurplePrimary.copy(alpha = 0.12f),
                    )
                )
            )
            .border(
                width = 1.dp,
                color = GlassBorder,
                shape = shape
            )
            .padding(horizontal = 24.dp, vertical = 32.dp)
    ) {
        content()
    }
}
