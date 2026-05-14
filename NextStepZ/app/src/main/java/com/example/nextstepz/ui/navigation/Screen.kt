package com.example.nextstepz.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.Article
import androidx.compose.material.icons.automirrored.outlined.Chat
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Work
import androidx.compose.ui.graphics.vector.ImageVector

/**
 * Sealed class representing all navigation routes in the app.
 * Each screen has a unique route string for type-safe navigation.
 */
sealed class Screen(val route: String) {
    // ─── Auth Flow ──────────────────────────────────────────────
    data object Login : Screen("login")
    data object Register : Screen("register")
    data object ForgotPassword : Screen("forgot_password")

    // ─── Main Flow (Bottom Nav) ─────────────────────────────────
    data object Main : Screen("main")
    data object Home : Screen("home")
    data object CvProfile : Screen("cv_profile")
    data object Jobs : Screen("jobs")
    data object Articles : Screen("articles")
    data object Messages : Screen("messages")
    data object Account : Screen("account")
}

/**
 * Represents a bottom navigation tab item.
 */
data class BottomNavItem(
    val screen: Screen,
    val label: String,
    val icon: ImageVector,
)

/**
 * List of all bottom navigation items for the app.
 */
val bottomNavItems = listOf(
    BottomNavItem(Screen.Home, "Trang chủ", Icons.Outlined.Home),
    BottomNavItem(Screen.CvProfile, "Hồ sơ CV", Icons.Outlined.Description),
    BottomNavItem(Screen.Jobs, "Việc làm", Icons.Outlined.Work),
    BottomNavItem(Screen.Articles, "Bài viết", Icons.AutoMirrored.Outlined.Article),
    BottomNavItem(Screen.Messages, "Tin Nhắn", Icons.AutoMirrored.Outlined.Chat),
    BottomNavItem(Screen.Account, "Tài khoản", Icons.Outlined.Person),
)
