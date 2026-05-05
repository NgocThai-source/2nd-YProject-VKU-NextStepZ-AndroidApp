package com.example.nextstepz.ui.navigation

/**
 * Sealed class representing all navigation routes in the app.
 * Each screen has a unique route string for type-safe navigation.
 */
sealed class Screen(val route: String) {
    data object Login : Screen("login")
    data object Register : Screen("register")
    data object ForgotPassword : Screen("forgot_password")
    // Future screens will be added here
    // data object Home : Screen("home")
}
