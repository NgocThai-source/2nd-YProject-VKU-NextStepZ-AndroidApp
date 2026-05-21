package com.example.nextstepz.ui.screens.auth

import  android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material.icons.outlined.Person
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
import com.example.nextstepz.auth.data.local.TokenManager
import com.example.nextstepz.auth.data.model.RegisterRequest
import com.example.nextstepz.ui.components.GlassCard
import com.example.nextstepz.ui.components.GradientButton
import com.example.nextstepz.ui.components.NextStepZTextField
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.InputPlaceholder
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary

@Composable
fun RegisterScreen(
    onNavigateToLogin: () -> Unit,
    viewModel: AuthViewModel = viewModel()
) {
    // Lấy context để hiển thị Toast
    val context = LocalContext.current

    var fullName by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }
    var confirmPassword by rememberSaveable { mutableStateOf("") }
    var passwordVisible by rememberSaveable { mutableStateOf(false) }
    var confirmPasswordVisible by rememberSaveable { mutableStateOf(false) }

    // Validate confirm password
    val passwordMismatch = confirmPassword.isNotEmpty() && password != confirmPassword
    val tokenManager = remember { TokenManager(context) }
    // ─── LẮNG NGHE TRẠNG THÁI TỪ VIEWMODEL ─────────────────────
    val authState = viewModel.authState
    LaunchedEffect(authState) {
        if(authState is AuthState.Success) {
            Toast.makeText(context, authState.message, Toast.LENGTH_LONG).show()
            viewModel.resetState()
            onNavigateToLogin()
        }else if(authState is AuthState.Error) {
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

        // ─── Logo & Tagline ─────────────────────────────────────
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Image(
                painter = painterResource(id = R.drawable.logo_full),
                contentDescription = "NextStepZ Logo",
                modifier = Modifier
                    .width(200.dp)
                    .height(55.dp),
                contentScale = ContentScale.Fit
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Bắt đầu hành trình của bạn",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary,
                textAlign = TextAlign.Center
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        // ─── Register Form Card ─────────────────────────────────
        GlassCard {
            // Title
            Text(
                text = "Tạo tài khoản",
                style = MaterialTheme.typography.headlineSmall,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Đăng ký để khám phá cơ hội việc làm",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Full Name field
            NextStepZTextField(
                value = fullName,
                onValueChange = { fullName = it },
                label = "Họ và tên",
                placeholder = "Nhập họ và tên",
                leadingIcon = Icons.Outlined.Person,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Email field
            NextStepZTextField(
                value = email,
                onValueChange = { email = it },
                label = "Email",
                placeholder = "Nhập email của bạn",
                leadingIcon = Icons.Outlined.Email,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Password field
            NextStepZTextField(
                value = password,
                onValueChange = { password = it },
                label = "Mật khẩu",
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
                singleLine = true
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Confirm Password field
            NextStepZTextField(
                value = confirmPassword,
                onValueChange = { confirmPassword = it },
                label = "Xác nhận mật khẩu",
                placeholder = "Nhập lại mật khẩu",
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

            // Register button
            GradientButton(
                text = "Đăng ký",
                onClick = {
                    val request = RegisterRequest(fullName, email, password)
                    viewModel.register(request, tokenManager)
                },
                isLoading = authState is AuthState.Loading,
                enabled = fullName.isNotBlank() &&
                        email.isNotBlank() &&
                        password.isNotBlank() &&
                        confirmPassword.isNotBlank() &&
                        !passwordMismatch
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        // ─── Login Link ─────────────────────────────────────────
        val annotatedString = buildAnnotatedString {
            withStyle(SpanStyle(color = TextSecondary)) {
                append("Đã có tài khoản? ")
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

        Spacer(modifier = Modifier.height(40.dp))
    }
}
