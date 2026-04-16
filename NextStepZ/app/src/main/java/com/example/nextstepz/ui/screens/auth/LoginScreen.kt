package com.example.nextstepz.ui.screens.auth

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.nextstepz.R
import com.example.nextstepz.ui.components.AnimatedGradientBackground
import com.example.nextstepz.ui.components.GlassmorphismCard
import com.example.nextstepz.ui.components.NextStepZButton
import com.example.nextstepz.ui.components.NextStepZTextField
import com.example.nextstepz.ui.theme.BlueLight
import com.example.nextstepz.ui.theme.CyanLight
import com.example.nextstepz.ui.theme.DividerColor
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.ErrorRedLight
import com.example.nextstepz.ui.theme.Exo2FontFamily
import com.example.nextstepz.ui.theme.GlassBackground
import com.example.nextstepz.ui.theme.PoppinsFontFamily
import com.example.nextstepz.ui.theme.TextMuted
import com.example.nextstepz.ui.theme.TextSecondary

// Login Screen - Matching web frontend design
@Composable
fun LoginScreen(
    onNavigateToRegister: () -> Unit = {},
    onNavigateToForgotPassword: () -> Unit = {},
    onLoginSuccess: () -> Unit = {},
    viewModel: LoginViewModel = viewModel()
) {
    val email by viewModel.email.collectAsStateWithLifecycle()
    val password by viewModel.password.collectAsStateWithLifecycle()
    val showPassword by viewModel.showPassword.collectAsStateWithLifecycle()
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    val isLoading = uiState is LoginUiState.Loading
    val errorMessage = (uiState as? LoginUiState.Error)?.message

    val scrollState = rememberScrollState()

    LaunchedEffect(uiState) {
        if (uiState is LoginUiState.Success) {
            onLoginSuccess()
        }
    }

    AnimatedGradientBackground {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .statusBarsPadding()
                .navigationBarsPadding()
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Spacer(modifier = Modifier.height(40.dp))

            // Logo NextStepZ
            Image(
                painter = painterResource(id = R.drawable.logofull1_transparent),
                contentDescription = "NextStepZ Logo",
                modifier = Modifier
                    .width(220.dp)
                    .padding(bottom = 8.dp),
                contentScale = ContentScale.FillWidth
            )

            // Welcome Text
            Text(
                text = "Khởi động hành trình của bạn",
                style = TextStyle(
                    fontFamily = Exo2FontFamily,
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 20.sp,
                    brush = Brush.horizontalGradient(
                        colors = listOf(CyanLight, BlueLight)
                    )
                ),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(bottom = 4.dp)
            )

            // Subtitle
            Text(
                text = buildAnnotatedString {
                    append("Bạn là một phần của cộng đồng ")
                    withStyle(SpanStyle(color = CyanLight, fontWeight = FontWeight.SemiBold)) {
                        append("NextStepZ")
                    }
                },
                style = TextStyle(
                    fontFamily = PoppinsFontFamily,
                    fontWeight = FontWeight.Normal,
                    fontSize = 13.sp,
                    color = TextSecondary
                ),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(bottom = 24.dp)
            )

            // Glassmorphism Form Card
            GlassmorphismCard(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Form Header
                    Text(
                        text = "Trở lại và tiếp tục tiến bước",
                        style = TextStyle(
                            fontFamily = Exo2FontFamily,
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 22.sp,
                            brush = Brush.horizontalGradient(
                                colors = listOf(CyanLight, BlueLight)
                            )
                        )
                    )

                    Text(
                        text = "Nhập thông tin đăng nhập để tiếp tục hành trình của bạn",
                        style = TextStyle(
                            fontFamily = PoppinsFontFamily,
                            fontWeight = FontWeight.Normal,
                            fontSize = 13.sp,
                            color = TextMuted
                        )
                    )

                    // Error Message
                    AnimatedVisibility(
                        visible = errorMessage != null,
                        enter = fadeIn() + slideInVertically(initialOffsetY = { -it / 2 }),
                        exit = fadeOut() + slideOutVertically(targetOffsetY = { -it / 2 })
                    ) {
                        if (errorMessage != null) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(ErrorRed.copy(alpha = 0.1f))
                                    .border(
                                        width = 1.dp,
                                        color = ErrorRed.copy(alpha = 0.3f),
                                        shape = RoundedCornerShape(12.dp)
                                    )
                                    .padding(12.dp)
                            ) {
                                Text(
                                    text = errorMessage,
                                    style = TextStyle(
                                        fontFamily = PoppinsFontFamily,
                                        fontWeight = FontWeight.Normal,
                                        fontSize = 13.sp,
                                        color = ErrorRedLight
                                    )
                                )
                            }
                        }
                    }

                    // Email Input
                    NextStepZTextField(
                        value = email,
                        onValueChange = viewModel::onEmailChange,
                        label = "Email hoặc Số điện thoại",
                        placeholder = "example@email.com",
                        enabled = !isLoading,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Password Input
                    NextStepZTextField(
                        value = password,
                        onValueChange = viewModel::onPasswordChange,
                        label = "Mật khẩu",
                        placeholder = "••••••••",
                        enabled = !isLoading,
                        visualTransformation = if (showPassword) {
                            VisualTransformation.None
                        } else {
                            PasswordVisualTransformation()
                        },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        trailingIcon = {
                            IconButton(
                                onClick = viewModel::toggleShowPassword,
                                enabled = !isLoading,
                                modifier = Modifier.size(24.dp)
                            ) {
                                Icon(
                                    imageVector = if (showPassword) {
                                        Icons.Default.VisibilityOff
                                    } else {
                                        Icons.Default.Visibility
                                    },
                                    contentDescription = if (showPassword) "Hide password" else "Show password",
                                    tint = if (showPassword) CyanLight else TextMuted,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        },
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Forgot Password
                    Box(
                        modifier = Modifier.fillMaxWidth(),
                        contentAlignment = Alignment.CenterEnd
                    ) {
                        Text(
                            text = "Quên mật khẩu?",
                            style = TextStyle(
                                fontFamily = Exo2FontFamily,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 14.sp,
                                color = CyanLight
                            ),
                            modifier = Modifier
                                .clickable(enabled = !isLoading) {
                                    onNavigateToForgotPassword()
                                }
                                .padding(vertical = 4.dp)
                        )
                    }

                    // Login Button
                    NextStepZButton(
                        text = "Đăng Nhập",
                        onClick = viewModel::login,
                        enabled = !isLoading,
                        isLoading = isLoading,
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Divider
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(1.dp)
                                .background(DividerColor)
                        )
                        Text(
                            text = "Hoặc tiếp tục với",
                            style = TextStyle(
                                fontFamily = PoppinsFontFamily,
                                fontWeight = FontWeight.Normal,
                                fontSize = 13.sp,
                                color = TextMuted
                            ),
                            modifier = Modifier.padding(horizontal = 12.dp)
                        )
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(1.dp)
                                .background(DividerColor)
                        )
                    }

                    // Social Login Buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        SocialLoginButton(
                            text = "Facebook",
                            icon = "F",
                            onClick = { },
                            modifier = Modifier.weight(1f)
                        )
                        SocialLoginButton(
                            text = "Google",
                            icon = "G",
                            onClick = { },
                            modifier = Modifier.weight(1f)
                        )
                    }

                    // Register Link
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 8.dp),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Bạn chưa có tài khoản? ",
                            style = TextStyle(
                                fontFamily = PoppinsFontFamily,
                                fontWeight = FontWeight.Normal,
                                fontSize = 14.sp,
                                color = TextMuted
                            )
                        )
                        Text(
                            text = "Đăng ký tại đây",
                            style = TextStyle(
                                fontFamily = Exo2FontFamily,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = CyanLight
                            ),
                            modifier = Modifier.clickable(enabled = !isLoading) {
                                onNavigateToRegister()
                            }
                        )
                    }
                }
            }

            // Bottom Quote
            Text(
                text = "\"Mỗi bước tiến của bạn hôm nay sẽ mở ra những cánh cửa mới cho ngày mai.\"",
                style = TextStyle(
                    fontFamily = PoppinsFontFamily,
                    fontWeight = FontWeight.Medium,
                    fontStyle = FontStyle.Italic,
                    fontSize = 13.sp,
                    color = TextSecondary.copy(alpha = 0.7f)
                ),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 24.dp, bottom = 32.dp)
            )
        }
    }
}

// Social Login Button
@Composable
private fun SocialLoginButton(
    text: String,
    icon: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val shape = RoundedCornerShape(12.dp)

    Box(
        modifier = modifier
            .height(48.dp)
            .clip(shape)
            .background(GlassBackground)
            .border(
                width = 1.dp,
                color = DividerColor,
                shape = shape
            )
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Row(
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 16.dp)
        ) {
            Text(
                text = icon,
                style = TextStyle(
                    fontFamily = Exo2FontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    color = CyanLight
                ),
                modifier = Modifier.padding(end = 8.dp)
            )
            Text(
                text = text,
                style = TextStyle(
                    fontFamily = Exo2FontFamily,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 14.sp,
                    color = TextSecondary
                )
            )
        }
    }
}
