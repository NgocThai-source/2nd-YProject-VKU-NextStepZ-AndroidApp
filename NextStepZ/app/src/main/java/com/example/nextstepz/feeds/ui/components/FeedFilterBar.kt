package com.example.nextstepz.feeds.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.nextstepz.feeds.data.model.PostType
import com.example.nextstepz.ui.theme.AccentAmber
import com.example.nextstepz.ui.theme.AccentCyan
import com.example.nextstepz.ui.theme.AccentEmerald
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextSecondary

data class FilterChip(
    val label: String,
    val type: PostType?
)

val filterChips = listOf(
    FilterChip("Tất cả", null),
    FilterChip("Bài viết", PostType.Article),
    FilterChip("Việc làm", PostType.Job),
    FilterChip("Mẹo nghề", PostType.Tips),
    FilterChip("Chia sẻ", PostType.Story)
)

@Composable
fun FeedFilterBar(
    selectedType: PostType?,
    onFilterSelected: (PostType?) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        filterChips.forEach { chip ->
            FilterChipItem(
                label = chip.label,
                isSelected = selectedType == chip.type,
                onClick = { onFilterSelected(chip.type) }
            )
        }
    }
}

@Composable
private fun FilterChipItem(
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(14.dp))
            .then(
                if (isSelected) {
                    Modifier.background(
                        Brush.horizontalGradient(
                            listOf(GradientStart, GradientMid, GradientEnd)
                        )
                    )
                } else {
                    Modifier.background(GlassWhite)
                }
            )
            .border(
                width = 1.dp,
                color = if (isSelected) GradientMid.copy(alpha = 0.5f) else GlassBorder,
                shape = RoundedCornerShape(14.dp)
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium.copy(
                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
            ),
            color = if (isSelected) {
                TextSecondary
            } else {
                TextSecondary.copy(alpha = 0.8f)
            }
        )
    }
}
