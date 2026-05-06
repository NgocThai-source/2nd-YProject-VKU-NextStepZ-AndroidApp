package com.example.nextstepz.ui.screens.auth

import android.util.Patterns
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
import androidx.compose.material.icons.outlined.Email
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.text.KeyboardOptions
import com.example.nextstepz.R
import com.example.nextstepz.ui.components.GlassCard
import com.example.nextstepz.ui.components.GradientButton
import com.example.nextstepz.ui.components.NextStepZTextField
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary

/**
 * Forgot Password Screen — Step 1: Enter email to receive OTP code.
 * Background is rendered at NavGraph level for seamless transitions.
 *
 * Flow: Email Input → OTP Verification → New Password
 */
@Composable
fun ForgotPasswordScreen(
    onNavigateBack: () -> Unit,
    onNavigateToOtp: (email: String) -> Unit = {}
) {
    var email by rememberSaveable { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }

    // Email validation
    val isEmailValid = Patterns.EMAIL_ADDRESS.matcher(email).matches()
    val showEmailError = email.isNotBlank() && !isEmailValid

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

        // ─── Email Input Form ───────────────────────────────────
        GlassCard {
            // Title
            Text(
                text = "Quên mật khẩu?",
                style = MaterialTheme.typography.headlineSmall,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Nhập email đã đăng ký, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu cho bạn.",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Email field
            NextStepZTextField(
                value = email,
                onValueChange = { email = it },
                label = "Email",
                placeholder = "Nhập email của bạn",
                leadingIcon = Icons.Outlined.Email,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                isError = showEmailError,
                errorMessage = if (showEmailError) "Email không đúng định dạng" else null,
                singleLine = true
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Submit button — text changed per requirement
            GradientButton(
                text = "Gửi mã đặt lại mật khẩu",
                onClick = {
                    isLoading = true
                    // Navigate to OTP screen with the email
                    onNavigateToOtp(email)
                    isLoading = false
                },
                isLoading = isLoading,
                enabled = email.isNotBlank() && isEmailValid
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        // ─── Back to Login Link ─────────────────────────────────
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
                onClick = onNavigateBack
            )
        )

        Spacer(modifier = Modifier.height(40.dp))
    }
}
