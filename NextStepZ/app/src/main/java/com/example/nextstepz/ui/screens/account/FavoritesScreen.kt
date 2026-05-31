package com.example.nextstepz.ui.screens.account

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.outlined.ErrorOutline
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.nextstepz.feeds.ui.components.RefreshHeader
import com.example.nextstepz.ui.components.AnimatedGradientBackground
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary
import kotlinx.coroutines.delay

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FavoritesScreen(
    onNavigateBack: () -> Unit,
    onNavigateToFeeds: () -> Unit = {},
    onNavigateToJobs: () -> Unit = {},
    viewModel: FavoritesViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val isRefreshing by viewModel.isRefreshing.collectAsState()
    val selectedTab by viewModel.selectedTab.collectAsState()

    val pullRefreshState = rememberPullToRefreshState()
    LaunchedEffect(Unit) {
        viewModel.loadData()
    }

    var refreshTick by remember { mutableIntStateOf(0) }

    LaunchedEffect(isRefreshing) {
        if (!isRefreshing) {
            refreshTick += 1
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
    ) {
        AnimatedGradientBackground()

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 32.dp)
        ) {
            TopBar(onNavigateBack = onNavigateBack)

            Spacer(modifier = Modifier.height(16.dp))

            AnimatedTabRow(
                selectedTab = selectedTab,
                onTabSelected = { viewModel.selectTab(it) }
            )

            Spacer(modifier = Modifier.height(8.dp))

            PullToRefreshBox(
                isRefreshing = isRefreshing,
                onRefresh = { viewModel.refresh() },
                state = pullRefreshState,
                modifier = Modifier
                    .fillMaxSize()
                    .weight(1f)
            ) {
                AnimatedContent(
                    targetState = selectedTab,
                    transitionSpec = {
                        (fadeIn(tween(200)) + slideInVertically { it / 3 })
                            .togetherWith(fadeOut(tween(150)) + slideOutHorizontally { -it / 3 })
                    },
                    label = "tab_content"
                ) { tab ->
                    when (uiState) {
                        is FavoritesUiState.Loading -> {
                            FavoritesLoadingState()
                        }

                        is FavoritesUiState.Error -> {
                            val error = uiState as FavoritesUiState.Error
                            FavoritesErrorState(
                                message = error.message,
                                onRetry = { viewModel.loadData() }
                            )
                        }

                        is FavoritesUiState.Success -> {
                            val success = uiState as FavoritesUiState.Success
                            val items = if (tab == FavoriteTab.FEEDS)
                                success.feedBookmarks else success.jobBookmarks

                            if (items.isEmpty()) {
                                EmptyFavorites(
                                    type = if (tab == FavoriteTab.FEEDS)
                                        EmptyFavoriteType.FEEDS
                                    else EmptyFavoriteType.JOBS,
                                    onExploreClick = {
                                        if (tab == FavoriteTab.FEEDS) onNavigateToFeeds()
                                        else onNavigateToJobs()
                                    },
                                    modifier = Modifier.padding(horizontal = 16.dp)
                                )
                            } else {
                                LazyColumn(
                                    contentPadding = PaddingValues(
                                        start = 16.dp,
                                        end = 16.dp,
                                        top = 8.dp,
                                        bottom = 32.dp
                                    ),
                                    verticalArrangement = Arrangement.spacedBy(16.dp)
                                ) {
                                    itemsIndexed(
                                        items = items,
                                        key = { _, item ->
                                            if (tab == FavoriteTab.FEEDS)
                                                (item as com.example.nextstepz.feeds.data.model.Post).id
                                            else
                                                (item as com.example.nextstepz.feeds.jobs.data.model.Job).id
                                        }
                                    ) { index, item ->
                                        when {
                                            tab == FavoriteTab.FEEDS -> {
                                                val post = item as com.example.nextstepz.feeds.data.model.Post
                                                EngagedFeedBookmarkCard(
                                                    post = post,
                                                    index = index,
                                                    refreshTick = refreshTick,
                                                    onRemove = { viewModel.removeFeedBookmark(post.id) },
                                                    onLikeClick = { }
                                                )
                                            }
                                            else -> {
                                                val job = item as com.example.nextstepz.feeds.jobs.data.model.Job
                                                EngagedJobBookmarkCard(
                                                    job = job,
                                                    index = index,
                                                    refreshTick = refreshTick,
                                                    onRemove = { viewModel.removeJobBookmark(job.id) }
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TopBar(onNavigateBack: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = onNavigateBack) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                contentDescription = "Quay lại",
                tint = TextSecondary
            )
        }

        Spacer(modifier = Modifier.width(4.dp))

        Text(
            text = "Danh sách yêu thích",
            style = MaterialTheme.typography.headlineMedium,
            color = TextPrimary
        )
    }
}

@Composable
private fun AnimatedTabRow(
    selectedTab: FavoriteTab,
    onTabSelected: (FavoriteTab) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(GlassWhite)
            .padding(4.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        FavoriteTab.entries.forEach { tab ->
            val isSelected = tab == selectedTab
            val indicatorProgress by animateFloatAsState(
                targetValue = if (isSelected) 1f else 0f,
                animationSpec = tween(300),
                label = "tab_indicator"
            )

            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(12.dp))
                    .background(
                        if (isSelected) {
                            Brush.horizontalGradient(
                                listOf(GradientStart, GradientMid, GradientEnd)
                            )
                        } else {
                            Brush.horizontalGradient(
                                listOf(Color.Transparent, Color.Transparent)
                            )
                        }
                    )
                    .clickable { onTabSelected(tab) }
                    .padding(vertical = 10.dp),
                contentAlignment = Alignment.Center
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    val (icon, label) = when (tab) {
                        FavoriteTab.FEEDS -> "article" to "Bài viết"
                        FavoriteTab.JOBS -> "work" to "Việc làm"
                    }

                    Text(
                        text = label,
                        style = MaterialTheme.typography.labelLarge.copy(
                            fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Medium
                        ),
                        color = if (isSelected) TextPrimary else TextSecondary
                    )
                }
            }
        }
    }
}

@Composable
private fun EngagedFeedBookmarkCard(
    post: com.example.nextstepz.feeds.data.model.Post,
    index: Int,
    refreshTick: Int,
    onRemove: () -> Unit,
    onLikeClick: () -> Unit
) {
    var isVisible by remember { mutableStateOf(false) }
    val entranceDelay = (index * 30).coerceAtMost(250)

    LaunchedEffect(post.id, refreshTick) {
        isVisible = false
        delay(entranceDelay.toLong())
        isVisible = true
    }

    val entranceAlpha by animateFloatAsState(
        targetValue = if (isVisible) 1f else 0f,
        animationSpec = tween(durationMillis = 300, easing = FastOutSlowInEasing),
        label = "feed_entrance_alpha"
    )

    val entranceOffset by animateFloatAsState(
        targetValue = if (isVisible) 0f else 40f,
        animationSpec = tween(durationMillis = 300, easing = FastOutSlowInEasing),
        label = "feed_entrance_offset"
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .graphicsLayer {
                alpha = entranceAlpha
                translationY = entranceOffset
            }
    ) {
        FeedBookmarkCard(
            post = post,
            onRemove = onRemove,
            onLikeClick = onLikeClick
        )
    }
}

@Composable
private fun EngagedJobBookmarkCard(
    job: com.example.nextstepz.feeds.jobs.data.model.Job,
    index: Int,
    refreshTick: Int,
    onRemove: () -> Unit
) {
    var isVisible by remember { mutableStateOf(false) }
    val entranceDelay = (index * 30).coerceAtMost(250)

    LaunchedEffect(job.id, refreshTick) {
        isVisible = false
        delay(entranceDelay.toLong())
        isVisible = true
    }

    val entranceAlpha by animateFloatAsState(
        targetValue = if (isVisible) 1f else 0f,
        animationSpec = tween(durationMillis = 300, easing = FastOutSlowInEasing),
        label = "job_entrance_alpha"
    )

    val entranceOffset by animateFloatAsState(
        targetValue = if (isVisible) 0f else 40f,
        animationSpec = tween(durationMillis = 300, easing = FastOutSlowInEasing),
        label = "job_entrance_offset"
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .graphicsLayer {
                alpha = entranceAlpha
                translationY = entranceOffset
            }
    ) {
        JobBookmarkCard(
            job = job,
            onRemove = onRemove
        )
    }
}

@Composable
private fun FavoritesLoadingState() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        repeat(4) {
            FavoritesLoadingShimmer()
        }
    }
}

@Composable
private fun FavoritesLoadingShimmer() {
    val infiniteTransition = rememberInfiniteTransition(label = "shimmer")
    val progress by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = androidx.compose.animation.core.infiniteRepeatable(
            animation = androidx.compose.animation.core.tween(1200, easing = FastOutSlowInEasing),
            repeatMode = androidx.compose.animation.core.RepeatMode.Restart
        ),
        label = "shimmer_val"
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(GlassWhite)
            .padding(20.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            ShimmerBlock(width = 48.dp, height = 48.dp, progress = progress, isCircle = true)
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                ShimmerBlock(width = 130.dp, height = 14.dp, progress = progress)
                Spacer(modifier = Modifier.height(6.dp))
                ShimmerBlock(width = 90.dp, height = 10.dp, progress = progress)
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        repeat(3) {
            ShimmerBlock(fillMax = true, height = 12.dp, progress = progress)
            Spacer(modifier = Modifier.height(8.dp))
        }
    }
}

@Composable
private fun ShimmerBlock(
    width: androidx.compose.ui.unit.Dp? = null,
    height: androidx.compose.ui.unit.Dp,
    progress: Float,
    modifier: Modifier = Modifier,
    fillMax: Boolean = false,
    isCircle: Boolean = false
) {
    val colorStops = listOf(
        GlassBorder.copy(alpha = 0.15f),
        GlassBorder.copy(alpha = 0.45f),
        GlassBorder.copy(alpha = 0.15f)
    )

    Box(
        modifier = modifier
            .then(
                when {
                    fillMax -> Modifier.fillMaxWidth()
                    width != null -> Modifier.width(width)
                    else -> Modifier
                }
            )
            .height(height)
            .clip(if (isCircle) androidx.compose.foundation.shape.CircleShape else RoundedCornerShape(6.dp))
            .background(
                Brush.horizontalGradient(
                    colorStops = colorStops.mapIndexed { idx, color ->
                        val stop = idx.toFloat() / (colorStops.size - 1)
                        val animatedStop = (stop + progress - 0.5f).coerceIn(0f, 1f)
                        animatedStop to color
                    }.toTypedArray()
                )
            )
    )
}

@Composable
private fun FavoritesErrorState(
    message: String,
    onRetry: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Outlined.ErrorOutline,
            contentDescription = null,
            tint = com.example.nextstepz.ui.theme.ErrorRed,
            modifier = Modifier
                .height(48.dp)
                .padding(bottom = 0.dp)
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
            color = TextSecondary
        )
        Spacer(modifier = Modifier.height(16.dp))
        com.example.nextstepz.ui.components.GradientButton(
            text = "Thử lại",
            onClick = onRetry,
            modifier = Modifier.width(140.dp)
        )
    }
}
