package com.example.nextstepz.ui.navigation

import android.net.Uri
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.Article
import androidx.compose.material.icons.automirrored.outlined.Chat
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Work
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String) {
    data object Login : Screen("login")
    data object Register : Screen("register")
    data object ForgotPassword : Screen("forgot_password")
    data object OtpVerification : Screen("otp_verification?email={email}") {
        fun createRoute(email: String): String {
            return "otp_verification?email=${Uri.encode(email)}"
        }
    }
    data object NewPassword : Screen("new_password?email={email}") {
        fun createRoute(email: String): String {
            return "new_password?email=${Uri.encode(email)}"
        }
    }
    // Main Flow (Bottom Nav)
    data object Main : Screen("main")
    data object Home : Screen("home")
    data object CvProfile : Screen("cv_profile")
    data object Jobs : Screen("jobs")
    data object Articles : Screen("articles")
    data object Messages : Screen("messages")
    data object Account : Screen("account")
    // Account sub-screens
    data object RegisterStudent : Screen("register_student")
    data object RegisterEmployer : Screen("register_employer")
    data object Privacy : Screen("privacy")
    data object Favorites : Screen("favorites")
    data object CvStorage : Screen("cv_storage")
}

data class BottomNavItem(
    val screen: Screen,
    val label: String,
    val icon: ImageVector,
)

val bottomNavItems = listOf(
    BottomNavItem(Screen.Home, "Trang chủ", Icons.Outlined.Home),
    BottomNavItem(Screen.CvProfile, "Hồ sơ CV", Icons.Outlined.Description),
    BottomNavItem(Screen.Jobs, "Việc làm", Icons.Outlined.Work),
    BottomNavItem(Screen.Articles, "Bài viết", Icons.AutoMirrored.Outlined.Article),
    BottomNavItem(Screen.Messages, "Tin Nhắn", Icons.AutoMirrored.Outlined.Chat),
    BottomNavItem(Screen.Account, "Tài khoản", Icons.Outlined.Person),
)
