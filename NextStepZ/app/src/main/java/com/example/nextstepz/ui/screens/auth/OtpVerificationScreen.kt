package com.example.nextstepz.ui.screens.auth

import androidx.compose.animation.animateColorAsState
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nextstepz.R
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

/** Mock OTP for verification */
private const val MOCK_OTP = "0000"

/** OTP expiration time in seconds (6 minutes) */
private const val OTP_EXPIRY_SECONDS = 6 * 60

/**
 * OTP Verification Screen — Step 2 of Forgot Password flow.
 * Displays 4 individual OTP input boxes with a 6-minute countdown timer.
 * Mock OTP is "0000" for testing purposes.
 */
@Composable
fun OtpVerificationScreen(
    email: String,
    onNavigateBack: () -> Unit,
    onNavigateToNewPassword: (email: String) -> Unit = {},
    onNavigateToLogin: () -> Unit = {}
) {
    var otpValue by rememberSaveable { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var isError by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }
    var timeRemaining by rememberSaveable { mutableIntStateOf(OTP_EXPIRY_SECONDS) }
    var isExpired by rememberSaveable { mutableStateOf(false) }

    // ─── Countdown Timer ────────────────────────────────────────
    LaunchedEffect(timeRemaining, isExpired) {
        if (timeRemaining > 0 && !isExpired) {
            delay(1000L)
            timeRemaining--
        } else if (timeRemaining == 0) {
            isExpired = true
        }
    }

    // Format time as MM:SS
    val minutes = timeRemaining / 60
    val seconds = timeRemaining % 60
    val formattedTime = String.format(Locale.US, "%02d:%02d", minutes, seconds)

    // Timer color based on remaining time
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

        // ─── OTP Verification Card ──────────────────────────────
        GlassCard {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Title
                Text(
                    text = "Xác thực OTP",
                    style = MaterialTheme.typography.headlineSmall,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Nhập mã OTP đã được gửi đến:",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(4.dp))

                // Display email with gradient
                Text(
                    text = email,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.SemiBold,
                        brush = Brush.horizontalGradient(
                            listOf(GradientStart, GradientMid, GradientEnd)
                        )
                    ),
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(32.dp))

                // ─── Timer Display ──────────────────────────────
                Text(
                    text = if (isExpired) "Mã OTP đã hết hạn" else "Mã hết hạn sau",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = formattedTime,
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 4.sp
                    ),
                    color = timerColor
                )

                Spacer(modifier = Modifier.height(28.dp))

                // ─── OTP Input ──────────────────────────────────
                // Use a single BasicTextField with visual OTP boxes overlay
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    // Invisible text field handles all keyboard input
                    BasicTextField(
                        value = otpValue,
                        onValueChange = { newValue ->
                            val filtered = newValue.filter { it.isDigit() }
                            if (filtered.length <= 4) {
                                otpValue = filtered
                                isError = false
                                errorMessage = ""
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(64.dp)
                            .alpha(0f),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Number
                        ),
                        cursorBrush = SolidColor(InputBorderFocused)
                    )

                    // Visual OTP boxes (drawn on top)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        for (i in 0 until 4) {
                            OtpDigitBox(
                                digit = otpValue.getOrNull(i)?.toString() ?: "",
                                isFocused = otpValue.length == i,
                                isError = isError
                            )
                        }
                    }
                }

                // Error message
                if (isError) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = errorMessage,
                        style = MaterialTheme.typography.bodySmall,
                        color = ErrorRed,
                        textAlign = TextAlign.Center
                    )
                }

                Spacer(modifier = Modifier.height(28.dp))

                // Verify button
                GradientButton(
                    text = "Xác nhận mã OTP",
                    onClick = {
                        if (isExpired) {
                            isError = true
                            errorMessage = "Mã OTP đã hết hạn. Vui lòng gửi lại mã mới."
                            return@GradientButton
                        }
                        isLoading = true
                        if (otpValue == MOCK_OTP) {
                            // OTP correct — navigate to new password
                            onNavigateToNewPassword(email)
                        } else {
                            isError = true
                            errorMessage = "Mã OTP không đúng. Vui lòng thử lại."
                        }
                        isLoading = false
                    },
                    isLoading = isLoading,
                    enabled = otpValue.length == 4
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Resend OTP
                val resendText = buildAnnotatedString {
                    withStyle(SpanStyle(color = TextSecondary)) {
                        append("Không nhận được mã? ")
                    }
                    withStyle(
                        SpanStyle(
                            brush = Brush.horizontalGradient(
                                listOf(GradientStart, GradientMid, GradientEnd)
                            ),
                            fontWeight = FontWeight.SemiBold
                        )
                    ) {
                        append("Gửi lại")
                    }
                }
                Text(
                    text = resendText,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = {
                            // Reset OTP and timer
                            otpValue = ""
                            isError = false
                            errorMessage = ""
                            timeRemaining = OTP_EXPIRY_SECONDS
                            isExpired = false
                        }
                    )
                )
            }
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
                onClick = onNavigateToLogin
            )
        )

        Spacer(modifier = Modifier.height(40.dp))
    }
}

/**
 * Individual OTP digit box with animated border color.
 * Matches the glassmorphism design of existing NextStepZTextField.
 */
@Composable
private fun OtpDigitBox(
    digit: String,
    isFocused: Boolean,
    isError: Boolean
) {
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

    Box(
        modifier = Modifier
            .size(64.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(InputBackground)
            .border(
                width = 1.5.dp,
                color = borderColor,
                shape = RoundedCornerShape(16.dp)
            ),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = digit,
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp
            ),
            color = if (digit.isNotEmpty()) TextPrimary else TextTertiary,
            textAlign = TextAlign.Center
        )

        // Show cursor indicator when focused and empty
        if (isFocused && digit.isEmpty()) {
            Box(
                modifier = Modifier
                    .width(2.dp)
                    .height(28.dp)
                    .background(
                        Brush.verticalGradient(
                            listOf(GradientStart, GradientMid)
                        )
                    )
            )
        }
    }
}
