package com.example.nextstepz.ui.navigation

import android.net.Uri
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.Article
import androidx.compose.material.icons.automirrored.outlined.Chat
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Work
import androidx.compose.ui.graphics.vector.ImageVector
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

/**
 * Sealed class representing all navigation routes in the app.
 * Each screen has a unique route string for type-safe navigation.
 */
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
    // ─── Main Flow (Bottom Nav) ─────────────────────────────────
    data object Main : Screen("main")
    data object Home : Screen("home")
    data object CvProfile : Screen("cv_profile")
    data object Notifications : Screen("notifications")
    data object Jobs : Screen("jobs")
    data object Feeds : Screen("feeds")
    data object Messages : Screen("messages")
    data object Account : Screen("account")

    data object ChatDetail : Screen("chat_detail/{conversationId}/{partnerName}/{partnerId}") {
        fun createRoute(conversationId: String, partnerName: String, partnerId: String): String {
            val encodedName = URLEncoder.encode(partnerName, StandardCharsets.UTF_8.toString())
            val encodedId = URLEncoder.encode(partnerId, StandardCharsets.UTF_8.toString())
            return "chat_detail/$conversationId/$encodedName/$encodedId"
        }
    }

    data object ChatSandbox : Screen("chat_sandbox")
    // Account sub-screens
    data object RegisterStudent : Screen("register_student")
    data object RegisterEmployer : Screen("register_employer")
    data object Privacy : Screen("privacy")
    data object Favorites : Screen("favorites")
    data object CvStorage : Screen("cv_storage")
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
    BottomNavItem(Screen.Notifications, "Thông báo", Icons.Outlined.Notifications),
    BottomNavItem(Screen.Jobs, "Việc làm", Icons.Outlined.Work),
    BottomNavItem(Screen.Feeds, "Bài viết", Icons.AutoMirrored.Outlined.Article),
    BottomNavItem(Screen.Messages, "Tin Nhắn", Icons.AutoMirrored.Outlined.Chat),
    BottomNavItem(Screen.Account, "Tài khoản", Icons.Outlined.Person),
)
