package com.example.nextstepz.ui.screens.auth

import com.example.nextstepz.ui.screens.auth.AuthViewModel
import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material.icons.outlined.Visibility
import androidx.compose.material.icons.outlined.VisibilityOff
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.nextstepz.R
import com.example.nextstepz.auth.data.model.ResetPasswordRequest
import com.example.nextstepz.ui.components.GlassCard
import com.example.nextstepz.ui.components.GradientButton
import com.example.nextstepz.ui.components.NextStepZTextField
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.InputPlaceholder
import com.example.nextstepz.ui.theme.SuccessGreen
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary

/**
 * New Password Screen — Step 3 (final) of Forgot Password flow.
 * Allows the user to set a new password after OTP verification.
 * Currently uses mock data — will be connected to the backend API later.
 */
@Composable
fun NewPasswordScreen(
    email: String,
    onNavigateToLogin: () -> Unit,
    onNavigateBack: () -> Unit = {},
    viewModel: AuthViewModel = viewModel(),

) {
    val context = LocalContext.current

    var newPassword by rememberSaveable { mutableStateOf("") }
    var confirmPassword by rememberSaveable { mutableStateOf("") }
    var passwordVisible by rememberSaveable { mutableStateOf(false) }
    var confirmPasswordVisible by rememberSaveable { mutableStateOf(false) }
    var isSuccess by rememberSaveable { mutableStateOf(false) }
    // Validate confirm password
    val passwordMismatch = confirmPassword.isNotEmpty() && newPassword != confirmPassword
    // Validate minimum length
    val passwordTooShort = newPassword.isNotEmpty() && newPassword.length < 6

    val authState = viewModel.authState
    LaunchedEffect(authState) {
        if(authState is AuthState.Success){
            Toast.makeText(context, authState.message, Toast.LENGTH_LONG).show()
            isSuccess = true
            viewModel.resetState()
        }else if(authState is AuthState.Error){
            Toast.makeText(context, authState.message, Toast.LENGTH_LONG).show()
            viewModel.resetState()
        }
    }
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 24.dp)
            .imePadding(),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Spacer(modifier = Modifier.height(60.dp))

        // ─── Back Button ────────────────────────────────────────
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = onNavigateBack,
                modifier = Modifier.size(40.dp)
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Outlined.ArrowBack,
                    contentDescription = "Quay lại",
                    tint = TextPrimary,
                    modifier = Modifier.size(24.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // ─── Logo ───────────────────────────────────────────────
        Image(
            painter = painterResource(id = R.drawable.logo_full),
            contentDescription = "NextStepZ Logo",
            modifier = Modifier
                .width(180.dp)
                .height(50.dp),
            contentScale = ContentScale.Fit
        )

        Spacer(modifier = Modifier.height(40.dp))

        if (!isSuccess) {
            // ─── New Password Form ──────────────────────────────
            GlassCard {
                // Title
                Text(
                    text = "Đặt mật khẩu mới",
                    style = MaterialTheme.typography.headlineSmall,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Tạo mật khẩu mới cho tài khoản của bạn. Mật khẩu phải có tối thiểu 6 ký tự.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )

                Spacer(modifier = Modifier.height(28.dp))

                // New Password field
                NextStepZTextField(
                    value = newPassword,
                    onValueChange = { newPassword = it },
                    label = "Mật khẩu mới",
                    placeholder = "Tối thiểu 6 ký tự",
                    leadingIcon = Icons.Outlined.Lock,
                    visualTransformation = if (passwordVisible)
                        VisualTransformation.None
                    else
                        PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    trailingIcon = {
                        IconButton(
                            onClick = { passwordVisible = !passwordVisible },
                            modifier = Modifier.size(20.dp)
                        ) {
                            Icon(
                                imageVector = if (passwordVisible)
                                    Icons.Outlined.VisibilityOff
                                else
                                    Icons.Outlined.Visibility,
                                contentDescription = if (passwordVisible)
                                    "Ẩn mật khẩu"
                                else
                                    "Hiện mật khẩu",
                                tint = InputPlaceholder,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    },
                    isError = passwordTooShort,
                    errorMessage = if (passwordTooShort) "Mật khẩu phải có tối thiểu 6 ký tự" else null,
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Confirm Password field
                NextStepZTextField(
                    value = confirmPassword,
                    onValueChange = { confirmPassword = it },
                    label = "Xác nhận mật khẩu mới",
                    placeholder = "Nhập lại mật khẩu mới",
                    leadingIcon = Icons.Outlined.Lock,
                    visualTransformation = if (confirmPasswordVisible)
                        VisualTransformation.None
                    else
                        PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    trailingIcon = {
                        IconButton(
                            onClick = { confirmPasswordVisible = !confirmPasswordVisible },
                            modifier = Modifier.size(20.dp)
                        ) {
                            Icon(
                                imageVector = if (confirmPasswordVisible)
                                    Icons.Outlined.VisibilityOff
                                else
                                    Icons.Outlined.Visibility,
                                contentDescription = if (confirmPasswordVisible)
                                    "Ẩn mật khẩu"
                                else
                                    "Hiện mật khẩu",
                                tint = InputPlaceholder,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    },
                    isError = passwordMismatch,
                    errorMessage = if (passwordMismatch) "Mật khẩu không khớp" else null,
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(28.dp))

                // Submit button
                GradientButton(
                    text = "Đặt lại mật khẩu",
                    onClick = {
                        val request = ResetPasswordRequest(email, newPassword)
                        viewModel.resetPassword(request)
                    },
                    isLoading = authState is AuthState.Loading,
                    enabled = newPassword.length >= 6 &&
                            confirmPassword.isNotBlank() &&
                            !passwordMismatch
                )
            }
        } else {
            // ─── Success State ──────────────────────────────────
            GlassCard {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Success icon using lock
                    Icon(
                        imageVector = Icons.Outlined.Lock,
                        contentDescription = "Đặt lại mật khẩu thành công",
                        tint = SuccessGreen,
                        modifier = Modifier.size(64.dp)
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    Text(
                        text = "Đặt lại mật khẩu thành công!",
                        style = MaterialTheme.typography.headlineSmall,
                        color = TextPrimary,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(28.dp))

                    // Go to login button
                    GradientButton(
                        text = "Đăng nhập ngay",
                        onClick = onNavigateToLogin
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // ─── Back to Login Link ─────────────────────────────────
        if (!isSuccess) {
            val annotatedString = buildAnnotatedString {
                withStyle(SpanStyle(color = TextSecondary)) {
                    append("Nhớ mật khẩu? ")
                }
                withStyle(
                    SpanStyle(
                        brush = Brush.horizontalGradient(
                            listOf(GradientStart, GradientMid, GradientEnd)
                        ),
                        fontWeight = FontWeight.SemiBold
                    )
                ) {
                    append("Đăng nhập")
                }
            }
            Text(
                text = annotatedString,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onNavigateToLogin
                )
            )
        }

        Spacer(modifier = Modifier.height(40.dp))
    }
}
