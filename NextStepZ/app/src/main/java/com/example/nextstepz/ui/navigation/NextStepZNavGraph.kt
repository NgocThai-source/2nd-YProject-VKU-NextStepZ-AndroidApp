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
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.nextstepz.ui.components.AnimatedGradientBackground
import com.example.nextstepz.ui.screens.auth.ForgotPasswordScreen
import com.example.nextstepz.ui.screens.auth.LoginScreen
import com.example.nextstepz.ui.screens.auth.RegisterScreen

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
                    onLoginClick = { email, password ->
                        // TODO: Integrate with ViewModel for actual login
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
                    },
                    onRegisterClick = { fullName, email, password ->
                        // TODO: Integrate with ViewModel for actual registration
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
                    onSubmitClick = { email ->
                        // TODO: Integrate with ViewModel for actual password reset
                    }
                )
            }
        }
    }
}
