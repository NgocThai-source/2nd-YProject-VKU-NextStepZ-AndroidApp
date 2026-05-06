package com.example.nextstepz.ui.navigation

import android.net.Uri

/**
 * Sealed class representing all navigation routes in the app.
 * Each screen has a unique route string for type-safe navigation.
 *
 * OtpVerification and NewPassword use query parameters (?email=...)
 * instead of path parameters (/{email}) to safely handle special
 * characters like '@' and '.' in email addresses.
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
    // Future screens will be added here
    // data object Home : Screen("home")
}
