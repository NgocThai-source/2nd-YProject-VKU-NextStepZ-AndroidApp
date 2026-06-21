package com.example.nextstepz.feeds.jobs.ui.components

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.CardGiftcard
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Money
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.BookmarkBorder
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.nextstepz.feeds.jobs.data.model.Job
import com.example.nextstepz.feeds.jobs.viewmodel.JobsViewModel
import com.example.nextstepz.ui.components.GradientButton
import com.example.nextstepz.ui.theme.AccentAmber
import com.example.nextstepz.ui.theme.AccentEmerald
import com.example.nextstepz.ui.theme.AccentOrange
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary
import com.example.nextstepz.ui.theme.TextTertiary

@RequiresApi(Build.VERSION_CODES.O)
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun JobDetailSheet(
    job: Job?,
    isSaved: Boolean,
    isApplying: Boolean,
    applyMessage: String?,
    onApplyClick: () -> Unit,
    onSaveClick: () -> Unit,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: JobsViewModel = viewModel()
) {
    val scrollState = rememberScrollState()
    val isEmployer = viewModel.isEmployer
    val isGuest = viewModel.isGuest
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
                text = "Chi tiết việc làm",
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.Bold
                ),
                color = TextPrimary
            )

            Row {
                IconButton(onClick = onSaveClick) {
                    Icon(
                        imageVector = if (isSaved) Icons.Filled.Bookmark else Icons.Outlined.BookmarkBorder,
                        contentDescription = if (isSaved) "Bỏ lưu" else "Lưu",
                        tint = if (isSaved) AccentAmber else TextSecondary
                    )
                }
                IconButton(onClick = onDismiss) {
                    Icon(
                        imageVector = Icons.Filled.Close,
                        contentDescription = "Đóng",
                        tint = TextSecondary
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Box(
            modifier = Modifier
                .size(56.dp)
                .clip(RoundedCornerShape(14.dp))
                .background(
                    Brush.linearGradient(
                        listOf(
                            GradientStart.copy(alpha = 0.2f),
                            GradientMid.copy(alpha = 0.15f)
                        )
                    )
                ),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = job?.companyName?.take(2)?.uppercase() ?: "",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold
                ),
                color = GradientMid
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = job?.title ?: "",
            style = MaterialTheme.typography.headlineSmall.copy(
                fontWeight = FontWeight.Bold
            ),
            color = TextPrimary
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = job?.companyName ?: "",
            style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.SemiBold
            ),
            color = GradientMid
        )

        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            if (job?.isFeatured ?: false) {
                Badge(text = "NỔI BẬT", color = GradientMid)
            }
            Badge(text = job?.postedDisplay ?: "", color = TextTertiary)
        }

        Spacer(modifier = Modifier.height(20.dp))

        HorizontalDivider(color = GlassBorder.copy(alpha = 0.3f))

        Spacer(modifier = Modifier.height(20.dp))

        SectionTitle(title = "Thông tin cơ bản")

        Spacer(modifier = Modifier.height(12.dp))

        DetailGrid(
            items = listOf(
                DetailInfo(Icons.Filled.Money, "Lương", job?.salaryDisplay ?: "", AccentEmerald),
                DetailInfo(Icons.Filled.Schedule, "Loại công việc",
                    job?.jobType?.label ?: "", GradientMid),
                DetailInfo(Icons.Filled.Star, "Cấp bậc", job?.experienceLevel?.label ?: "", AccentAmber),
                DetailInfo(Icons.Filled.LocationOn, "Địa điểm", job?.location ?: "", AccentOrange),
                DetailInfo(Icons.Filled.AccessTime, "Hạn nộp", job?.deadline?.take(10) ?: "", ErrorRed),
                DetailInfo(Icons.Filled.Description, "Ngành", job?.companyIndustry ?: "N/A", TextSecondary)
            )
        )

        Spacer(modifier = Modifier.height(20.dp))

        HorizontalDivider(color = GlassBorder.copy(alpha = 0.3f))

        Spacer(modifier = Modifier.height(20.dp))

        SectionTitle(title = "Mô tả công việc")

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = job?.description ?: "",
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary,
            lineHeight = MaterialTheme.typography.bodyMedium.lineHeight * 1.3f
        )

        Spacer(modifier = Modifier.height(20.dp))

        HorizontalDivider(color = GlassBorder.copy(alpha = 0.3f))

        Spacer(modifier = Modifier.height(20.dp))

        SectionTitle(title = "Yêu cầu")

        Spacer(modifier = Modifier.height(12.dp))

        job?.requirements?.forEach { req ->
            Row(
                verticalAlignment = Alignment.Top,
                modifier = Modifier.padding(vertical = 4.dp)
            ) {
                Icon(
                    imageVector = Icons.Filled.Check,
                    contentDescription = null,
                    tint = AccentEmerald,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = req,
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        HorizontalDivider(color = GlassBorder.copy(alpha = 0.3f))

        Spacer(modifier = Modifier.height(20.dp))

        SectionTitle(title = "Quyền lợi")

        Spacer(modifier = Modifier.height(12.dp))

        job?.benefits?.forEach { benefit ->
            Row(
                verticalAlignment = Alignment.Top,
                modifier = Modifier.padding(vertical = 4.dp)
            ) {
                Icon(
                    imageVector = Icons.Filled.CardGiftcard,
                    contentDescription = null,
                    tint = GradientMid,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = benefit,
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        SectionTitle(title = "Kỹ năng")

        Spacer(modifier = Modifier.height(12.dp))

        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            job?.skills?.forEach { skill ->
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(GradientMid.copy(alpha = 0.12f))
                        .border(
                            width = 1.dp,
                            color = GradientMid.copy(alpha = 0.3f),
                            shape = RoundedCornerShape(8.dp)
                        )
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = skill,
                        style = MaterialTheme.typography.labelMedium,
                        color = GradientMid
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        HorizontalDivider(color = GlassBorder.copy(alpha = 0.3f))

        Spacer(modifier = Modifier.height(20.dp))

        SectionTitle(title = "Thông tin công ty")

        Spacer(modifier = Modifier.height(12.dp))

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(GlassWhite)
                .border(1.dp, GlassBorder, RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                Brush.linearGradient(
                                    listOf(GradientStart.copy(alpha = 0.2f), GradientMid.copy(alpha = 0.15f))
                                )
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = job?.companyName?.take(2)?.uppercase() ?: "",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = GradientMid
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = job?.companyName ?: "",
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                            color = TextPrimary
                        )
                        Text(
                            text = job?.companyIndustry ?: "Công nghệ",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary
                        )
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
                DetailRow(Icons.Filled.Person, "Quy mô", job?.companySize ?: "N/A")
                Spacer(modifier = Modifier.height(8.dp))
                DetailRow(Icons.Filled.LocationOn, "Địa chỉ", job?.companyAddress ?:"" )
                if (!job?.companyWebsite.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(8.dp))
                    DetailRow(Icons.Filled.Language, "Website", job.companyWebsite)
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        SectionTitle(title = "Liên hệ ứng tuyển")

        Spacer(modifier = Modifier.height(12.dp))

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(GlassWhite)
                .border(1.dp, GlassBorder, RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            Column {
                DetailRow(Icons.Filled.Person, "Người liên hệ", job?.employerName ?: "")
                Spacer(modifier = Modifier.height(8.dp))
                DetailRow(Icons.Filled.Email, "Email", job?.employerEmail ?: "")
                if (job?.employerPhone?.isNotBlank() ?: false) {
                    Spacer(modifier = Modifier.height(8.dp))
                    DetailRow(Icons.Filled.Phone, "Điện thoại", job?.employerPhone ?: "")
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        if (applyMessage != null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(
                        if (applyMessage.contains("thành công"))
                            AccentEmerald.copy(alpha = 0.15f)
                        else
                            ErrorRed.copy(alpha = 0.15f)
                    )
                    .padding(16.dp)
            ) {
                Text(
                    text = applyMessage,
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (applyMessage.contains("thành công")) AccentEmerald else ErrorRed
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        if(!isEmployer && !isGuest) {
            GradientButton(
                text = if (isApplying) "Đang gửi..." else "Ứng tuyển ngay",
                onClick = onApplyClick,
                isLoading = isApplying,
                enabled = !isApplying
            )
        }else {

        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}

@Composable
private fun SectionTitle(title: String) {
    Text(
        text = title,
        style = MaterialTheme.typography.titleMedium.copy(
            fontWeight = FontWeight.Bold
        ),
        color = TextPrimary
    )
}

@Composable
private fun Badge(text: String, color: Color) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(color.copy(alpha = 0.15f))
            .padding(horizontal = 10.dp, vertical = 5.dp)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.SemiBold
            ),
            color = color
        )
    }
}

@Composable
private fun DetailItem(
    icon: ImageVector,
    label: String,
    value: String,
    tint: Color
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .clip(RoundedCornerShape(10.dp))
            .background(tint.copy(alpha = 0.08f))
            .padding(horizontal = 12.dp, vertical = 10.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = tint,
            modifier = Modifier.size(18.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Column {
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall,
                color = TextTertiary
            )
            Text(
                text = value,
                style = MaterialTheme.typography.bodySmall.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                color = TextPrimary,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
private fun DetailGrid(items: List<DetailInfo>) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        items.chunked(2).forEach { row ->
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                row.forEach { item ->
                    Box(modifier = Modifier.weight(1f)) {
                        DetailItem(
                            icon = item.icon,
                            label = item.label,
                            value = item.value,
                            tint = item.tint
                        )
                    }
                }
                if (row.size == 1) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

private data class DetailInfo(
    val icon: ImageVector,
    val label: String,
    val value: String,
    val tint: Color
)

@Composable
private fun DetailRow(icon: ImageVector, label: String, value: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = TextTertiary,
            modifier = Modifier.size(16.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = "$label: ",
            style = MaterialTheme.typography.bodySmall,
            color = TextSecondary
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodySmall.copy(
                fontWeight = FontWeight.SemiBold
            ),
            color = TextPrimary,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis
        )
    }
}
