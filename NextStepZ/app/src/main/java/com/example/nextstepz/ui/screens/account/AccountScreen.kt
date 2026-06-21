package com.example.nextstepz.ui.screens.account

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Business
import androidx.compose.material.icons.outlined.School
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.nextstepz.auth.data.local.TokenManager
import com.example.nextstepz.auth.data.model.EmployerProfileUi
import com.example.nextstepz.auth.data.model.StudentProfileUi
import com.example.nextstepz.auth.data.model.UserRole
import com.example.nextstepz.ui.components.AnimatedGradientBackground
import com.example.nextstepz.ui.components.GlassCard
import com.example.nextstepz.ui.components.GradientButton
import com.example.nextstepz.ui.components.ProfileHeader
import com.example.nextstepz.ui.components.ProfileMenuItem
import com.example.nextstepz.ui.components.ProfileMenuType
import com.example.nextstepz.posthistory.ui.PostHistoryScreen
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.DarkSurface
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary

object AccountNavRoutes {
    const val MAIN = "account_main"
    const val REGISTER_STUDENT = "register_student"
    const val REGISTER_EMPLOYER = "register_employer"
    const val PRIVACY = "privacy"
    const val FAVORITES = "favorites"
    const val POST_HISTORY = "post_history"
}
@Composable
fun AccountScreen(
    onLogout: () -> Unit = {},
    currentRole: UserRole = UserRole.GUEST,
    onRoleUpdated: (UserRole) -> Unit = {},
    navController: NavHostController = rememberNavController(),
    viewModel: AccountViewModel = viewModel()
) {

    val context = LocalContext.current
    val tokenManager = remember { TokenManager(context) }
    LaunchedEffect(Unit) {
        viewModel.loadUserData(tokenManager)
    }

    NavHost(
        navController = navController,
        startDestination = AccountNavRoutes.MAIN
    ) {
        composable(AccountNavRoutes.MAIN) {
            AccountMainContent(
                viewModel = viewModel,
                tokenManager = tokenManager,
                onNavigateToPrivacy = {
                    navController.navigate(AccountNavRoutes.PRIVACY)
                },
                onNavigateToFavorites = {
                    navController.navigate(AccountNavRoutes.FAVORITES)
                },
                onNavigateToPostHistory = {
                    navController.navigate(AccountNavRoutes.POST_HISTORY)
                },
                onNavigateToRegisterStudent = {
                    navController.navigate(AccountNavRoutes.REGISTER_STUDENT)
                },
                onNavigateToRegisterEmployer = {
                    navController.navigate(AccountNavRoutes.REGISTER_EMPLOYER)
                },
                onLogout = {
                    tokenManager.clearAll()
                    onLogout()
                }
            )
        }

        composable(AccountNavRoutes.REGISTER_STUDENT) {
            RegisterStudentScreen(
                onNavigateBack = { navController.popBackStack() },
                onSuccess = { profile ->
                    viewModel.updateAfterStudentRegistration(
                        profile = profile,
                        tokenManager = tokenManager
                    )
                    navController.popBackStack()
                }
            )
        }

        composable(AccountNavRoutes.REGISTER_EMPLOYER) {
            RegisterEmployerScreen(
                onNavigateBack = { navController.popBackStack() },
                onSuccess = { profile ->
                    viewModel.updateAfterEmployerRegistration(
                        profile = profile,
                        tokenManager = tokenManager
                    )
                    navController.popBackStack()
                }
            )
        }

        composable(AccountNavRoutes.PRIVACY) {
            PrivacyScreen(
                onNavigateBack = { viewModel.loadUserData(tokenManager)
                                    navController.popBackStack() }
            )
        }

        composable(AccountNavRoutes.FAVORITES) {
            FavoritesScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(AccountNavRoutes.POST_HISTORY) {
            PostHistoryScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}

@Composable
private fun AccountMainContent(
    viewModel: AccountViewModel,
    tokenManager: TokenManager,
    onNavigateToRegisterStudent: () -> Unit,
    onNavigateToRegisterEmployer: () -> Unit,
    onNavigateToPrivacy: () -> Unit,
    onNavigateToFavorites: () -> Unit,
    onNavigateToPostHistory: () -> Unit,
    onLogout: () -> Unit
) {
    val scrollState = rememberScrollState()
    var showRoleDialog by remember { mutableStateOf(false) }
    val context = LocalContext.current
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
    ) {
        AnimatedGradientBackground()

        Column(
            modifier = Modifier
                .fillMaxSize()
                .systemBarsPadding()
                .verticalScroll(scrollState)
                .padding(horizontal = 16.dp)
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Tài khoản",
                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
                color = TextPrimary
            )

            Spacer(modifier = Modifier.height(24.dp))

            ProfileHeader(
                name = viewModel.userName,
                email = viewModel.userEmail,
                phone = viewModel.userPhone,
                roleDisplayName = viewModel.userRole.displayName,
                isVerified = viewModel.isVerified
            )

            Spacer(modifier = Modifier.height(16.dp))

            when (viewModel.userRole) {
                UserRole.STUDENT -> {
                    viewModel.studentProfile?.let { profile ->
                        StudentInfoCard(profile = profile)
                        Spacer(modifier = Modifier.height(16.dp))
                    }
                }

                UserRole.EMPLOYER -> {
                    viewModel.employerProfile?.let { profile ->
                        EmployerInfoCard(profile = profile)
                        Spacer(modifier = Modifier.height(16.dp))
                    }
                }

                UserRole.GUEST -> Unit
            }

            Spacer(modifier = Modifier.height(24.dp))

            ProfileMenuItem(
                type = ProfileMenuType.Register,
                onClick = {
                    if(viewModel.userRole != UserRole.GUEST) {
                        Toast.makeText(context, "Bạn đã đăng ký vai trò rồi!", Toast.LENGTH_SHORT).show()
                    } else {
                        showRoleDialog = true
                    }
                }
            )

            Spacer(modifier = Modifier.height(12.dp))

            ProfileMenuItem(
                type = ProfileMenuType.Privacy,
                onClick = onNavigateToPrivacy
            )

            Spacer(modifier = Modifier.height(12.dp))

            ProfileMenuItem(
                type = ProfileMenuType.Favorites,
                onClick = onNavigateToFavorites
            )

            Spacer(modifier = Modifier.height(12.dp))

            ProfileMenuItem(
                type = ProfileMenuType.PostHistory,
                onClick = onNavigateToPostHistory
            )

            Spacer(modifier = Modifier.height(12.dp))

            ProfileMenuItem(
                type = ProfileMenuType.Logout,
                onClick = { viewModel.openLogoutDialog() }
            )

            Spacer(modifier = Modifier.height(32.dp))
        }

        if (showRoleDialog) {
            RoleSelectionDialog(
                currentRole = viewModel.userRole,
                onDismiss = { showRoleDialog = false },
                onSelectStudent = {
                    showRoleDialog = false
                    onNavigateToRegisterStudent()
                },
                onSelectEmployer = {
                    showRoleDialog = false
                    onNavigateToRegisterEmployer()
                }
            )
        }

        if (viewModel.showLogoutDialog) {
            AlertDialog(
                onDismissRequest = { viewModel.dismissLogoutDialog() },
                title = {
                    Text(
                        text = "Đăng xuất",
                        color = TextPrimary,
                        fontWeight = FontWeight.SemiBold
                    )
                },
                text = {
                    Text(
                        text = "Bạn có chắc chắn muốn đăng xuất khỏi NextStepZ?",
                        color = TextSecondary
                    )
                },
                confirmButton = {
                    TextButton(
                        onClick = {
                            viewModel.dismissLogoutDialog()
                            onLogout()
                        }
                    ) {
                        Text("Đăng xuất", color = ErrorRed, fontWeight = FontWeight.SemiBold)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { viewModel.dismissLogoutDialog() }) {
                        Text("Hủy", color = TextSecondary)
                    }
                },
                containerColor = DarkSurface,
                titleContentColor = TextPrimary,
                textContentColor = TextSecondary
            )
        }
    }
}

@Composable
private fun StudentInfoCard(profile: StudentProfileUi) {
    GlassCard {
        Column {
            Text(
                text = "Thông tin sinh viên",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                color = TextPrimary
            )

            Spacer(modifier = Modifier.height(12.dp))

            InfoRow(label = "Họ tên", value = profile.fullName)
            InfoRow(label = "Ngày sinh", value = profile.dob)
            InfoRow(label = "Email", value = profile.email)
            InfoRow(label = "Số điện thoại", value = profile.phone)
            InfoRow(label = "Tỉnh / Thành phố", value = profile.provinceName)
            InfoRow(label = "Trường", value = profile.universityName)
            InfoRow(label = "Chuyên ngành", value = profile.major)
            InfoRow(label = "Năm tốt nghiệp", value = profile.graduationYear)
            InfoRow(label = "GPA", value = profile.gpa)
        }
    }
}

@Composable
private fun EmployerInfoCard(profile: EmployerProfileUi) {
    GlassCard {
        Column {
            Text(
                text = "Thông tin nhà tuyển dụng",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                color = TextPrimary
            )

            Spacer(modifier = Modifier.height(12.dp))

            InfoRow(label = "Tên công ty", value = profile.companyName)
            InfoRow(label = "Địa chỉ", value = profile.companyAddress)
            InfoRow(label = "Người tuyển dụng", value = profile.employerName)
            InfoRow(label = "Email", value = profile.email)
            InfoRow(label = "Số điện thoại", value = profile.phone)
            InfoRow(label = "Mã số thuế", value = profile.taxCode)
            InfoRow(label = "Lĩnh vực", value = profile.industry)
        }
    }
}

@Composable
private fun InfoRow(
    label: String,
    value: String
) {
    if (value.isBlank()) return

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        Text(
            text = "$label:",
            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Medium),
            color = TextSecondary,
            modifier = Modifier.weight(0.42f)
        )

        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            color = TextPrimary,
            modifier = Modifier.weight(0.58f)
        )
    }
}

@Composable
private fun RoleSelectionDialog(
    currentRole: UserRole,
    onDismiss: () -> Unit,
    onSelectStudent: () -> Unit,
    onSelectEmployer: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = "Chọn vai trò đăng ký",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                color = TextPrimary,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
        },
        text = {
            Column {
                Text(
                    text = "Bạn muốn đăng ký với vai trò nào?",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary,
                    modifier = Modifier.padding(bottom = 20.dp)
                )

                RoleOptionCard(
                    title = "Sinh viên",
                    description = "Ứng tuyển việc làm, xem hồ sơ nhà tuyển dụng",
                    icon = Icons.Outlined.School,
                    isEnabled = currentRole == UserRole.GUEST || currentRole == UserRole.STUDENT,
                    onClick = onSelectStudent
                )

                Spacer(modifier = Modifier.height(12.dp))

                RoleOptionCard(
                    title = "Nhà tuyển dụng",
                    description = "Đăng tin tuyển dụng, xem hồ sơ sinh viên",
                    icon = Icons.Outlined.Business,
                    isEnabled = true,
                    onClick = onSelectEmployer
                )
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("Hủy", color = TextSecondary)
            }
        },
        containerColor = DarkSurface,
        titleContentColor = TextPrimary,
        textContentColor = TextSecondary
    )
}

@Composable
private fun RoleOptionCard(
    title: String,
    description: String,
    icon: ImageVector,
    isEnabled: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(if (isEnabled) GlassWhite else DarkSurface)
            .border(
                width = 1.dp,
                color = if (isEnabled) GlassBorder else DarkSurface,
                shape = RoundedCornerShape(16.dp)
            )
            .clickable(enabled = isEnabled, onClick = onClick)
            .padding(16.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                modifier = Modifier.size(40.dp),
                tint = if (isEnabled) GradientStart else TextSecondary.copy(alpha = 0.5f)
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                    color = if (isEnabled) TextPrimary else TextSecondary.copy(alpha = 0.5f)
                )
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall,
                    color = if (isEnabled) TextSecondary else TextSecondary.copy(alpha = 0.3f)
                )
            }
            if (!isEnabled) {
                Text(
                    text = "Đã đăng ký",
                    style = MaterialTheme.typography.labelSmall,
                    color = GradientStart
                )
            }
        }
    }
}

@Composable
private fun Modifier.border(
    width: androidx.compose.ui.unit.Dp,
    color: androidx.compose.ui.graphics.Color,
    shape: androidx.compose.ui.graphics.Shape
): Modifier = this.then(
    Modifier.drawBorder(width, color, shape)
)

@Composable
private fun Modifier.drawBorder(
    width: androidx.compose.ui.unit.Dp,
    color: androidx.compose.ui.graphics.Color,
    shape: androidx.compose.ui.graphics.Shape
): Modifier = this.then(
    Modifier.background(
        color = color.copy(alpha = 0.2f),
        shape = shape
    )
)
