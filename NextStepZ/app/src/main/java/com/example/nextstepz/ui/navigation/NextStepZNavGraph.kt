package com.example.nextstepz.ui.navigation

import android.os.Build
import androidx.annotation.RequiresApi
import android.content.Context
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
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
import com.example.nextstepz.ui.screens.chat.ChatDetailScreen
import com.example.nextstepz.ui.screens.chat.ChatListScreen
import com.example.nextstepz.ui.screens.chat.ChatViewModel
import com.example.nextstepz.ui.screens.main.MainScreen

private const val TRANSITION_DURATION = 350

/**
 * Main navigation graph for the app.
 * Background is rendered once at this level so transitions between screens
 * never show a gap/flash. Only the foreground content animates.
 */
@RequiresApi(Build.VERSION_CODES.O)
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
                        navController.navigate(Screen.Main.route) {
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
                    fadeIn(
                        animationSpec = tween(
                            TRANSITION_DURATION,
                            easing = FastOutSlowInEasing
                        )
                    )
                },
                exitTransition = {
                    fadeOut(
                        animationSpec = tween(
                            TRANSITION_DURATION,
                            easing = FastOutSlowInEasing
                        )
                    )
                }
            ) {
                MainScreen(
                    onLogout = {
                        navController.navigate(Screen.Login.route) {
                            popUpTo(Screen.Main.route) { inclusive = true }
                            launchSingleTop = true
                        }
                    },

                    onNavigateToChatDetail = { conversationId, partnerName, partnerId ->
                        navController.navigate(
                            Screen.ChatDetail.createRoute(
                                conversationId,
                                partnerName,
                                partnerId
                            )
                        ) {
                            launchSingleTop = true
                        }
                    }
                )
            }

// ─── CHAT DETAIL SCREEN ────────────────────────────────
            composable(
                route = Screen.ChatDetail.route,
                arguments = listOf(
                    navArgument("conversationId") { type = NavType.StringType },
                    navArgument("partnerName") { type = NavType.StringType },
                    navArgument("partnerId") { type = NavType.StringType }
                )
            ) { backStackEntry ->
                val conversationId = backStackEntry.arguments?.getString("conversationId") ?: ""
                val partnerId = backStackEntry.arguments?.getString("partnerId") ?: ""

                // NHỚ DECODE TÊN ĐỂ TRẢ LẠI KHOẢNG TRẮNG VÀ DẤU TIẾNG VIỆT
                val encodedName = backStackEntry.arguments?.getString("partnerName") ?: ""
                val partnerName = java.net.URLDecoder.decode(encodedName, java.nio.charset.StandardCharsets.UTF_8.toString())

                val chatViewModel: ChatViewModel = androidx.lifecycle.viewmodel.compose.viewModel()
                val context = androidx.compose.ui.platform.LocalContext.current
                val sharedPref = context.getSharedPreferences("AppPrefs", android.content.Context.MODE_PRIVATE)
                val currentUserId = sharedPref.getString("USER_ID", "") ?: ""

                ChatDetailScreen(
                    conversationId = conversationId,
                    partnerName = partnerName,
                    currentUserId = currentUserId,
                    onNavigateBack = { navController.popBackStack() },
                    viewModel = chatViewModel
                )
            }
        }
    }
}
