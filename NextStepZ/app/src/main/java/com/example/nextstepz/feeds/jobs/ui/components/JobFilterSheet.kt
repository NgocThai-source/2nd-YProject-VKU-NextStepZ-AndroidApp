package com.example.nextstepz.feeds.jobs.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RangeSlider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.nextstepz.feeds.jobs.data.model.ExperienceLevel
import com.example.nextstepz.feeds.jobs.data.model.JobFilterParams
import com.example.nextstepz.feeds.jobs.data.model.JobSortBy
import com.example.nextstepz.feeds.jobs.data.model.JobType
import com.example.nextstepz.ui.theme.AccentEmerald
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun JobFilterSheet(
    currentParams: JobFilterParams,
    onApply: (JobFilterParams) -> Unit,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

    var selectedJobType by remember { mutableStateOf(currentParams.jobType) }
    var selectedExperience by remember { mutableStateOf(currentParams.experienceLevel) }
    var salaryRange by remember {
        mutableStateOf(
            (currentParams.salaryMin?.toFloat() ?: 0f)..(currentParams.salaryMax?.toFloat() ?: 100f)
        )
    }
    var selectedSort by remember { mutableStateOf(currentParams.sortBy) }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(DarkBackground)
            .verticalScroll(scrollState)
            .padding(20.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Bộ lọc nâng cao",
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.Bold
                ),
                color = TextPrimary
            )

            Row {
                Text(
                    text = "Xóa lọc",
                    style = MaterialTheme.typography.labelMedium,
                    color = GradientMid,
                    modifier = Modifier
                        .clickable {
                            selectedJobType = null
                            selectedExperience = null
                            salaryRange = 0f..100f
                            selectedSort = JobSortBy.Newest
                        }
                        .padding(8.dp)
                )
                IconButton(onClick = onDismiss) {
                    Icon(
                        imageVector = Icons.Filled.Close,
                        contentDescription = "Đóng",
                        tint = TextSecondary
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        HorizontalDivider(color = GlassBorder.copy(alpha = 0.3f))

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "Loại công việc",
            style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.SemiBold
            ),
            color = TextPrimary
        )

        Spacer(modifier = Modifier.height(12.dp))

        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            JobType.entries.forEach { type ->
                FilterChip(
                    text = type.label,
                    isSelected = selectedJobType == type,
                    onClick = {
                        selectedJobType = if (selectedJobType == type) null else type
                    }
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        HorizontalDivider(color = GlassBorder.copy(alpha = 0.3f))

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "Cấp bậc",
            style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.SemiBold
            ),
            color = TextPrimary
        )

        Spacer(modifier = Modifier.height(12.dp))

        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            ExperienceLevel.entries.forEach { level ->
                FilterChip(
                    text = level.label,
                    isSelected = selectedExperience == level,
                    onClick = {
                        selectedExperience = if (selectedExperience == level) null else level
                    }
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        HorizontalDivider(color = GlassBorder.copy(alpha = 0.3f))

        Spacer(modifier = Modifier.height(20.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Mức lương",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                color = TextPrimary
            )
            Text(
                text = "${salaryRange.start.toInt()} - ${salaryRange.endInclusive.toInt()} triệu",
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                color = AccentEmerald
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        RangeSlider(
            value = salaryRange,
            onValueChange = { salaryRange = it },
            valueRange = 0f..100f,
            steps = 19,
            colors = SliderDefaults.colors(
                thumbColor = GradientMid,
                activeTrackColor = GradientMid,
                inactiveTrackColor = GlassBorder
            ),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(20.dp))

        HorizontalDivider(color = GlassBorder.copy(alpha = 0.3f))

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "Sắp xếp theo",
            style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.SemiBold
            ),
            color = TextPrimary
        )

        Spacer(modifier = Modifier.height(12.dp))

        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            JobSortBy.entries.forEach { sort ->
                FilterChip(
                    text = sort.label,
                    isSelected = selectedSort == sort,
                    onClick = { selectedSort = sort }
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .height(52.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(GlassWhite)
                    .border(1.dp, GlassBorder, RoundedCornerShape(14.dp))
                    .clickable(onClick = onDismiss),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Hủy",
                    style = MaterialTheme.typography.labelLarge,
                    color = TextSecondary
                )
            }

            Box(
                modifier = Modifier
                    .weight(1f)
                    .height(52.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(
                        Brush.horizontalGradient(
                            listOf(GradientStart, GradientMid, GradientEnd)
                        )
                    )
                    .clickable {
                        onApply(
                            currentParams.copy(
                                jobType = selectedJobType,
                                experienceLevel = selectedExperience,
                                salaryMin = salaryRange.start.toInt().takeIf { it > 0 },
                                salaryMax = salaryRange.endInclusive.toInt().takeIf { it < 100 },
                                sortBy = selectedSort
                            )
                        )
                    },
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Áp dụng",
                    style = MaterialTheme.typography.labelLarge.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = TextPrimary
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}

@Composable
private fun FilterChip(
    text: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .background(
                if (isSelected) {
                    Brush.horizontalGradient(listOf(GradientStart.copy(alpha = 0.2f), GradientMid.copy(alpha = 0.15f))
                    )
                } else {
                    Brush.horizontalGradient(listOf(GlassWhite, GlassWhite))
                }
            )
            .border(
                width = if (isSelected) 1.5.dp else 1.dp,
                color = if (isSelected) GradientMid else GlassBorder,
                shape = RoundedCornerShape(12.dp)
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 8.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            if (isSelected) {
                Icon(
                    imageVector = Icons.Filled.Check,
                    contentDescription = null,
                    tint = GradientMid,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
            }
            Text(
                text = text,
                style = MaterialTheme.typography.labelMedium.copy(
                    fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                ),
                color = if (isSelected) GradientMid else TextSecondary
            )
        }
    }
}
