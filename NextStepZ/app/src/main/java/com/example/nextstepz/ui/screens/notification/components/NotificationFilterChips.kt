package com.example.nextstepz.ui.screens.notification.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.nextstepz.data.model.NotificationCategory
import com.example.nextstepz.ui.theme.BrandBlue
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary

data class NotificationTabItem(
    val category: NotificationCategory,
    val label: String,
    val unreadCount: Int = 0
)

@Composable
fun NotificationFilterChips(
    tabs: List<NotificationTabItem>,
    selectedCategory: NotificationCategory,
    onCategorySelected: (NotificationCategory) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .horizontalScroll(rememberScrollState())
            .padding(horizontal = 20.dp),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        tabs.forEach { tab ->
            FilterChipItem(
                tab = tab,
                isSelected = selectedCategory == tab.category,
                onClick = { onCategorySelected(tab.category) }
            )
        }
    }
}

@Composable
private fun FilterChipItem(
    tab: NotificationTabItem,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val backgroundColor = if (isSelected) {
        GradientMid.copy(alpha = 0.2f)
    } else {
        GlassWhite
    }

    val borderColor = if (isSelected) {
        GradientMid.copy(alpha = 0.5f)
    } else {
        GlassBorder
    }

    val textColor = if (isSelected) {
        TextPrimary
    } else {
        TextSecondary
    }

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(backgroundColor)
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Text(
                text = tab.label,
                style = MaterialTheme.typography.bodySmall.copy(
                    fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                ),
                color = textColor
            )

            if (tab.unreadCount > 0) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(if (isSelected) GradientMid else BrandBlue)
                        .padding(horizontal = 6.dp, vertical = 2.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (tab.unreadCount > 99) "99+" else tab.unreadCount.toString(),
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            fontSize = androidx.compose.ui.unit.TextUnit.Unspecified
                        ),
                        color = TextPrimary
                    )
                }
            }
        }
    }
}
