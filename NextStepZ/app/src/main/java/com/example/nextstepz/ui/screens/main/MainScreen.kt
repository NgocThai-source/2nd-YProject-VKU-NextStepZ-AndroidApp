package com.example.nextstepz.ui.screens.main

import FeedsScreen
import android.content.Context
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.Article
import androidx.compose.material.icons.automirrored.outlined.Chat
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Work
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.nextstepz.auth.data.local.TokenManager
import com.example.nextstepz.feeds.jobs.ui.screens.JobsScreen
import com.example.nextstepz.notifications.data.NotificationCenter
import com.example.nextstepz.notifications.ui.NotificationsScreen
import com.example.nextstepz.ui.components.BottomNavBar
import kotlinx.coroutines.delay
import com.example.nextstepz.ui.navigation.Screen
import com.example.nextstepz.ui.navigation.bottomNavItems
import com.example.nextstepz.ui.navigation.BottomNavItem
import com.example.nextstepz.ui.screens.account.AccountScreen
import com.example.nextstepz.ui.screens.chat.ChatDetailScreen
import com.example.nextstepz.ui.screens.chat.ChatListScreen
import com.example.nextstepz.ui.screens.chat.ChatViewModel
import com.example.nextstepz.ui.screens.home.HomeScreen
import java.net.URLDecoder
import java.nio.charset.StandardCharsets

private const val TAB_TRANSITION = 300
@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun MainScreen(
    onLogout: () -> Unit = {},
    // 1. THÊM HÀM NÀY ĐỂ BẮN SỰ KIỆN RA ROOT NAVGRAPH
    onNavigateToChatDetail: (conversationId: String, partnerName: String, partnerId: String) -> Unit
) {
    val innerNavController = rememberNavController()
    val chatViewModel: ChatViewModel = viewModel()
    val navBackStackEntry by innerNavController.currentBackStackEntryAsState()
    var currentRoute = navBackStackEntry?.destination?.route ?: Screen.Home.route

    // Near real-time unread-notification badge: poll the count while Main is shown.
    val appContext = LocalContext.current.applicationContext
    val unreadCount by NotificationCenter.unreadCount.collectAsState()
    LaunchedEffect(Unit) {
        val userId = TokenManager(appContext).userId
        if (!userId.isNullOrBlank()) {
            while (true) {
                NotificationCenter.refresh(userId)
                delay(15_000)
            }
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(modifier = Modifier.fillMaxSize()) {
            Box(modifier = Modifier.weight(1f)) {
                NavHost(
                    navController = innerNavController,
                    startDestination = Screen.Home.route,
                    enterTransition = { fadeIn(tween(TAB_TRANSITION, easing = FastOutSlowInEasing)) },
                    exitTransition = { fadeOut(tween(TAB_TRANSITION, easing = FastOutSlowInEasing)) },
                    popEnterTransition = { fadeIn(tween(TAB_TRANSITION, easing = FastOutSlowInEasing)) },
                    popExitTransition = { fadeOut(tween(TAB_TRANSITION, easing = FastOutSlowInEasing)) }
                ) {
                    composable(Screen.Home.route) { HomeScreen() }
                    composable(Screen.Notifications.route) {
                        NotificationsScreen()
                    }
                    composable(Screen.CvProfile.route) {
                        PlaceholderScreen("Hồ sơ CV", Icons.Outlined.Description)
                    }
                    composable(Screen.Jobs.route) {
                        JobsScreen()
                    }
                    composable(Screen.Feeds.route) {
                        FeedsScreen(onNavigateToChatDetail = onNavigateToChatDetail)
                    }

                    // TAB TIN NHẮN (Danh sách phòng chat)
                    composable(Screen.Messages.route) {
                        val context = LocalContext.current
                        val sharedPref = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
                        val currentUserId = sharedPref.getString("USER_ID", "") ?: ""
                        Log.d("TEST_ID", "ID của tôi là: [$currentUserId]")
                        ChatListScreen(
                            currentUserId = currentUserId,
                            viewModel = chatViewModel,
                            onConversationClick = { conversationId, partnerName, partnerId ->
                                // 2. BẤM VÀO ĐÂY, SỰ KIỆN SẼ BAY RA NGOÀI FILE NextStepZNavGraph ĐỂ MỞ FULL MÀN HÌNH
                                onNavigateToChatDetail(conversationId, partnerName, partnerId)
                            }
                        )
                    }

                    // ĐÃ XÓA composable(Screen.ChatDetail.route) KHỎI ĐÂY!

                    composable(Screen.Account.route) {
                        AccountScreen(
                            onLogout = onLogout,
                            currentRole = com.example.nextstepz.auth.data.model.UserRole.GUEST,
                            onRoleUpdated = { }
                        )
                    }
                }
            }

            BottomNavBar(
                items = bottomNavItems,
                currentRoute = currentRoute,
                badgeRoutes = if (unreadCount > 0) setOf(Screen.Notifications.route) else emptySet(),
                onItemClick = { item ->
                    if (currentRoute != item.screen.route) {
                        currentRoute = item.screen.route
                        innerNavController.navigate(item.screen.route) {
                            popUpTo(Screen.Home.route) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                }
            )
        }
    }
}
