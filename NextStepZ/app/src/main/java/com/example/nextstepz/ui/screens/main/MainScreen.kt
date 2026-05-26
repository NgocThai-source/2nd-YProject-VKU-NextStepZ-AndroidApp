package com.example.nextstepz.ui.screens.main

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.Article
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Work
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.nextstepz.data.repository.NotificationRepository
import com.example.nextstepz.ui.components.BottomNavBar
import com.example.nextstepz.ui.navigation.Screen
import com.example.nextstepz.ui.navigation.bottomNavItems
import com.example.nextstepz.ui.screens.home.HomeScreen
import com.example.nextstepz.ui.screens.notification.NotificationScreen
import com.example.nextstepz.ui.screens.notification.NotificationViewModel

private const val TAB_TRANSITION = 300

/**
 * Main screen container with bottom navigation bar and animated gradient background.
 * Houses the inner NavHost for tab-based navigation (Home, CV, Jobs, Articles, Account).
 */
@Composable
fun MainScreen() {
    val innerNavController = rememberNavController()
    var currentRoute by rememberSaveable { mutableIntStateOf(0) }
    val notificationRepository = remember { NotificationRepository() }
    val notifications by notificationRepository.notifications.collectAsState()
    val unreadCount = notifications.count { !it.isRead }

    Box(modifier = Modifier.fillMaxSize()) {

        Column(modifier = Modifier.fillMaxSize()) {
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
                    composable(Screen.Notification.route) {
                        NotificationScreen(
                            viewModel = NotificationViewModel(notificationRepository)
                        )
                    }
                    composable(Screen.CvProfile.route) {
                        PlaceholderScreen("Hồ sơ CV", Icons.Outlined.Description)
                    }
                    composable(Screen.Jobs.route) {
                        PlaceholderScreen("Việc làm", Icons.Outlined.Work)
                    }
                    composable(Screen.Articles.route) {
                        PlaceholderScreen("Bài viết", Icons.AutoMirrored.Outlined.Article)
                    }
                    composable(Screen.Account.route) {
                        PlaceholderScreen("Tài khoản", Icons.Outlined.Person)
                    }
                }
            }

            BottomNavBar(
                items = bottomNavItems,
                currentRoute = bottomNavItems[currentRoute].screen.route,
                onItemClick = { item ->
                    val index = bottomNavItems.indexOf(item)
                    if (currentRoute != index) {
                        currentRoute = index
                        innerNavController.navigate(item.screen.route) {
                            popUpTo(Screen.Home.route) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                },
                unreadCount = unreadCount
            )
        }
    }
}
