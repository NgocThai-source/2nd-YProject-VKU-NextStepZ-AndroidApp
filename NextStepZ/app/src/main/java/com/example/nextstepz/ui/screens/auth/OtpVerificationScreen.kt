package com.example.nextstepz.ui.screens.auth

import com.example.nextstepz.ui.screens.auth.AuthViewModel
import android.widget.Toast
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.keyframes
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.nextstepz.R
import com.example.nextstepz.auth.data.model.ForgotPasswordRequest
import com.example.nextstepz.auth.data.model.VerifyOtpRequest
import com.example.nextstepz.ui.components.GlassCard
import com.example.nextstepz.ui.components.GradientButton
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.InputBackground
import com.example.nextstepz.ui.theme.InputBorder
import com.example.nextstepz.ui.theme.InputBorderFocused
import com.example.nextstepz.ui.theme.SuccessGreen
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary
import com.example.nextstepz.ui.theme.TextTertiary
import com.example.nextstepz.ui.theme.WarningYellow
import kotlinx.coroutines.delay
import java.util.Locale

private const val OTP_EXPIRY_SECONDS = 6 * 60
private const val RESEND_COOLDOWN_SECONDS = 60

@Composable
fun OtpVerificationScreen(
    email: String,
    onNavigateBack: () -> Unit,
    onNavigateToNewPassword: (email: String) -> Unit = {},
    onNavigateToLogin: () -> Unit = {},
    viewModel: AuthViewModel = viewModel()
) {
    val context = LocalContext.current
    
    var otpValue by rememberSaveable { mutableStateOf("") }
    var timeRemaining by rememberSaveable { mutableIntStateOf(OTP_EXPIRY_SECONDS) }
    var isExpired by rememberSaveable { mutableStateOf(false) }
    var resendCooldown by rememberSaveable { mutableIntStateOf(RESEND_COOLDOWN_SECONDS) }
    
    // Flag quan trọng để phân biệt hành động Xác thực và Gửi lại
    var isVerifyingRequest by rememberSaveable { mutableStateOf(false) }

    // ─── Countdown Timer (Hết hạn mã OTP) ───────────────────────
    LaunchedEffect(timeRemaining, isExpired) {
        if (timeRemaining > 0 && !isExpired) {
            delay(1000L)
            timeRemaining--
        } else if (timeRemaining == 0) {
            isExpired = true
        }
    }

    // ─── Resend Cooldown Timer (Chống spam) ──────────────────────
    LaunchedEffect(resendCooldown) {
        if (resendCooldown > 0) {
            delay(1000L)
            resendCooldown--
        }
    }

    // ─── Lắng nghe trạng thái từ ViewModel ───────────────────────
    val authState = viewModel.authState
    LaunchedEffect(authState) {
        when (authState) {
            is AuthState.Success -> {
                if (isVerifyingRequest) {
                    // Thành công của việc XÁC THỰC MÃ
                    Toast.makeText(context, authState.message, Toast.LENGTH_LONG).show()
                    viewModel.resetState()
                    onNavigateToNewPassword(email)
                } else {
                    // Thành công của việc GỬI LẠI MÃ (Không chuyển hướng)
                    Toast.makeText(context, "Mã mới đã được gửi thành công!", Toast.LENGTH_SHORT).show()
                    viewModel.resetState()
                }
                isVerifyingRequest = false
            }
            is AuthState.Error -> {
                Toast.makeText(context, authState.message, Toast.LENGTH_LONG).show()
                viewModel.resetState()
                isVerifyingRequest = false
            }
            else -> {}
        }
    }

    // Format time MM:SS
    val minutes = timeRemaining / 60
    val seconds = timeRemaining % 60
    val formattedTime = String.format(Locale.US, "%02d:%02d", minutes, seconds)
    val timerColor = when {
        isExpired -> ErrorRed
        timeRemaining <= 60 -> WarningYellow
        else -> SuccessGreen
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
        Row(modifier = Modifier.fillMaxWidth()) {
            IconButton(onClick = onNavigateBack, modifier = Modifier.size(40.dp)) {
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
            contentDescription = "Logo",
            modifier = Modifier.width(180.dp).height(50.dp),
            contentScale = ContentScale.Fit
        )

        Spacer(modifier = Modifier.height(40.dp))

        GlassCard {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(text = "Xác thực OTP", style = MaterialTheme.typography.headlineSmall, color = TextPrimary)
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = "Nhập mã OTP đã được gửi đến:", style = MaterialTheme.typography.bodyMedium, color = TextSecondary, textAlign = TextAlign.Center)
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = email,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.SemiBold,
                        brush = Brush.horizontalGradient(listOf(GradientStart, GradientMid, GradientEnd))
                    ),
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(32.dp))

                Text(text = if (isExpired) "Mã OTP đã hết hạn" else "Mã hết hạn sau", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                Spacer(modifier = Modifier.height(4.dp))
                Text(text = formattedTime, style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, letterSpacing = 4.sp), color = timerColor)

                Spacer(modifier = Modifier.height(28.dp))

                // ─── OTP Input ──────────────────────────────────
                Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                    BasicTextField(
                        value = otpValue,
                        onValueChange = { newValue ->
                            val filtered = newValue.filter { it.isDigit() }
                            if (filtered.length <= 6) otpValue = filtered
                        },
                        modifier = Modifier.fillMaxWidth().height(64.dp).alpha(0f),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        cursorBrush = SolidColor(InputBorderFocused)
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally)
                    ) {
                        for (i in 0 until 6) {
                            OtpDigitBox(
                                digit = otpValue.getOrNull(i)?.toString() ?: "",
                                isFocused = otpValue.length == i,
                                isError = authState is AuthState.Error
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(28.dp))

                // Nút Xác nhận
                GradientButton(
                    text = "Xác nhận mã OTP",
                    onClick = {
                        if (isExpired) {
                            Toast.makeText(context, "Mã OTP đã hết hạn. Vui lòng thử lại.", Toast.LENGTH_SHORT).show()
                            return@GradientButton
                        }
                        isVerifyingRequest = true
                        viewModel.verifyOtp(VerifyOtpRequest(email, otpValue))
                    },
                    isLoading = authState is AuthState.Loading && isVerifyingRequest,
                    enabled = otpValue.length == 6
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Nút Gửi lại mã với Cooldown
                val canResend = resendCooldown == 0
                val resendText = buildAnnotatedString {
                    withStyle(SpanStyle(color = TextSecondary)) { append("Không nhận được mã? ") }
                    if (canResend) {
                        withStyle(SpanStyle(brush = Brush.horizontalGradient(listOf(GradientStart, GradientMid, GradientEnd)), fontWeight = FontWeight.SemiBold)) {
                            append("Gửi lại")
                        }
                    } else {
                        withStyle(SpanStyle(color = TextTertiary)) { append("Gửi lại sau (${resendCooldown}s)") }
                    }
                }
                Text(
                    text = resendText,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        enabled = canResend && authState !is AuthState.Loading,
                        onClick = {
                            isVerifyingRequest = false // Không phải request xác thực mã
                            viewModel.forgotPassword(ForgotPasswordRequest(email))
                            otpValue = ""
                            timeRemaining = OTP_EXPIRY_SECONDS
                            isExpired = false
                            resendCooldown = RESEND_COOLDOWN_SECONDS
                        }
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // Back to Login
        Text(
            text = buildAnnotatedString {
                withStyle(SpanStyle(color = TextSecondary)) { append("Nhớ mật khẩu? ") }
                withStyle(SpanStyle(brush = Brush.horizontalGradient(listOf(GradientStart, GradientMid, GradientEnd)), fontWeight = FontWeight.SemiBold)) {
                    append("Đăng nhập")
                }
            },
            style = MaterialTheme.typography.bodyMedium,
            modifier = Modifier.clickable { onNavigateToLogin() }
        )
        Spacer(modifier = Modifier.height(40.dp))
    }
}

@Composable
private fun OtpDigitBox(digit: String, isFocused: Boolean, isError: Boolean) {
    val borderColor by animateColorAsState(
        targetValue = when {
            isError -> ErrorRed
            isFocused -> InputBorderFocused
            digit.isNotEmpty() -> SuccessGreen.copy(alpha = 0.6f)
            else -> InputBorder
        },
        animationSpec = tween(durationMillis = 300),
        label = "otp_border_color"
    )

    // Hiệu ứng nhấp nháy cho con trỏ (Discrete Blink)
    val infiniteTransition = rememberInfiniteTransition(label = "cursor")
    val cursorAlpha by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 0f,
        animationSpec = infiniteRepeatable(
            animation = keyframes {
                durationMillis = 1000
                1f at 0
                1f at 499 // Hiện trong 500ms đầu
                0f at 500 // Ẩn trong 500ms sau
                0f at 999
            },
            repeatMode = RepeatMode.Restart
        ),
        label = "cursor_alpha"
    )

    Box(
        modifier = Modifier
            .size(46.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(InputBackground)
            .border(width = 1.5.dp, color = borderColor, shape = RoundedCornerShape(12.dp)),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = digit,
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, fontSize = 22.sp),
            color = if (digit.isNotEmpty()) TextPrimary else TextTertiary,
            textAlign = TextAlign.Center
        )

        // Blinking Cursor (Chỉ hiện khi đang focus và ô trống)
        if (isFocused && digit.isEmpty()) {
            Box(
                modifier = Modifier
                    .width(2.dp)
                    .height(22.dp)
                    .graphicsLayer { alpha = cursorAlpha }
                    .background(Brush.verticalGradient(listOf(GradientStart, GradientMid)))
            )
        }
    }
}
