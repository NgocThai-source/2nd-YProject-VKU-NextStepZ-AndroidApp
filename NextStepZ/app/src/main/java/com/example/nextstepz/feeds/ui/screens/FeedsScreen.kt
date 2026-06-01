import android.os.Build
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.outlined.Close
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.ModalBottomSheet
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
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.nextstepz.feeds.data.model.Post
import com.example.nextstepz.feeds.data.model.PostType
import com.example.nextstepz.feeds.ui.components.CreatePostSheet
import com.example.nextstepz.feeds.ui.components.FeedFilterBar
import com.example.nextstepz.feeds.ui.components.PostCard
import com.example.nextstepz.feeds.ui.components.PostInput
import com.example.nextstepz.feeds.ui.components.RefreshHeader
import com.example.nextstepz.feeds.ui.viewmodel.FeedsUiState
import com.example.nextstepz.feeds.ui.viewmodel.FeedsViewModel
import com.example.nextstepz.ui.components.SectionHeader
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextPrimary
import androidx.compose.material.icons.outlined.ErrorOutline
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import com.example.nextstepz.feeds.data.model.Comment
import com.example.nextstepz.feeds.ui.components.CommentSheet
import com.example.nextstepz.feeds.ui.components.PostMenuSheet
import com.example.nextstepz.feeds.ui.components.ProfilePreviewModal
import com.example.nextstepz.feeds.ui.components.ReportModal
import com.example.nextstepz.feeds.ui.components.UserReportModal
import com.example.nextstepz.feeds.ui.viewmodel.CommentSheetState
import com.example.nextstepz.feeds.ui.viewmodel.ModalSheetState
import com.example.nextstepz.ui.components.GradientButton
import com.example.nextstepz.ui.screens.chat.ChatViewModel
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.InputBackground
import com.example.nextstepz.ui.theme.InputPlaceholder
import com.example.nextstepz.ui.theme.TextSecondary
import com.example.nextstepz.ui.theme.TextTertiary

@RequiresApi(Build.VERSION_CODES.O)
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FeedsScreen(
    onNavigateToChatDetail: (
        conversationId: String,
        partnerName: String,
        partnerId: String
    ) -> Unit = { _, _, _ -> },
    viewModel: FeedsViewModel = viewModel(),
    chatViewModel: ChatViewModel = viewModel()
) {
    val uiState by viewModel.uiState
    val isRefreshing by viewModel.isRefreshing
    val selectedFilter by viewModel.selectedFilter
    val isCreatePostVisible by viewModel.isCreatePostSheetVisible
    val commentSheetState by viewModel.commentSheetState
    var isCreatingConversation by remember { mutableStateOf(false) }
    val commentSheetState2 = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val pullRefreshState = rememberPullToRefreshState()
    val createPostSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val modalSheetState by viewModel.modalSheetState
    val modalSheetState2 = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var refreshTick by remember { mutableIntStateOf(0) }

    val context = LocalContext.current
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
                    SectionHeader(title = "Bài viết")
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
                    is FeedsUiState.Idle -> {
                        item {
                            EmptyState(filter = selectedFilter)
                        }
                    }

                    is FeedsUiState.Loading -> {
                        item {
                            LoadingState()
                        }
                    }

                    is FeedsUiState.Error -> {
                        item {
                            val error = uiState as FeedsUiState.Error

                            ErrorState(
                                message = error.message,
                                onRetry = { viewModel.loadPosts() }
                            )
                        }
                    }

                    is FeedsUiState.Success -> {
                        val posts = (uiState as FeedsUiState.Success).posts

                        if (posts.isEmpty()) {
                            item {
                                EmptyState(filter = selectedFilter)
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

                                    // Chưa làm API like/comment/bookmark/report thì để tạm no-op
                                    onLikeClick = {viewModel.toggleLike(post.id)},
                                    onCommentClick = { viewModel.showCommentSheet(post.id)},
                                    onBookmarkClick = {viewModel.toggleBookmark(post.id)},
                                    onAvatarClick = {viewModel.showProfilePreview(post.id)},
                                    onNameClick = {viewModel.showProfilePreview(post.id)},
                                    onMenuClick = {viewModel.showPostMenu(post.id)}
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

            CommentSheetState.Hidden -> Unit
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
                        onReportClick = {
                            viewModel.showReportModal(state.post.id)
                        },
                        onDismiss = {
                            viewModel.hideModal()
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
                         isUserReported = state.post.reportedUsers.contains(state.post.authorId),
                        onDismiss = {
                            viewModel.hideModal()
                        },

                        onMessageClick = { partnerId ->
                            if (!isCreatingConversation) {
                                isCreatingConversation = true

                                chatViewModel.createOrGetConversation(
                                    partnerProfileId = partnerId
                                ) { conversationId ->
                                    isCreatingConversation = false

                                    if (conversationId.isNullOrBlank()) {
                                        Toast.makeText(
                                            context,
                                            "Không thể tạo cuộc trò chuyện. Vui lòng thử lại.",
                                            Toast.LENGTH_SHORT
                                        ).show()
                                    } else {
                                        viewModel.hideModal()

                                        onNavigateToChatDetail(
                                            conversationId,
                                            state.post.authorName,
                                            partnerId
                                        )
                                    }
                                }
                            }
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
                        isSubmitting = state.isSubmitting,
                        isSubmitted = state.isSubmitted,
                        errorMessage = state.errorMessage,
                        onDismiss = { viewModel.hideModal() },
                        onSubmit = { reason, customText ->
                            viewModel.reportUser(
                                userId = state.post.authorId,
                                reason = reason,
                                customText = customText
                            )
                        }
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
                        isSubmitting = state.isSubmitting,
                        isSubmitted = state.isSubmitted,
                        errorMessage = state.errorMessage,
                        onDismiss = { viewModel.hideModal() },
                        onSubmit = { reason, customText ->
                            viewModel.reportPost(state.post.id, reason, customText)
                        }
                    )
                }
            }

            else -> Unit
        }
    }
}

@RequiresApi(Build.VERSION_CODES.O)
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
    var isVisible by remember { mutableStateOf(false) }

    val entranceDelay = (index * 30).coerceAtMost(250)

    LaunchedEffect(post.id, refreshTick) {
        kotlinx.coroutines.delay(entranceDelay.toLong())
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
        PostCard(
            post = post,
            onLikeClick = onLikeClick,
            onCommentClick = onCommentClick,
            onBookmarkClick = onBookmarkClick,
            onAvatarClick = onAvatarClick,
            onNameClick = onNameClick,
            onMenuClick = onMenuClick
        )
    }
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
private fun LoadingState() {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        repeat(4) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(160.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(GlassWhite)
            )
        }
    }
}

@Composable
private fun EmptyState(filter: PostType?) {
    val filterName = when (filter) {
        PostType.Article -> "Bài viết"
        PostType.Job -> "Việc làm"
        PostType.Tips -> "Mẹo nghề"
        PostType.Story -> "Chia sẻ"
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