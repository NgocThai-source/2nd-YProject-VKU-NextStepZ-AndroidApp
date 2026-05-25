package com.example.nextstepz.feeds.jobs.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.SearchOff
import androidx.compose.material.icons.outlined.ErrorOutline
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.nextstepz.feeds.jobs.data.model.Job
import com.example.nextstepz.feeds.jobs.ui.components.CreateJobSheet
import com.example.nextstepz.feeds.jobs.ui.components.FeaturedJobCard
import com.example.nextstepz.feeds.jobs.ui.components.FeaturedJobShimmer
import com.example.nextstepz.feeds.jobs.ui.components.JobCard
import com.example.nextstepz.feeds.jobs.ui.components.JobCategoryChips
import com.example.nextstepz.feeds.jobs.ui.components.JobDetailSheet
import com.example.nextstepz.feeds.jobs.ui.components.JobFilterSheet
import com.example.nextstepz.feeds.jobs.ui.components.JobSearchBar
import com.example.nextstepz.feeds.jobs.ui.components.JobShimmer
import com.example.nextstepz.feeds.jobs.ui.components.ReportJobSheet
import com.example.nextstepz.feeds.ui.components.RefreshHeader
import com.example.nextstepz.feeds.jobs.viewmodel.JobDetailState
import com.example.nextstepz.feeds.jobs.viewmodel.JobFilterState
import com.example.nextstepz.feeds.jobs.viewmodel.JobsUiState
import com.example.nextstepz.feeds.jobs.viewmodel.JobsViewModel
import com.example.nextstepz.feeds.jobs.viewmodel.ReportState
import com.example.nextstepz.ui.components.SectionHeader
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary
import kotlinx.coroutines.delay

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun JobsScreen(
    viewModel: JobsViewModel = viewModel()
) {
    val uiState by viewModel.uiState
    val isRefreshing by viewModel.isRefreshing
    val selectedCategory by viewModel.selectedCategory
    val searchQuery by viewModel.searchQuery
    val detailState by viewModel.detailState
    val filterState by viewModel.filterState
    val isApplying by viewModel.isApplying
    val applyMessage by viewModel.applyMessage
    val isCreateJobVisible by viewModel.isCreateJobVisible
    val reportState by viewModel.reportState

    val pullRefreshState = rememberPullToRefreshState()
    val detailSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val filterSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val createJobSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    var refreshTick by remember { mutableIntStateOf(0) }

    LaunchedEffect(isRefreshing) {
        if (!isRefreshing) {
            refreshTick += 1
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        PullToRefreshBox(
            isRefreshing = isRefreshing,
            onRefresh = { viewModel.refreshJobs() },
            state = pullRefreshState,
            modifier = Modifier.fillMaxSize()
        ) {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(
                    start = 20.dp,
                    end = 20.dp,
                    top = 16.dp,
                    bottom = 100.dp
                ),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item {
                    Column {
                        Spacer(modifier = Modifier.height(8.dp))
                        SectionHeader(
                            title = "Việc làm"
                        )
                    }
                }

                item {
                    JobSearchBar(
                        query = searchQuery,
                        onQueryChange = { viewModel.setSearchQuery(it) },
                        onSearch = { viewModel.setSearchQuery(it) },
                        onFilterClick = { viewModel.showFilterSheet() }
                    )
                }

                item {
                    JobCategoryChips(
                        selectedCategory = selectedCategory,
                        onCategorySelected = { viewModel.setCategory(it) }
                    )
                }

                when (uiState) {
                    is JobsUiState.Loading -> {
                        item {
                            FeaturedJobShimmer()
                        }
                        item {
                            Text(
                                text = "Danh sách việc làm",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.SemiBold
                                ),
                                color = TextPrimary
                            )
                        }
                        items(
                            count = 5,
                            key = { index -> "shimmer_$index" }
                        ) { _ ->
                            JobShimmer()
                        }
                    }

                    is JobsUiState.Error -> {
                        item {
                            ErrorStateJobs(
                                message = (uiState as JobsUiState.Error).message,
                                onRetry = { viewModel.loadJobs() }
                            )
                        }
                    }

                    is JobsUiState.Success -> {
                        val state = uiState as JobsUiState.Success
                        val featuredJobs = state.featuredJobs

                        if (featuredJobs.isNotEmpty() && searchQuery.isBlank() && selectedCategory.name == "All") {
                            item {
                                FeaturedSection(
                                    featuredJobs = featuredJobs,
                                    refreshTick = refreshTick,
                                    onJobClick = { viewModel.showJobDetail(it.id) }
                                )
                            }
                        }

                        item {
                            AnimatedVisibility(
                                visible = isRefreshing,
                                enter = fadeIn(tween(200)),
                                exit = fadeOut(tween(200))
                            ) {
                                RefreshHeader(isRefreshing = true)
                            }
                        }

                        item {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Danh sách việc làm",
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        fontWeight = FontWeight.SemiBold
                                    ),
                                    color = TextPrimary
                                )
                                Text(
                                    text = "${state.jobs.size} việc",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = TextSecondary
                                )
                            }
                        }

                        if (state.jobs.isEmpty()) {
                            item {
                                EmptyStateJobs()
                            }
                        } else {
                            itemsIndexed(
                                state.jobs,
                                key = { _, job -> job.id }
                            ) { index, job ->
                                EngagedJobCard(
                                    job = job,
                                    index = index,
                                    refreshTick = refreshTick,
                                    onClick = { viewModel.showJobDetail(job.id) },
                                    onSaveClick = { viewModel.toggleSaveJob(job.id) },
                                    onReportClick = { viewModel.showReportSheet(job.id, job.title) }
                                )
                            }
                        }
                    }
                }
            }
        }

        when (val state = detailState) {
            is JobDetailState.Shown -> {
                ModalBottomSheet(
                    onDismissRequest = { viewModel.hideJobDetail() },
                    sheetState = detailSheetState,
                    containerColor = DarkBackground,
                    shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                    dragHandle = null
                ) {
                    JobDetailSheet(
                        job = state.job,
                        isSaved = state.job.isSaved,
                        isApplying = isApplying,
                        applyMessage = applyMessage,
                        onApplyClick = { viewModel.applyToJob(state.job.id) },
                        onSaveClick = { viewModel.toggleSaveJob(state.job.id) },
                        onDismiss = {
                            viewModel.hideJobDetail()
                            viewModel.clearApplyMessage()
                        }
                    )
                }
            }
            JobDetailState.Hidden -> {}
        }

        when (val state = filterState) {
            is JobFilterState.Shown -> {
                ModalBottomSheet(
                    onDismissRequest = { viewModel.hideFilterSheet() },
                    sheetState = filterSheetState,
                    containerColor = DarkBackground,
                    shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                    dragHandle = null
                ) {
                    JobFilterSheet(
                        currentParams = state.currentParams,
                        onApply = { viewModel.applyFilter(it) },
                        onDismiss = { viewModel.hideFilterSheet() }
                    )
                }
            }
            JobFilterState.Hidden -> {}
        }

        if (isCreateJobVisible) {
            ModalBottomSheet(
                onDismissRequest = { viewModel.hideCreateJobSheet() },
                sheetState = createJobSheetState,
                containerColor = DarkBackground,
                shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                dragHandle = null
            ) {
                CreateJobSheet(
                    onDismiss = { viewModel.hideCreateJobSheet() },
                    onPost = { title, companyName, companyAddress, location, salaryMin, salaryMax, jobType, expLevel, description, requirements, benefits, skills, deadline, companyWebsite ->
                        viewModel.createJob(title, companyName, companyAddress, location, salaryMin, salaryMax, jobType, expLevel, description, requirements, benefits, skills, deadline, companyWebsite)
                    }
                )
            }
        }

        when (val state = reportState) {
            is ReportState.Shown -> {
                ModalBottomSheet(
                    onDismissRequest = { viewModel.hideReportSheet() },
                    sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true),
                    containerColor = DarkBackground,
                    shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                    dragHandle = null
                ) {
                    ReportJobSheet(
                        jobTitle = state.jobTitle,
                        onDismiss = { viewModel.hideReportSheet() },
                        onSubmit = { reason -> viewModel.submitReport(state.jobId, reason) }
                    )
                }
            }
            ReportState.Hidden -> {}
        }

        FloatingActionButton(
            onClick = { viewModel.showCreateJobSheet() },
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(end = 20.dp, bottom = 80.dp),
            containerColor = Color.Transparent,
            contentColor = TextPrimary
        ) {
            Box(
                modifier = Modifier
                    .size(52.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.linearGradient(
                            listOf(GradientStart, GradientMid, GradientEnd)
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Filled.Add,
                    contentDescription = "Tạo tin tuyển dụng",
                    modifier = Modifier.size(26.dp)
                )
            }
        }
    }
}

@Composable
private fun FeaturedSection(
    featuredJobs: List<Job>,
    refreshTick: Int,
    onJobClick: (Job) -> Unit
) {
    Column {
        Text(
            text = "Việc làm nổi bật",
            style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.SemiBold
            ),
            color = TextPrimary
        )
        Spacer(modifier = Modifier.height(12.dp))
    }

    LazyRow(
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        contentPadding = PaddingValues(end = 4.dp)
    ) {
        itemsIndexed(
            featuredJobs,
            key = { _, job -> "featured_${job.id}" }
        ) { index, job ->
            var isVisible by remember { mutableStateOf(false) }

            val entranceDelay = (index * 60).coerceAtMost(300)

            LaunchedEffect(job.id, refreshTick) {
                isVisible = false
                delay(entranceDelay.toLong())
                isVisible = true
            }

            val alpha by animateFloatAsState(
                targetValue = if (isVisible) 1f else 0f,
                animationSpec = tween(300, easing = FastOutSlowInEasing),
                label = "featured_alpha"
            )

            Box(
                modifier = Modifier
                    .fillParentMaxWidth(0.85f)
                    .graphicsLayer { this.alpha = alpha }
            ) {
                FeaturedJobCard(
                    job = job,
                    onClick = { onJobClick(job) }
                )
            }
        }
    }
}

@Composable
private fun EngagedJobCard(
    job: Job,
    index: Int,
    refreshTick: Int,
    onClick: () -> Unit,
    onSaveClick: () -> Unit,
    onReportClick: () -> Unit
) {
    var isVisible by remember { mutableStateOf(false) }

    val entranceDelay = (index * 30).coerceAtMost(250)

    LaunchedEffect(job.id, refreshTick) {
        delay(entranceDelay.toLong())
        isVisible = true
    }

    val entranceAlpha by animateFloatAsState(
        targetValue = if (isVisible) 1f else 0f,
        animationSpec = tween(durationMillis = 300, easing = FastOutSlowInEasing),
        label = "entrance_alpha"
    )

    val entranceOffset by animateFloatAsState(
        targetValue = if (isVisible) 0f else 40f,
        animationSpec = tween(durationMillis = 300, easing = FastOutSlowInEasing),
        label = "entrance_offset"
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .graphicsLayer {
                alpha = entranceAlpha
                translationY = entranceOffset
            }
    ) {
        JobCard(
            job = job,
            onClick = onClick,
            onSaveClick = onSaveClick,
            onReportClick = onReportClick
        )
    }
}

@Composable
private fun ErrorStateJobs(
    message: String,
    onRetry: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(GlassWhite)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Outlined.ErrorOutline,
            contentDescription = null,
            tint = ErrorRed,
            modifier = Modifier.size(48.dp)
        )
        Spacer(modifier = Modifier.height(12.dp))
        Text(
            text = "Đã xảy ra lỗi",
            style = MaterialTheme.typography.titleMedium,
            color = TextPrimary
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = message,
            style = MaterialTheme.typography.bodySmall,
            color = TextSecondary,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(16.dp))

        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(14.dp))
                .background(
                    Brush.horizontalGradient(
                        listOf(GradientStart, GradientMid, GradientEnd)
                    )
                )
                .padding(horizontal = 24.dp, vertical = 12.dp)
                .then(
                    Modifier.clickable(onClick = onRetry)
                ),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "Thử lại",
                style = MaterialTheme.typography.labelLarge,
                color = TextPrimary
            )
        }
    }
}

@Composable
private fun EmptyStateJobs() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 48.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Filled.SearchOff,
            contentDescription = null,
            tint = TextSecondary.copy(alpha = 0.4f),
            modifier = Modifier.size(64.dp)
        )
        Spacer(modifier = Modifier.height(12.dp))
        Text(
            text = "Không tìm thấy việc làm phù hợp",
            style = MaterialTheme.typography.titleMedium,
            color = TextSecondary,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = "Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc",
            style = MaterialTheme.typography.bodySmall,
            color = TextSecondary.copy(alpha = 0.6f),
            textAlign = TextAlign.Center
        )
    }
}

