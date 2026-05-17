package com.example.nextstepz.ui.screens.account

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
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
import androidx.compose.material.icons.outlined.CalendarToday
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Phone
import androidx.compose.material.icons.outlined.School
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
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
import com.example.nextstepz.ui.components.CityDropdown
import com.example.nextstepz.ui.components.GlassCard
import com.example.nextstepz.ui.components.GradientButton
import com.example.nextstepz.ui.components.NextStepZTextField
import com.example.nextstepz.ui.components.TermsContent
import com.example.nextstepz.ui.components.TermsDialog
import com.example.nextstepz.ui.components.UniversityDropdown
import com.example.nextstepz.ui.components.VietnamUniversities
import com.example.nextstepz.ui.components.YearDropdown
import com.example.nextstepz.ui.screens.auth.ProfileState
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.DarkSurface
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.SuccessGreen
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterStudentScreen(
    onNavigateBack: () -> Unit,
    onSuccess: () -> Unit,
    viewModel: RegisterStudentViewModel = viewModel()
) {
    val context = LocalContext.current
    val tokenManager = remember { TokenManager(context) }
    val scrollState = rememberScrollState()

    var showDatePicker by remember { mutableStateOf(false) }
    var showTermsDialog by remember { mutableStateOf(false) }
    var showSuccessDialog by remember { mutableStateOf(false) }
    var universities by remember { mutableStateOf(emptyList<String>()) }

    val profileState = viewModel.profileState

    LaunchedEffect(profileState) {
        if (profileState is ProfileState.Success) {
            showSuccessDialog = true
        }
    }

    val datePickerState = rememberDatePickerState()

    if (showDatePicker) {
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        datePickerState.selectedDateMillis?.let { millis ->
                            val sdf = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
                            viewModel.updateDateOfBirth(sdf.format(Date(millis)))
                        }
                        showDatePicker = false
                    }
                ) {
                    Text("Xác nhận")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDatePicker = false }) {
                    Text("Hủy")
                }
            }
        ) {
            DatePicker(state = datePickerState)
        }
    }

    if (showTermsDialog) {
        TermsDialog(
            title = "Nội quy dành cho Sinh viên",
            content = TermsContent.STUDENT,
            onDismiss = { showTermsDialog = false },
            onAccept = {
                viewModel.updateTermsAccepted(true)
                showTermsDialog = false
            }
        )
    }

    if (showSuccessDialog) {
        AlertDialog(
            onDismissRequest = { },
            confirmButton = {
                TextButton(
                    onClick = {
                        showSuccessDialog = false
                        onSuccess()
                    }
                ) {
                    Text("Đóng", color = SuccessGreen, fontWeight = FontWeight.SemiBold)
                }
            },
            title = {
                Text(
                    text = "Đăng ký thành công",
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            },
            text = {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Filled.CheckCircle,
                        contentDescription = null,
                        tint = SuccessGreen,
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Đăng ký vai trò Sinh viên thành công!",
                        color = TextSecondary,
                        textAlign = TextAlign.Center
                    )
                }
            },
            containerColor = DarkSurface,
            titleContentColor = TextPrimary,
            textContentColor = TextSecondary
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
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
                    text = "Đăng ký Sinh viên",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                    color = TextPrimary
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            GlassCard {
                Column {
                    Text(
                        text = "Thông tin cá nhân",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    NextStepZTextField(
                        value = viewModel.fullName,
                        onValueChange = viewModel::updateFullName,
                        label = "Họ và tên",
                        placeholder = "Nguyễn Văn A",
                        leadingIcon = Icons.Outlined.Person,
                        isError = viewModel.fullNameError != null,
                        errorMessage = viewModel.fullNameError
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    NextStepZTextField(
                        value = viewModel.dateOfBirth,
                        onValueChange = { },
                        label = "Ngày tháng năm sinh",
                        placeholder = "DD/MM/YYYY",
                        leadingIcon = Icons.Outlined.CalendarToday,
                        isError = viewModel.dateOfBirthError != null,
                        errorMessage = viewModel.dateOfBirthError,
                        modifier = Modifier.clickable { showDatePicker = true }
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    NextStepZTextField(
                        value = viewModel.phone,
                        onValueChange = viewModel::updatePhone,
                        label = "Số điện thoại liên hệ",
                        placeholder = "0912345678",
                        leadingIcon = Icons.Outlined.Phone,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                        isError = viewModel.phoneError != null,
                        errorMessage = viewModel.phoneError
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    NextStepZTextField(
                        value = viewModel.email,
                        onValueChange = viewModel::updateEmail,
                        label = "Email liên hệ",
                        placeholder = "email@example.com",
                        leadingIcon = Icons.Outlined.Email,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                        isError = viewModel.emailError != null,
                        errorMessage = viewModel.emailError
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            GlassCard {
                Column {
                    Text(
                        text = "Thông tin học tập",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    CityDropdown(
                        selectedProvince = viewModel.province,
                        onProvinceSelected = {
                            viewModel.updateProvince(it)
                            universities = VietnamUniversities.getUniversitiesByProvince(it)
                        },
                        isError = viewModel.provinceError != null,
                        errorMessage = viewModel.provinceError
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    UniversityDropdown(
                        selectedUniversity = viewModel.university,
                        universities = universities,
                        onUniversitySelected = viewModel::updateUniversity,
                        isError = viewModel.universityError != null,
                        errorMessage = viewModel.universityError
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    NextStepZTextField(
                        value = viewModel.major,
                        onValueChange = viewModel::updateMajor,
                        label = "Chuyên ngành đang học",
                        placeholder = "Công nghệ thông tin",
                        leadingIcon = Icons.Outlined.School,
                        isError = viewModel.majorError != null,
                        errorMessage = viewModel.majorError
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    NextStepZTextField(
                        value = viewModel.graduationYear,
                        onValueChange = viewModel::updateGraduationYear,
                        label = "Năm tốt nghiệp (dự kiến)",
                        placeholder = "VD: 2026",
                        leadingIcon = Icons.Outlined.CalendarToday,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        isError = viewModel.graduationYearError != null,
                        errorMessage = viewModel.graduationYearError
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    NextStepZTextField(
                        value = viewModel.gpa,
                        onValueChange = {
                            val filtered = it.filter { c -> c.isDigit() || c == '.' }
                            if (filtered.count { c -> c == '.' } <= 1) {
                                viewModel.updateGpa(filtered)
                            }
                        },
                        label = "GPA tích lũy",
                        placeholder = "3.50",
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        isError = viewModel.gpaError != null,
                        errorMessage = viewModel.gpaError
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            GlassCard {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = viewModel.termsAccepted,
                            onCheckedChange = {
                                if (!it) {
                                    viewModel.updateTermsAccepted(false)
                                }
                                showTermsDialog = true
                            },
                            colors = CheckboxDefaults.colors(
                                checkedColor = GradientStart,
                                uncheckedColor = TextSecondary
                            )
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Chấp nhận",
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextSecondary
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "nội quy, quy chế, cơ chế dành cho sinh viên",
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Medium),
                            color = GradientStart,
                            modifier = Modifier.clickable { showTermsDialog = true }
                        )
                    }

                    if (!viewModel.termsAccepted && profileState is ProfileState.Error) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Bạn cần chấp nhận nội quy để tiếp tục",
                            style = MaterialTheme.typography.bodySmall,
                            color = ErrorRed
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            GradientButton(
                text = "Đăng ký Sinh viên",
                onClick = {
                    val userId = tokenManager.userId ?: ""
                    viewModel.submit(userId)
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

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}
