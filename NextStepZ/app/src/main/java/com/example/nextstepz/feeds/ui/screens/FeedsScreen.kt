package com.example.nextstepz.feeds.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.outlined.ErrorOutline
import androidx.compose.material3.CircularProgressIndicator
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
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.nextstepz.feeds.data.model.Post
import com.example.nextstepz.feeds.ui.components.CommentSheet
import com.example.nextstepz.feeds.ui.components.CreatePostSheet
import com.example.nextstepz.feeds.ui.components.FeedFilterBar
import com.example.nextstepz.feeds.ui.components.PostCard
import com.example.nextstepz.feeds.ui.components.PostInput
import com.example.nextstepz.feeds.ui.components.ProfilePreviewModal
import com.example.nextstepz.feeds.ui.components.RefreshHeader
import com.example.nextstepz.feeds.ui.components.ReportModal
import com.example.nextstepz.feeds.ui.components.PostMenuSheet
import com.example.nextstepz.feeds.ui.components.UserReportModal
import com.example.nextstepz.feeds.data.model.UserReportReason
import com.example.nextstepz.feeds.ui.viewmodel.CommentSheetState
import com.example.nextstepz.feeds.ui.viewmodel.FeedsUiState
import com.example.nextstepz.feeds.ui.viewmodel.FeedsViewModel
import com.example.nextstepz.feeds.ui.viewmodel.ModalSheetState
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary
import kotlinx.coroutines.delay
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FeedsScreen(
    viewModel: FeedsViewModel = viewModel()
) {
    val uiState by viewModel.uiState
    val isRefreshing by viewModel.isRefreshing
    val selectedFilter by viewModel.selectedFilter
    val commentSheetState by viewModel.commentSheetState
    val isCreatePostVisible by viewModel.isCreatePostSheetVisible
    val modalSheetState by viewModel.modalSheetState

    val pullRefreshState = rememberPullToRefreshState()
    val createPostSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val commentSheetState2 = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val modalSheetState2 = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    var refreshTick by remember { mutableIntStateOf(0) }

    LaunchedEffect(isRefreshing) {
        if (!isRefreshing) {
            refreshTick += 1
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        PullToRefreshBox(
            isRefreshing = isRefreshing,
            onRefresh = { viewModel.refreshPosts() },
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
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Bài viết",
                            style = MaterialTheme.typography.headlineMedium,
                            color = TextPrimary
                        )
                    }
                }

                item {
                    PostInput(onClick = { viewModel.showCreatePostSheet() })
                }

                item {
                    FeedFilterBar(
                        selectedType = selectedFilter,
                        onFilterSelected = { viewModel.setFilter(it) }
                    )
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

                when (uiState) {
                    is FeedsUiState.Loading -> {
                        item {
                            AnimatedContent(
                                targetState = true,
                                transitionSpec = {
                                    fadeIn(tween(400)) togetherWith fadeOut(tween(300))
                                },
                                label = "loading_transition"
                            ) {
                                if (it) {
                                    LoadingState()
                                } else {
                                    EmptyState(filter = selectedFilter)
                                }
                            }
                        }
                    }

                    is FeedsUiState.Error -> {
                        item {
                            AnimatedContent(
                                targetState = (uiState as FeedsUiState.Error),
                                transitionSpec = {
                                    scaleIn(tween(300)) + fadeIn(tween(300)) togetherWith
                                            scaleOut(tween(200)) + fadeOut(tween(200))
                                },
                                label = "error_transition"
                            ) { error ->
                                ErrorState(
                                    message = error.message,
                                    onRetry = { viewModel.loadPosts() }
                                )
                            }
                        }
                    }

                    is FeedsUiState.Success -> {
                        val posts = (uiState as FeedsUiState.Success).posts

                        if (posts.isEmpty()) {
                            item {
                                AnimatedContent(
                                    targetState = selectedFilter,
                                    transitionSpec = {
                                        fadeIn(tween(300)) togetherWith fadeOut(tween(200))
                                    },
                                    label = "empty_transition"
                                ) { filter ->
                                    EmptyState(filter = filter)
                                }
                            }
                        } else {
                            itemsIndexed(
                                posts,
                                key = { _, post -> post.id }
                            ) { index, post ->
                                EngagedPostCard(
                                    post = post,
                                    index = index,
                                    refreshTick = refreshTick,
                                    onLikeClick = { viewModel.toggleLike(post.id) },
                                    onCommentClick = { viewModel.showCommentSheet(post.id) },
                                    onBookmarkClick = { viewModel.toggleBookmark(post.id) },
                                    onAvatarClick = { viewModel.showProfilePreview(post.id) },
                                    onNameClick = { viewModel.showProfilePreview(post.id) },
                                    onMenuClick = { viewModel.showPostMenu(post.id) }
                                )
                            }
                        }
                    }
                }
            }
        }

        FloatingActionButton(
            onClick = { viewModel.showCreatePostSheet() },
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
                    contentDescription = "Tạo bài viết",
                    modifier = Modifier.size(26.dp)
                )
            }
        }

        if (isCreatePostVisible) {
            ModalBottomSheet(
                onDismissRequest = { viewModel.hideCreatePostSheet() },
                sheetState = createPostSheetState,
                containerColor = DarkBackground,
                shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                dragHandle = null
            ) {
                CreatePostSheet(
                    onDismiss = { viewModel.hideCreatePostSheet() },
                    onPost = { content, type, tags ->
                        viewModel.createPost(content, type, tags)
                    }
                )
            }
        }

        when (val state = commentSheetState) {
            is CommentSheetState.Shown -> {
                ModalBottomSheet(
                    onDismissRequest = { viewModel.hideCommentSheet() },
                    sheetState = commentSheetState2,
                    containerColor = DarkBackground,
                    shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                    dragHandle = null
                ) {
                    CommentSheet(
                        post = state.post,
                        comments = state.comments,
                        isLoading = false,
                        onDismiss = { viewModel.hideCommentSheet() },
                        onSendComment = { content ->
                            viewModel.addComment(state.post.id, content)
                        },
                        onLikeComment = { commentId ->
                            viewModel.toggleCommentLike(state.post.id, commentId)
                        }
                    )
                }
            }
            is CommentSheetState.Loading -> {
                ModalBottomSheet(
                    onDismissRequest = { viewModel.hideCommentSheet() },
                    sheetState = commentSheetState2,
                    containerColor = DarkBackground,
                    shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                    dragHandle = null
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(32.dp),
                            color = GradientMid,
                            strokeWidth = 3.dp
                        )
                    }
                }
            }
            CommentSheetState.Hidden -> {}
        }

        when (val state = modalSheetState) {
            is ModalSheetState.PostMenu -> {
                ModalBottomSheet(
                    onDismissRequest = { viewModel.hideModal() },
                    sheetState = modalSheetState2,
                    containerColor = DarkBackground,
                    shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                    dragHandle = null
                ) {
                    PostMenuSheet(
                        isReported = state.post.isReported,
                        onReportClick = { viewModel.showReportModal(state.post.id) },
                        onDismiss = { viewModel.hideModal() }
                    )
                }
            }
            is ModalSheetState.Report -> {
                ModalBottomSheet(
                    onDismissRequest = { viewModel.hideModal() },
                    sheetState = modalSheetState2,
                    containerColor = DarkBackground,
                    shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                    dragHandle = null
                ) {
                    ReportModal(
                        onDismiss = { viewModel.hideModal() },
                        onSubmit = { reason, customText ->
                            viewModel.reportPost(state.post.id, reason, customText)
                        }
                    )
                }
            }
            is ModalSheetState.ProfilePreview -> {
                ModalBottomSheet(
                    onDismissRequest = { viewModel.hideModal() },
                    sheetState = modalSheetState2,
                    containerColor = DarkBackground,
                    shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                    dragHandle = null
                ) {
                    ProfilePreviewModal(
                        post = state.post,
                        onDismiss = { viewModel.hideModal() },
                        onMessageClick = { authorId ->
                            viewModel.onMessageClick(authorId)
                        },
                        onReportUserClick = {
                            viewModel.showUserReportModal(state.post)
                        }
                    )
                }
            }
            is ModalSheetState.UserReport -> {
                ModalBottomSheet(
                    onDismissRequest = { viewModel.hideModal() },
                    sheetState = modalSheetState2,
                    containerColor = DarkBackground,
                    shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                    dragHandle = null
                ) {
                    UserReportModal(
                        isSubmitted = state.isSubmitted,
                        onSubmit = { reason, customText ->
                            viewModel.reportUserWithReason(state.post.authorId, reason, customText)
                        },
                        onDismiss = { viewModel.hideModal() }
                    )
                }
            }
            ModalSheetState.Hidden -> {}
        }
    }
}

@Composable
private fun EngagedPostCard(
    post: Post,
    index: Int,
    refreshTick: Int,
    onLikeClick: () -> Unit,
    onCommentClick: () -> Unit,
    onBookmarkClick: () -> Unit,
    onAvatarClick: () -> Unit,
    onNameClick: () -> Unit,
    onMenuClick: () -> Unit
) {
    var triggeredBy by remember { mutableStateOf<String?>(null) }
    var triggerId by remember { mutableIntStateOf(0) }
    var isVisible by remember { mutableStateOf(false) }
    var shimmerTick by remember { mutableIntStateOf(0) }

    val entranceDelay = (index * 30).coerceAtMost(250)

    LaunchedEffect(post.id) {
        delay(entranceDelay.toLong())
        isVisible = true
    }

    LaunchedEffect(refreshTick) {
        if (refreshTick > 0) {
            shimmerTick = refreshTick
            delay(300)
            shimmerTick = 0
        }
    }

    LaunchedEffect(triggerId) {
        if (triggeredBy != null) {
            delay(350)
            triggeredBy = null
        }
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

    val engagementScale by animateFloatAsState(
        targetValue = when (triggeredBy) {
            "like" -> 1.04f
            "bookmark" -> 1.06f
            else -> 1f
        },
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessMedium
        ),
        label = "engagement_scale"
    )

    val engagementGlow by animateFloatAsState(
        targetValue = if (triggeredBy != null) 1f else 0f,
        animationSpec = tween(durationMillis = 200),
        label = "engagement_glow"
    )

    val engagementColor = when (triggeredBy) {
        "like" -> ErrorRed
        "bookmark" -> GradientMid
        else -> GradientStart
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .graphicsLayer {
                alpha = entranceAlpha
                translationY = entranceOffset
                scaleX = engagementScale
                scaleY = engagementScale
            }
            .then(
                if (engagementGlow > 0f) {
                    Modifier.drawBehind {
                        val glowAlpha = engagementGlow * 0.3f
                        drawRoundRect(
                            brush = Brush.radialGradient(
                                colors = listOf(
                                    engagementColor.copy(alpha = glowAlpha),
                                    Color.Transparent
                                ),
                                center = Offset(size.width / 2, size.height / 2),
                                radius = size.maxDimension
                            ),
                            cornerRadius = CornerRadius(20.dp.toPx()),
                        )
                    }
                } else Modifier
            )
    ) {
        PostCard(
            post = post,
            onLikeClick = {
                triggeredBy = "like"
                triggerId += 1
                onLikeClick()
            },
            onCommentClick = onCommentClick,
            onBookmarkClick = {
                triggeredBy = "bookmark"
                triggerId += 1
                onBookmarkClick()
            },
            onAvatarClick = onAvatarClick,
            onNameClick = onNameClick,
            onMenuClick = onMenuClick
        )
    }
}

@Composable
private fun LoadingState() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        repeat(4) {
            LoadingShimmerCard()
        }
    }
}

@Composable
private fun LoadingShimmerCard() {
    val infinite = rememberInfiniteTransition(label = "shimmer")
    val progress by infinite.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
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
        Spacer(modifier = Modifier.height(20.dp))
        repeat(3) {
            ShimmerBlock(fillMax = true, height = 12.dp, progress = progress)
            Spacer(modifier = Modifier.height(8.dp))
        }
        Spacer(modifier = Modifier.height(4.dp))
        ShimmerBlock(width = 160.dp, height = 12.dp, progress = progress)
        Spacer(modifier = Modifier.height(16.dp))
        ShimmerBlock(fillMax = true, height = 1.dp, progress = progress, isBrand = true)
    }
}

@Composable
private fun ShimmerBlock(
    width: androidx.compose.ui.unit.Dp? = null,
    height: androidx.compose.ui.unit.Dp,
    progress: Float,
    modifier: Modifier = Modifier,
    fillMax: Boolean = false,
    isCircle: Boolean = false,
    isBrand: Boolean = false
) {
    val baseColors = if (isBrand) {
        listOf(
            GradientStart.copy(alpha = 0f),
            GradientMid.copy(alpha = 0.45f),
            GradientEnd.copy(alpha = 0.3f),
            GradientMid.copy(alpha = 0.45f),
            GradientStart.copy(alpha = 0f)
        )
    } else {
        listOf(
            GlassBorder.copy(alpha = 0.15f),
            GlassBorder.copy(alpha = 0.45f),
            GlassBorder.copy(alpha = 0.15f)
        )
    }

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
            .clip(if (isCircle) CircleShape else RoundedCornerShape(6.dp))
            .background(
                Brush.horizontalGradient(
                    colorStops = baseColors.mapIndexed { idx, color ->
                        val stop = idx.toFloat() / (baseColors.size - 1)
                        val animatedStop = (stop + progress - 0.5f).coerceIn(0f, 1f)
                        animatedStop to color
                    }.toTypedArray()
                )
            )
    )
}

@Composable
private fun ErrorState(
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

@Composable
private fun EmptyState(filter: com.example.nextstepz.feeds.data.model.PostType?) {
    val filterName = when (filter) {
        com.example.nextstepz.feeds.data.model.PostType.Article -> "Bài viết"
        com.example.nextstepz.feeds.data.model.PostType.Job -> "Việc làm"
        com.example.nextstepz.feeds.data.model.PostType.Tips -> "Mẹo nghề"
        com.example.nextstepz.feeds.data.model.PostType.Story -> "Chia sẻ"
        null -> "bài viết"
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 48.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Không có $filterName nào",
            style = MaterialTheme.typography.titleMedium,
            color = TextSecondary
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Hãy là người đầu tiên chia sẻ!",
            style = MaterialTheme.typography.bodySmall,
            color = TextSecondary.copy(alpha = 0.6f)
        )
    }
}
