package com.example.nextstepz.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// ─── NextStepZ Dark Color Scheme ────────────────────────────────────────────

private val NextStepZColorScheme = darkColorScheme(
    primary = BrandBlue,
    onPrimary = TextOnGradient,
    primaryContainer = GradientStart,
    onPrimaryContainer = TextPrimary,

    secondary = BrandPurple,
    onSecondary = TextOnGradient,
    secondaryContainer = DarkSurfaceVariant,
    onSecondaryContainer = TextPrimary,

    tertiary = BrandMagenta,
    onTertiary = TextOnGradient,
    tertiaryContainer = DarkSurfaceVariant,
    onTertiaryContainer = TextPrimary,

    background = DarkBackground,
    onBackground = TextPrimary,

    surface = DarkSurface,
    onSurface = TextPrimary,
    surfaceVariant = DarkSurfaceVariant,
    onSurfaceVariant = TextSecondary,

    outline = InputBorder,
    outlineVariant = GlassBorder,

    error = ErrorRed,
    onError = TextOnGradient,
    errorContainer = Color(0xFF93000A),
    onErrorContainer = Color(0xFFFFDAD6),

    inverseSurface = TextPrimary,
    inverseOnSurface = DarkBackground,
    inversePrimary = GradientStart,

    scrim = Color(0x99000000),
)

// ─── Theme Composable ───────────────────────────────────────────────────────

@Composable
fun NextStepZTheme(
    content: @Composable () -> Unit
) {
    val colorScheme = NextStepZColorScheme

    // Set status bar to transparent with light icons for edge-to-edge
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            @Suppress("DEPRECATION")
            window.statusBarColor = Color.Transparent.toArgb()
            @Suppress("DEPRECATION")
            window.navigationBarColor = Color.Transparent.toArgb()
            WindowCompat.getInsetsController(window, view).apply {
                isAppearanceLightStatusBars = false
                isAppearanceLightNavigationBars = false
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}