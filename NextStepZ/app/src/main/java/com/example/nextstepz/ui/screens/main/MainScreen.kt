package com.example.nextstepz.ui.screens.main

import FeedsScreen
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
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.nextstepz.ui.components.BottomNavBar
import com.example.nextstepz.ui.navigation.BottomNavItem
import com.example.nextstepz.ui.navigation.Screen
import com.example.nextstepz.ui.navigation.bottomNavItems
import com.example.nextstepz.ui.screens.account.AccountScreen
import com.example.nextstepz.ui.screens.home.HomeScreen
import com.example.nextstepz.feeds.jobs.ui.screens.JobsScreen

private const val TAB_TRANSITION = 300

@Composable
fun MainScreen(
    onLogout: () -> Unit = {}
) {
    val innerNavController = rememberNavController()
    var currentRoute by rememberSaveable { mutableStateOf(Screen.Home.route) }

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
                        PlaceholderScreen("Tin Nhắn", Icons.AutoMirrored.Outlined.Chat)
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
