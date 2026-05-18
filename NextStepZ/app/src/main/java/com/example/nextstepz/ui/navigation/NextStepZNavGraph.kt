package com.example.nextstepz.ui.navigation

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.example.nextstepz.ui.components.AnimatedGradientBackground
import com.example.nextstepz.ui.screens.auth.ForgotPasswordScreen
import com.example.nextstepz.ui.screens.auth.LoginScreen
import com.example.nextstepz.ui.screens.auth.NewPasswordScreen
import com.example.nextstepz.ui.screens.auth.OtpVerificationScreen
import com.example.nextstepz.ui.screens.auth.RegisterScreen
import com.example.nextstepz.ui.screens.chat.ChatSandboxScreen
import com.example.nextstepz.ui.screens.chat.ChatViewModel
import com.example.nextstepz.ui.screens.main.MainScreen

private const val TRANSITION_DURATION = 350

/**
 * Main navigation graph for the app.
 * Background is rendered once at this level so transitions between screens
 * never show a gap/flash. Only the foreground content animates.
 */
@Composable
fun NextStepZNavGraph(
    navController: NavHostController,
    startDestination: String = Screen.Login.route
) {
    Box(modifier = Modifier.fillMaxSize()) {
        // ─── Persistent background — never re-created during transitions ───
        AnimatedGradientBackground()

        // ─── Navigation with crossfade (no slide = no gap) ─────────────
        NavHost(
            navController = navController,
            startDestination = startDestination,
        ) {
            // ─── Login Screen ───────────────────────────────────────
            composable(
                route = Screen.Login.route,
                enterTransition = {
                    fadeIn(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                exitTransition = {
                    fadeOut(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                popEnterTransition = {
                    fadeIn(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                popExitTransition = {

                    fadeOut(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                }
            ) {
                LoginScreen(
                    onNavigateToRegister = {
                        navController.navigate(Screen.Register.route) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                            launchSingleTop = true
                        }
                    },
                    onNavigateToForgotPassword = {
                        navController.navigate(Screen.ForgotPassword.route) {
                            launchSingleTop = true
                        }
                    },
                    onNavigateToHome = {
                        navController.navigate(Screen.ChatSandbox.route) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                            launchSingleTop = true
                        }
                    }
                )
            }

            // ─── Register Screen ────────────────────────────────────
            composable(
                route = Screen.Register.route,
                enterTransition = {
                    fadeIn(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                exitTransition = {
                    fadeOut(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                popEnterTransition = {
                    fadeIn(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                popExitTransition = {
                    fadeOut(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                }
            ) {
                RegisterScreen(
                    onNavigateToLogin = {
                        navController.navigate(Screen.Login.route) {
                            popUpTo(Screen.Register.route) { inclusive = true }
                            launchSingleTop = true
                        }
                    }
                )
            }

            // ─── Forgot Password Screen ─────────────────────────────
            composable(
                route = Screen.ForgotPassword.route,
                enterTransition = {
                    fadeIn(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                exitTransition = {
                    fadeOut(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                popEnterTransition = {
                    fadeIn(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                popExitTransition = {
                    fadeOut(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                }
            ) {
                ForgotPasswordScreen(
                    onNavigateBack = {
                        navController.popBackStack()
                    },
                    onNavigateToOtp = { email ->
                        navController.navigate(Screen.OtpVerification.createRoute(email)) {
                            launchSingleTop = true
                        }
                    }
                )
            }
            // ─── OTP Verification Screen ────────────────────────────
            composable(
                route = Screen.OtpVerification.route,
                arguments = listOf(
                    navArgument("email") {
                        type = NavType.StringType
                        defaultValue = ""
                    }
                ),
                enterTransition = {
                    fadeIn(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                exitTransition = {
                    fadeOut(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                popEnterTransition = {
                    fadeIn(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                popExitTransition = {
                    fadeOut(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                }
            ) { backStackEntry ->
                val email = backStackEntry.arguments?.getString("email") ?: ""
                OtpVerificationScreen(
                    email = email,
                    onNavigateBack = {
                        navController.popBackStack()
                    },
                    onNavigateToNewPassword = { verifiedEmail ->
                        navController.navigate(Screen.NewPassword.createRoute(verifiedEmail)) {
                            // Pop OTP + ForgotPassword from back stack
                            popUpTo(Screen.ForgotPassword.route) { inclusive = true }
                            launchSingleTop = true
                        }
                    },
                    onNavigateToLogin = {
                        navController.navigate(Screen.Login.route) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                            launchSingleTop = true
                        }
                    }
                )
            }
            // ─── New Password Screen ────────────────────────────────
            composable(
                route = Screen.NewPassword.route,
                arguments = listOf(
                    navArgument("email") {
                        type = NavType.StringType
                        defaultValue = ""
                    }
                ),
                enterTransition = {
                    fadeIn(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                exitTransition = {
                    fadeOut(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                popEnterTransition = {
                    fadeIn(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                popExitTransition = {
                    fadeOut(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                }
            ) { backStackEntry ->
                val email = backStackEntry.arguments?.getString("email") ?: ""
                NewPasswordScreen(
                    email = email,
                    onNavigateToLogin = {
                        navController.navigate(Screen.Login.route) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                            launchSingleTop = true
                        }
                    },
                    onNavigateBack = {
                        navController.popBackStack()
                    }
                )
            }
            composable(
                route = Screen.Main.route,
                enterTransition = {
                    fadeIn(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                exitTransition = {
                    fadeOut(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                }
            ){
                MainScreen()
            }
            // ─── Màn hình Test Chat Realtime ────────────────────────
            composable(
                route = Screen.ChatSandbox.route,
                enterTransition = {
                    fadeIn(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                },
                exitTransition = {
                    fadeOut(animationSpec = tween(TRANSITION_DURATION, easing = FastOutSlowInEasing))
                }
            ) {
                // Khởi tạo ViewModel (sử dụng viewModels() hoặc koin/hilt tùy project của bạn)
                val chatViewModel: ChatViewModel = androidx.lifecycle.viewmodel.compose.viewModel()

                // TODO: Chỗ này bạn cần lấy ID của user đang đăng nhập hiện tại từ Supabase Auth.
                // Ví dụ tạm thời gán cứng để bạn hình dung, khi chạy thật hãy thay bằng ID lấy từ Auth nhé:
//                val currentUserId = "9b38990b-15d5-414c-ad85-a746e53f4bf6" //Nguyen
                val currentUserId = "9255374e-1e6d-4e9b-b4ec-5b11b2652605" // Thai

                // Dán cứng ID phòng chat bạn vừa tạo bằng tay trên bảng conversations ở Supabase
                val testConversationId = "6d239a28-a46b-4aca-801c-03d6fa573e84"

                ChatSandboxScreen(
                    viewModel = chatViewModel,
                    currentUserId = currentUserId,
                    conversationId = testConversationId
                )
            }
        }
    }
}
