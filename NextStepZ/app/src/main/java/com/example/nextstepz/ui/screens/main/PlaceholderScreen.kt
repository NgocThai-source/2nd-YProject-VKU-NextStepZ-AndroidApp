package com.example.nextstepz.ui.screens.main

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.nextstepz.ui.components.GradientIcon
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextSecondary

/**
 * Placeholder screen for tabs not yet developed.
 */
@Composable
fun PlaceholderScreen(title: String, icon: ImageVector) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            GradientIcon(
                imageVector = icon,
                contentDescription = title,
                modifier = Modifier.size(64.dp),
                brush = Brush.linearGradient(
                    listOf(GradientStart.copy(0.5f), GradientMid.copy(0.5f), GradientEnd.copy(0.5f))
                )
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(title, style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.SemiBold), color = TextSecondary)
            Spacer(modifier = Modifier.height(8.dp))
            Text("Đang phát triển...", style = MaterialTheme.typography.bodyMedium, color = TextSecondary.copy(alpha = 0.6f), textAlign = TextAlign.Center)
        }
    }
}
