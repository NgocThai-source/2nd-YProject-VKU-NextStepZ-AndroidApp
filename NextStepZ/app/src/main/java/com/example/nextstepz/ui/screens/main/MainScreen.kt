package com.example.nextstepz.ui.screens.main

import FeedsScreen
import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.Chat
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.Person
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.nextstepz.ui.components.BottomNavBar
import com.example.nextstepz.ui.navigation.Screen
import com.example.nextstepz.ui.navigation.bottomNavItems
import com.example.nextstepz.ui.screens.account.AccountScreen
import com.example.nextstepz.ui.screens.chat.ChatDetailScreen
import com.example.nextstepz.ui.screens.chat.ChatListScreen
import com.example.nextstepz.ui.screens.chat.ChatViewModel
import com.example.nextstepz.ui.screens.home.HomeScreen
import com.example.nextstepz.feeds.jobs.ui.screens.JobsScreen
import java.net.URLDecoder
import java.nio.charset.StandardCharsets

private const val TAB_TRANSITION = 300

/**
 * Main screen container with bottom navigation bar and animated gradient background.
 * Houses the inner NavHost for tab-based navigation (Home, CV, Jobs, Articles, Account).
 */
@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun MainScreen(onLogout: () -> Unit = {}) {
    val innerNavController = rememberNavController()
    val chatViewModel: ChatViewModel = viewModel()

    var currentRoute by remember { mutableStateOf(Screen.Home.route) }

    Box(modifier = Modifier.fillMaxSize()) {

        // Content + bottom nav
        Column(modifier = Modifier.fillMaxSize()) {
            // Tab content area
            Box(modifier = Modifier.weight(1f)) {
                NavHost(
                    navController = innerNavController,
                    startDestination = Screen.Home.route,
                    enterTransition = {
                        fadeIn(tween(TAB_TRANSITION, easing = FastOutSlowInEasing))
                    },
                    exitTransition = {
                        fadeOut(tween(TAB_TRANSITION, easing = FastOutSlowInEasing))
                    },
                    popEnterTransition = {
                        fadeIn(tween(TAB_TRANSITION, easing = FastOutSlowInEasing))
                    },
                    popExitTransition = {
                        fadeOut(tween(TAB_TRANSITION, easing = FastOutSlowInEasing))
                    }
                ) {
                    composable(Screen.Home.route) { HomeScreen() }
                    composable(Screen.CvProfile.route) {
                        PlaceholderScreen("Hồ sơ CV", Icons.Outlined.Description)
                    }
                    composable(Screen.Jobs.route) {
                        JobsScreen()
                    }
                    composable(Screen.Feeds.route) {
                        FeedsScreen()
                    }
                    composable(Screen.Messages.route) {
                        val currentUserId = remember {
                            "9255374e-1e6d-4e9b-b4ec-5b11b2652605"
                        }
                        ChatListScreen(
                            currentUserId = currentUserId,
                            onConversationClick = { conversationId, partnerName, partnerId ->
                                innerNavController.navigate(
                                    Screen.ChatDetail.createRoute(conversationId, partnerName, partnerId)
                                )
                            },
                            viewModel = chatViewModel
                        )
                    }

                    composable(
                        route = Screen.ChatDetail.route,
                        arguments = listOf(
                            navArgument("conversationId") { type = NavType.StringType },
                            navArgument("partnerName") { type = NavType.StringType },
                            navArgument("partnerId") { type = NavType.StringType }
                        ),
                        enterTransition = {
                            fadeIn(tween(TAB_TRANSITION, easing = FastOutSlowInEasing))
                        },
                        exitTransition = {
                            fadeOut(tween(TAB_TRANSITION, easing = FastOutSlowInEasing))
                        }
                    ) { backStackEntry ->
                        val conversationId = backStackEntry.arguments?.getString("conversationId") ?: ""
                        val partnerName = try {
                            URLDecoder.decode(
                                backStackEntry.arguments?.getString("partnerName") ?: "",
                                StandardCharsets.UTF_8.toString()
                            )
                        } catch (e: Exception) {
                            backStackEntry.arguments?.getString("partnerName") ?: "Người dùng"
                        }
                        val partnerId = try {
                            URLDecoder.decode(
                                backStackEntry.arguments?.getString("partnerId") ?: "",
                                StandardCharsets.UTF_8.toString()
                            )
                        } catch (e: Exception) {
                            backStackEntry.arguments?.getString("partnerId") ?: ""
                        }
                        val currentUserId = remember {
                            "9255374e-1e6d-4e9b-b4ec-5b11b2652605"
                        }

                        ChatDetailScreen(
                            conversationId = conversationId,
                            partnerName = partnerName,
                            currentUserId = currentUserId,
                            onNavigateBack = { innerNavController.popBackStack() },
                            viewModel = chatViewModel
                        )
                    }

                    composable(Screen.Account.route) {
                        AccountScreen(
                            onLogout = onLogout,
                            currentRole = com.example.nextstepz.auth.data.model.UserRole.GUEST,
                            onRoleUpdated = { }
                        )
                    }
                }
            }

            // Bottom navigation bar
            BottomNavBar(
                items = bottomNavItems,
                currentRoute = currentRoute,
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
