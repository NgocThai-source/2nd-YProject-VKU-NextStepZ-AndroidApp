package com.example.nextstepz.feeds.ui.components

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.outlined.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.nextstepz.feeds.data.model.ReportReason
import com.example.nextstepz.ui.components.GradientButton
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.InputBackground
import com.example.nextstepz.ui.theme.InputPlaceholder
import com.example.nextstepz.ui.theme.SuccessGreen
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary
import com.example.nextstepz.ui.theme.TextTertiary

@Composable
fun ReportModal(
    onDismiss: () -> Unit,
    onSubmit: (ReportReason, String) -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedReason by remember { mutableStateOf<ReportReason?>(null) }
    var customText by remember { mutableStateOf("") }
    var isSubmitted by remember { mutableStateOf(false) }

    Surface(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
        color = DarkBackground
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .windowInsetsPadding(WindowInsets.navigationBars)
                .padding(24.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Báo cáo bài viết",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = TextPrimary
                )
                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Close,
                        contentDescription = "Đóng",
                        tint = TextSecondary,
                        modifier = Modifier.size(22.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            AnimatedContent(
                targetState = isSubmitted,
                transitionSpec = {
                    (fadeIn(tween(300)) + slideInVertically(tween(300)))
                        .togetherWith(fadeOut(tween(200)) + slideOutVertically(tween(200)))
                },
                label = "report_post_transition",
                contentKey = { it }
            ) { submitted ->
                if (submitted) {
                    SuccessContent(onDismiss = onDismiss)
                } else {
                    ReportFormContent(
                        selectedReason = selectedReason,
                        customText = customText,
                        onReasonSelected = { selectedReason = it },
                        onCustomTextChanged = { customText = it },
                        onSubmit = {
                            selectedReason?.let { reason ->
                                onSubmit(reason, customText)
                                isSubmitted = true
                            }
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun ReportFormContent(
    selectedReason: ReportReason?,
    customText: String,
    onReasonSelected: (ReportReason) -> Unit,
    onCustomTextChanged: (String) -> Unit,
    onSubmit: () -> Unit
) {
    Column {
        Text(
            text = "Chọn lý do báo cáo:",
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        ReportReason.entries.forEach { reason ->
            key(reason) {
                ReportReasonItem(
                    reason = reason,
                    isSelected = selectedReason == reason,
                    onClick = { onReasonSelected(reason) }
                )
                Spacer(modifier = Modifier.height(8.dp))
            }
        }

        AnimatedContent(
            targetState = selectedReason == ReportReason.Other,
            transitionSpec = {
                (fadeIn(tween(250)) + slideInVertically(
                    animationSpec = tween(250, easing = FastOutSlowInEasing),
                    initialOffsetY = { -it / 3 }
                )).togetherWith(
                    fadeOut(tween(200)) + slideOutVertically(tween(200))
                )
            },
            label = "custom_input_post_transition",
            contentKey = { it }
        ) { showCustomInput ->
            if (showCustomInput) {
                CustomReasonInput(
                    value = customText,
                    onValueChange = onCustomTextChanged
                )
            } else {
                Spacer(modifier = Modifier.height(8.dp))
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        GradientButton(
            text = "Gửi báo cáo",
            onClick = onSubmit,
            enabled = selectedReason != null &&
                    (selectedReason != ReportReason.Other || customText.isNotBlank())
        )
    }
}

@Composable
private fun SuccessContent(onDismiss: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(64.dp)
                .clip(CircleShape)
                .background(SuccessGreen.copy(alpha = 0.15f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Filled.Check,
                contentDescription = null,
                tint = SuccessGreen,
                modifier = Modifier.size(32.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Đã gửi báo cáo!",
            style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.Bold
            ),
            color = TextPrimary
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Cảm ơn bạn đã phản hồi. Đã gửi báo cáo đến quản trị viên.",
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(20.dp))

        GradientButton(
            text = "Đóng",
            onClick = onDismiss,
            modifier = Modifier.fillMaxWidth()
        )
    }
}

@Composable
private fun CustomReasonInput(
    value: String,
    onValueChange: (String) -> Unit
) {
    Column {
        Text(
            text = "Mô tả chi tiết:",
            style = MaterialTheme.typography.bodySmall,
            color = TextSecondary,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(InputBackground)
                .border(1.dp, GlassBorder, RoundedCornerShape(12.dp))
                .padding(14.dp)
        ) {
            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                modifier = Modifier.fillMaxWidth(),
                textStyle = MaterialTheme.typography.bodyMedium.copy(color = TextPrimary),
                cursorBrush = SolidColor(GradientMid),
                decorationBox = { innerTextField ->
                    Box {
                        if (value.isEmpty()) {
                            Text(
                                text = "Nhập lý do báo cáo của bạn...",
                                style = MaterialTheme.typography.bodyMedium,
                                color = InputPlaceholder
                            )
                        }
                        innerTextField()
                    }
                },
                minLines = 3,
                maxLines = 5
            )
        }
    }
}

@Composable
private fun ReportReasonItem(
    reason: ReportReason,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(GlassWhite)
            .border(
                width = 1.dp,
                color = if (isSelected) GradientMid else GlassBorder,
                shape = RoundedCornerShape(12.dp)
            )
            .clickable(onClick = onClick)
            .padding(14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        RadioButton(
            selected = isSelected,
            onClick = onClick,
            colors = RadioButtonDefaults.colors(
                selectedColor = GradientMid,
                unselectedColor = TextTertiary
            )
        )
        Spacer(modifier = Modifier.width(10.dp))
        Text(
            text = reason.label,
            style = MaterialTheme.typography.bodyMedium.copy(
                fontWeight = if (isSelected) FontWeight.Medium else FontWeight.Normal
            ),
            color = if (isSelected) TextPrimary else TextSecondary
        )
    }
}
