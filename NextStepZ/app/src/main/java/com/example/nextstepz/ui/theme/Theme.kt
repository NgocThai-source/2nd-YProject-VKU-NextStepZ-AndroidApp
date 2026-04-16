package com.example.nextstepz.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// NextStepZ Dark Color Scheme
private val NextStepZDarkColorScheme = darkColorScheme(
    primary = CyanPrimary,
    onPrimary = Color.White,
    primaryContainer = CyanDark,
    onPrimaryContainer = CyanLight,
    secondary = BluePrimary,
    onSecondary = Color.White,
    secondaryContainer = BlueDark,
    onSecondaryContainer = BlueLight,
    tertiary = PurplePrimary,
    onTertiary = Color.White,
    background = SlateBackground,
    onBackground = TextPrimary,
    surface = SurfaceDark,
    onSurface = TextPrimary,
    surfaceVariant = SurfaceMedium,
    onSurfaceVariant = TextSecondary,
    error = ErrorRed,
    onError = Color.White,
    outline = GlassBorder,
    outlineVariant = DividerColor,
)

// NextStepZ Theme - Always dark
@Composable
fun NextStepZTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = NextStepZDarkColorScheme,
        typography = Typography,
        content = content
    )
}