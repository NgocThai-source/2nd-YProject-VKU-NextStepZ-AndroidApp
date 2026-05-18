package com.example.nextstepz.ui.screens.account

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TabRowDefaults.SecondaryIndicator
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.nextstepz.auth.data.local.TokenManager
import com.example.nextstepz.ui.components.GlassCard
import com.example.nextstepz.ui.components.GradientButton
import com.example.nextstepz.ui.components.NextStepZTextField
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.DarkCardBackground
import com.example.nextstepz.ui.theme.DarkSurface
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.SuccessGreen
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary

@Composable
fun PrivacyScreen(
    onNavigateBack: () -> Unit,
    viewModel: PrivacyViewModel = viewModel()
) {
    val context = LocalContext.current
    val tokenManager = remember { TokenManager(context) }
    val scrollState = rememberScrollState()

    var selectedTab by remember { mutableIntStateOf(0) }
    var passwordVisible by remember { mutableStateOf(false) }
    var newPasswordVisible by remember { mutableStateOf(false) }
    var confirmPasswordVisible by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        viewModel.updateCurrentEmail(tokenManager.userEmail ?: "")
    }

    val profileState = viewModel.profileState

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .systemBarsPadding()
            .verticalScroll(scrollState)
            .imePadding()
            .navigationBarsPadding()
            .padding(horizontal = 16.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(vertical = 8.dp)
        ) {
            IconButton(onClick = onNavigateBack) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Quay lại",
                    tint = TextPrimary
                )
            }
            Text(
                text = "Quyền riêng tư",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                color = TextPrimary
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        TabRow(
            selectedTabIndex = selectedTab,
            containerColor = DarkCardBackground,
            contentColor = TextPrimary,
            indicator = { tabPositions ->
                SecondaryIndicator(
                    modifier = Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                    color = GradientStart
                )
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Tab(
                selected = selectedTab == 0,
                onClick = { selectedTab = 0 },
                text = {
                    Text(
                        text = "Đổi Email",
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = if (selectedTab == 0) FontWeight.SemiBold else FontWeight.Normal
                    )
                },
                selectedContentColor = GradientStart,
                unselectedContentColor = TextSecondary
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = {
                    Text(
                        text = "Đổi mật khẩu",
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = if (selectedTab == 1) FontWeight.SemiBold else FontWeight.Normal
                    )
                },
                selectedContentColor = GradientStart,
                unselectedContentColor = TextSecondary
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        when (selectedTab) {
            0 -> EmailTab(viewModel, tokenManager, profileState)
            1 -> PasswordTab(viewModel, tokenManager, profileState, passwordVisible, newPasswordVisible, confirmPasswordVisible, {
                passwordVisible = !passwordVisible
            }, {
                newPasswordVisible = !newPasswordVisible
            }, {
                confirmPasswordVisible = !confirmPasswordVisible
            })
        }

        Spacer(modifier = Modifier.height(32.dp))
    }
}

@Composable
private fun EmailTab(
    viewModel: PrivacyViewModel = viewModel(),
    tokenManager: TokenManager,
    profileState: ProfileState
) {
    var showSuccess by remember { mutableStateOf(false) }

    LaunchedEffect(profileState) {
        if (profileState is ProfileState.Success && showSuccess) {
            showSuccess = true
        }
    }

    if (showSuccess || viewModel.showEmailSuccess) {
        showSuccess = true
        GlassCard {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Filled.CheckCircle,
                    contentDescription = null,
                    tint = SuccessGreen,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Cập nhật email thành công!",
                    style = MaterialTheme.typography.bodyMedium,
                    color = SuccessGreen
                )
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
    }

    GlassCard {
        Column {
            NextStepZTextField(
                value = viewModel.currentEmail,
                onValueChange = { },
                label = "Email hiện tại",
                placeholder = "",
                leadingIcon = Icons.Outlined.Email,
                singleLine = true
            )

            Spacer(modifier = Modifier.height(16.dp))

            NextStepZTextField(
                value = viewModel.newEmail,
                onValueChange = viewModel::updateNewEmail,
                label = "Email mới",
                placeholder = "email@example.com",
                leadingIcon = Icons.Outlined.Email,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                isError = viewModel.newEmailError != null,
                errorMessage = viewModel.newEmailError
            )

            Spacer(modifier = Modifier.height(16.dp))

            NextStepZTextField(
                value = viewModel.confirmEmail,
                onValueChange = viewModel::updateConfirmEmail,
                label = "Xác nhận email mới",
                placeholder = "Nhập lại email mới",
                leadingIcon = Icons.Outlined.Email,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                isError = viewModel.confirmEmailError != null,
                errorMessage = viewModel.confirmEmailError
            )

            Spacer(modifier = Modifier.height(24.dp))

            GradientButton(
                text = "Cập nhật Email",
                onClick = {
                    val userId = tokenManager.userId ?: ""
                    viewModel.submitEmailUpdate(userId)
                },
                isLoading = profileState is ProfileState.Loading,
                enabled = profileState !is ProfileState.Loading
            )

            if (profileState is ProfileState.Error) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = (profileState as ProfileState.Error).message,
                    style = MaterialTheme.typography.bodySmall,
                    color = ErrorRed,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}

@Composable
private fun PasswordTab(
    viewModel: PrivacyViewModel,
    tokenManager: TokenManager,
    profileState: ProfileState,
    passwordVisible: Boolean,
    newPasswordVisible: Boolean,
    confirmPasswordVisible: Boolean,
    togglePassword: () -> Unit,
    toggleNewPassword: () -> Unit,
    toggleConfirmPassword: () -> Unit
) {
    if (viewModel.showPasswordSuccess) {
        GlassCard {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Filled.CheckCircle,
                    contentDescription = null,
                    tint = SuccessGreen,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Cập nhật mật khẩu thành công!",
                    style = MaterialTheme.typography.bodyMedium,
                    color = SuccessGreen
                )
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
    }

    GlassCard {
        Column {
            NextStepZTextField(
                value = viewModel.currentPassword,
                onValueChange = viewModel::updateCurrentPassword,
                label = "Mật khẩu hiện tại",
                placeholder = "Nhập mật khẩu hiện tại",
                leadingIcon = Icons.Outlined.Lock,
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                trailingIcon = {
                    IconButton(onClick = togglePassword) {
                        Icon(
                            imageVector = if (passwordVisible) Icons.Filled.Visibility else Icons.Filled.VisibilityOff,
                            contentDescription = if (passwordVisible) "Ẩn mật khẩu" else "Hiện mật khẩu",
                            tint = TextSecondary
                        )
                    }
                },
                isError = viewModel.currentPasswordError != null,
                errorMessage = viewModel.currentPasswordError
            )

            Spacer(modifier = Modifier.height(16.dp))

            NextStepZTextField(
                value = viewModel.newPassword,
                onValueChange = viewModel::updateNewPassword,
                label = "Mật khẩu mới",
                placeholder = "Ít nhất 6 ký tự",
                leadingIcon = Icons.Outlined.Lock,
                visualTransformation = if (newPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                trailingIcon = {
                    IconButton(onClick = toggleNewPassword) {
                        Icon(
                            imageVector = if (newPasswordVisible) Icons.Filled.Visibility else Icons.Filled.VisibilityOff,
                            contentDescription = if (newPasswordVisible) "Ẩn mật khẩu" else "Hiện mật khẩu",
                            tint = TextSecondary
                        )
                    }
                },
                isError = viewModel.newPasswordError != null,
                errorMessage = viewModel.newPasswordError
            )

            Spacer(modifier = Modifier.height(16.dp))

            NextStepZTextField(
                value = viewModel.confirmPassword,
                onValueChange = viewModel::updateConfirmPassword,
                label = "Xác nhận mật khẩu mới",
                placeholder = "Nhập lại mật khẩu mới",
                leadingIcon = Icons.Outlined.Lock,
                visualTransformation = if (confirmPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                trailingIcon = {
                    IconButton(onClick = toggleConfirmPassword) {
                        Icon(
                            imageVector = if (confirmPasswordVisible) Icons.Filled.Visibility else Icons.Filled.VisibilityOff,
                            contentDescription = if (confirmPasswordVisible) "Ẩn mật khẩu" else "Hiện mật khẩu",
                            tint = TextSecondary
                        )
                    }
                },
                isError = viewModel.confirmPasswordError != null,
                errorMessage = viewModel.confirmPasswordError
            )

            Spacer(modifier = Modifier.height(24.dp))

            GradientButton(
                text = "Cập nhật mật khẩu",
                onClick = {
                    val userId = tokenManager.userId ?: ""
                    viewModel.submitPasswordUpdate(userId)
                },
                isLoading = profileState is ProfileState.Loading,
                enabled = profileState !is ProfileState.Loading
            )

            if (profileState is ProfileState.Error) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = (profileState as ProfileState.Error).message,
                    style = MaterialTheme.typography.bodySmall,
                    color = ErrorRed,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}
