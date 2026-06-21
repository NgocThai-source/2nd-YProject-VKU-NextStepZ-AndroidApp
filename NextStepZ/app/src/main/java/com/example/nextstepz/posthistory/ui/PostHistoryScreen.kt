package com.example.nextstepz.posthistory.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.clickable
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Article
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.AttachMoney
import androidx.compose.material.icons.filled.ChatBubbleOutline
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Groups
import androidx.compose.material.icons.filled.Inbox
import androidx.compose.material.icons.filled.WorkOutline
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.PullToRefreshDefaults
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.nextstepz.posthistory.data.model.JobApproval
import com.example.nextstepz.posthistory.data.model.JobHistoryItem
import com.example.nextstepz.posthistory.data.model.PostHistoryItem
import com.example.nextstepz.posthistory.data.model.PostVisibility
import com.example.nextstepz.posthistory.viewmodel.PostHistoryViewModel
import com.example.nextstepz.ui.components.AnimatedGradientBackground
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.DarkSurface
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.InfoBlue
import com.example.nextstepz.ui.theme.SuccessGreen
import com.example.nextstepz.ui.theme.TextOnGradient
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary
import com.example.nextstepz.ui.theme.TextTertiary
import com.example.nextstepz.ui.theme.WarningYellow

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PostHistoryScreen(
    onNavigateBack: () -> Unit,
    viewModel: PostHistoryViewModel = viewModel(),
) {
    val state by viewModel.uiState
    val pullState = rememberPullToRefreshState()
    var selectedTab by remember { mutableStateOf(0) } // 0 = posts, 1 = jobs (employer only)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
    ) {
        AnimatedGradientBackground()

        Column(
            modifier = Modifier
                .fillMaxSize()
                .systemBarsPadding()
        ) {
            // Top bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onNavigateBack) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Quay lại",
                        tint = TextPrimary
                    )
                }
                Spacer(modifier = Modifier.width(4.dp))
                Column {
                    Text(
                        text = "Lịch sử bài đăng",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.SemiBold),
                        color = TextPrimary
                    )
                    Text(
                        text = if (state.isEmployer) "Bài viết & tin tuyển dụng của bạn"
                        else "Những bài viết bạn đã đăng",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )
                }
            }

            // Tabs (employer only)
            if (state.isEmployer) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    TabPill("Bài viết", state.posts.size, selectedTab == 0, Modifier.weight(1f)) { selectedTab = 0 }
                    TabPill("Việc làm", state.jobs.size, selectedTab == 1, Modifier.weight(1f)) { selectedTab = 1 }
                }
            }

            PullToRefreshBox(
                isRefreshing = state.isRefreshing,
                onRefresh = { viewModel.refresh() },
                modifier = Modifier.fillMaxSize(),
                state = pullState,
                indicator = {
                    PullToRefreshDefaults.Indicator(
                        state = pullState,
                        isRefreshing = state.isRefreshing,
                        modifier = Modifier.align(Alignment.TopCenter),
                        containerColor = DarkSurface,
                        color = GradientMid,
                    )
                },
            ) {
                when {
                    state.isLoading -> CenterFill { CircularProgressIndicator(color = GradientMid) }
                    state.signedOut -> CenterFill {
                        EmptyInfo(Icons.Filled.Inbox, "Bạn chưa đăng nhập", "Đăng nhập để xem lịch sử bài đăng của bạn.")
                    }
                    state.error != null -> CenterFill {
                        EmptyInfo(Icons.Filled.Inbox, "Không tải được dữ liệu", state.error ?: "")
                    }
                    else -> {
                        val showJobs = state.isEmployer && selectedTab == 1
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 100.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            if (showJobs) {
                                if (state.jobs.isEmpty()) {
                                    item { FillItem { EmptyInfo(Icons.Filled.WorkOutline, "Chưa có tin tuyển dụng", "Các tin tuyển dụng bạn đăng sẽ xuất hiện ở đây.") } }
                                } else {
                                    items(state.jobs, key = { it.id }) { JobCard(it) }
                                }
                            } else {
                                if (state.posts.isEmpty()) {
                                    item { FillItem { EmptyInfo(Icons.AutoMirrored.Filled.Article, "Chưa có bài viết", "Những bài viết bạn đăng sẽ xuất hiện ở đây.") } }
                                } else {
                                    items(state.posts, key = { it.id }) { PostCard(it) }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// ─── Tabs ───────────────────────────────────────────────────────────────────

@Composable
private fun TabPill(
    label: String,
    count: Int,
    selected: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit,
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .then(
                if (selected) Modifier.background(
                    Brush.horizontalGradient(listOf(GradientStart, GradientMid, GradientEnd))
                ) else Modifier
                    .background(GlassWhite)
                    .border(1.dp, GlassBorder, RoundedCornerShape(12.dp))
            )
            .clickable(onClick = onClick)
            .padding(vertical = 10.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = if (count > 0) "$label ($count)" else label,
            style = MaterialTheme.typography.labelLarge,
            color = if (selected) TextOnGradient else TextSecondary
        )
    }
}

// ─── Post card ────────────────────────────────────────────────────────────────

@Composable
private fun PostCard(item: PostHistoryItem) {
    GlassRow {
        Row(verticalAlignment = Alignment.Top) {
            LeadingIcon(Icons.AutoMirrored.Filled.Article, InfoBlue)
            Spacer(modifier = Modifier.width(14.dp))
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Tag(item.type, InfoBlue)
                    Spacer(modifier = Modifier.width(8.dp))
                    val c = item.visibility.color()
                    Tag(item.visibility.label, c)
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = item.content,
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextPrimary,
                    maxLines = 3,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(10.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconCount(Icons.Filled.FavoriteBorder, item.likeCount)
                    Spacer(modifier = Modifier.width(14.dp))
                    IconCount(Icons.Filled.ChatBubbleOutline, item.commentCount)
                    Spacer(modifier = Modifier.weight(1f))
                    Text(item.dateLabel, style = MaterialTheme.typography.labelSmall, color = TextTertiary)
                }
            }
        }
    }
}

// ─── Job card ─────────────────────────────────────────────────────────────────

@Composable
private fun JobCard(item: JobHistoryItem) {
    GlassRow {
        Row(verticalAlignment = Alignment.Top) {
            LeadingIcon(Icons.Filled.WorkOutline, GradientMid)
            Spacer(modifier = Modifier.width(14.dp))
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.Top) {
                    Text(
                        text = item.title,
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.SemiBold),
                        color = TextPrimary,
                        modifier = Modifier.weight(1f),
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Tag(item.approval.label, item.approval.color())
                }
                Spacer(modifier = Modifier.height(8.dp))
                InfoLine(Icons.Filled.AttachMoney, item.salaryText)
                Spacer(modifier = Modifier.height(4.dp))
                InfoLine(Icons.Filled.WorkOutline, item.jobType)
                Spacer(modifier = Modifier.height(4.dp))
                InfoLine(Icons.Filled.AccessTime, "Hạn: ${item.deadline}")
                Spacer(modifier = Modifier.height(10.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconCount(Icons.Filled.Groups, item.applicationCount)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("ứng viên", style = MaterialTheme.typography.labelSmall, color = TextTertiary)
                    Spacer(modifier = Modifier.weight(1f))
                    Text(item.dateLabel, style = MaterialTheme.typography.labelSmall, color = TextTertiary)
                }
            }
        }
    }
}

// ─── Shared bits ──────────────────────────────────────────────────────────────

@Composable
private fun GlassRow(content: @Composable () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(GlassWhite)
            .border(1.dp, GlassBorder, RoundedCornerShape(20.dp))
            .padding(16.dp)
    ) { content() }
}

@Composable
private fun LeadingIcon(icon: ImageVector, accent: Color) {
    Box(
        modifier = Modifier
            .size(44.dp)
            .clip(RoundedCornerShape(14.dp))
            .background(accent.copy(alpha = 0.16f)),
        contentAlignment = Alignment.Center
    ) {
        Icon(imageVector = icon, contentDescription = null, tint = accent, modifier = Modifier.size(22.dp))
    }
}

@Composable
private fun Tag(label: String, accent: Color) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(accent.copy(alpha = 0.14f))
            .padding(horizontal = 8.dp, vertical = 3.dp)
    ) {
        Text(label, style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Medium), color = accent)
    }
}

@Composable
private fun InfoLine(icon: ImageVector, text: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(icon, contentDescription = null, tint = TextTertiary, modifier = Modifier.size(15.dp))
        Spacer(modifier = Modifier.width(6.dp))
        Text(text, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
    }
}

@Composable
private fun IconCount(icon: ImageVector, count: Int) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(icon, contentDescription = null, tint = TextTertiary, modifier = Modifier.size(15.dp))
        Spacer(modifier = Modifier.width(4.dp))
        Text("$count", style = MaterialTheme.typography.labelSmall, color = TextSecondary)
    }
}

@Composable
private fun CenterFill(content: @Composable () -> Unit) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { content() }
}

@Composable
private fun androidx.compose.foundation.lazy.LazyItemScope.FillItem(content: @Composable () -> Unit) {
    Box(modifier = Modifier.fillParentMaxSize().padding(24.dp), contentAlignment = Alignment.Center) { content() }
}

@Composable
private fun EmptyInfo(icon: ImageVector, title: String, subtitle: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(24.dp)) {
        Box(
            modifier = Modifier
                .size(84.dp)
                .clip(RoundedCornerShape(26.dp))
                .background(GlassWhite),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, contentDescription = null, tint = GradientMid, modifier = Modifier.size(38.dp))
        }
        Spacer(modifier = Modifier.height(16.dp))
        Text(title, style = MaterialTheme.typography.titleMedium, color = TextPrimary, textAlign = TextAlign.Center)
        Spacer(modifier = Modifier.height(6.dp))
        Text(subtitle, style = MaterialTheme.typography.bodyMedium, color = TextSecondary, textAlign = TextAlign.Center)
    }
}

private fun PostVisibility.color(): Color = when (this) {
    PostVisibility.PUBLISHED -> SuccessGreen
    PostVisibility.HIDDEN -> WarningYellow
    PostVisibility.DELETED -> ErrorRed
}

private fun JobApproval.color(): Color = when (this) {
    JobApproval.PENDING -> WarningYellow
    JobApproval.APPROVED -> SuccessGreen
    JobApproval.REJECTED -> ErrorRed
}
