package com.example.nextstepz.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.outlined.Shield
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextSecondary
import com.example.nextstepz.ui.theme.TextTertiary
import com.example.nextstepz.auth.data.model.UserRole

private val UnverifiedGray = Color(0xFF4B5563)
private val UnverifiedBg = Color(0xFF1F2937)
private val UnverifiedBorder = Color(0xFF374151)

@Composable
fun RoleBadge(
    displayName: String,
    isVerified: Boolean,
    modifier: Modifier = Modifier
) {
    val bgColor = if (isVerified) GlassWhite else UnverifiedBg
    val borderColor = if (isVerified) {
        GlassWhite
    } else {
        UnverifiedBorder
    }
    val iconTint = if (isVerified) {
        GradientStart
    } else {
        UnverifiedGray
    }
    val textColor = if (isVerified) {
        TextSecondary
    } else {
        TextTertiary
    }

    Row(
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(bgColor)
            .border(1.dp, borderColor, RoundedCornerShape(20.dp))
            .padding(horizontal = 12.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = if (isVerified) Icons.Filled.Shield else Icons.Outlined.Shield,
            contentDescription = null,
            modifier = Modifier.size(14.dp),
            tint = iconTint
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
            text = displayName,
            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Medium),
            color = textColor
        )
    }
}

@Composable
fun RoleBadge(
    role: UserRole,
    isVerified: Boolean = false,
    modifier: Modifier = Modifier
) {
    RoleBadge(
        displayName = role.displayName,
        isVerified = isVerified || role != UserRole.GUEST,
        modifier = modifier
    )
}
