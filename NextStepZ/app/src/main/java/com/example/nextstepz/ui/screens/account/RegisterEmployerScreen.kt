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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.outlined.Business
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Phone
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.nextstepz.auth.data.local.TokenManager
import com.example.nextstepz.ui.components.GlassCard
import com.example.nextstepz.ui.components.GradientButton
import com.example.nextstepz.ui.components.NextStepZTextField
import com.example.nextstepz.ui.components.TermsContent
import com.example.nextstepz.ui.components.TermsDialog
import com.example.nextstepz.ui.screens.auth.ProfileState
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.DarkSurface
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.InfoBlue
import com.example.nextstepz.ui.theme.InputBackground
import com.example.nextstepz.ui.theme.InputBorder
import com.example.nextstepz.ui.theme.InputPlaceholder
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary

@Composable
fun RegisterEmployerScreen(
    onNavigateBack: () -> Unit,
    onSuccess: () -> Unit,
    viewModel: RegisterEmployerViewModel = viewModel()
) {
    val context = LocalContext.current
    val tokenManager = remember { TokenManager(context) }
    val scrollState = rememberScrollState()

    var showTermsDialog by remember { mutableStateOf(false) }
    var showSuccessDialog by remember { mutableStateOf(false) }
    var fieldExpanded by remember { mutableStateOf(false) }

    val profileState = viewModel.profileState

    LaunchedEffect(profileState) {
        if (profileState is ProfileState.Success) {
            showSuccessDialog = true
        }
    }

    if (showTermsDialog) {
        TermsDialog(
            title = "Nội quy dành cho Nhà tuyển dụng",
            content = TermsContent.EMPLOYER,
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
                    Text("Đóng", color = InfoBlue, fontWeight = FontWeight.SemiBold)
                }
            },
            title = {
                Text(
                    text = "Đã gửi đăng ký",
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            },
            text = {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Filled.AccessTime,
                        contentDescription = null,
                        tint = InfoBlue,
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Đã gửi form đăng ký đến Admin chờ xét duyệt.\nBạn sẽ nhận thông báo qua email khi được phê duyệt.",
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
                text = "Đăng ký Nhà tuyển dụng",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                color = TextPrimary
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        GlassCard {
            Column {
                Text(
                    text = "Thông tin công ty",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(16.dp))

                NextStepZTextField(
                    value = viewModel.companyName,
                    onValueChange = viewModel::updateCompanyName,
                    label = "Tên công ty",
                    placeholder = "Công ty ABC",
                    leadingIcon = Icons.Outlined.Business,
                    isError = viewModel.companyNameError != null,
                    errorMessage = viewModel.companyNameError
                )

                Spacer(modifier = Modifier.height(16.dp))

                NextStepZTextField(
                    value = viewModel.companyAddress,
                    onValueChange = viewModel::updateCompanyAddress,
                    label = "Địa chỉ công ty",
                    placeholder = "123 Đường ABC, Quận 1, TP.HCM",
                    leadingIcon = Icons.Outlined.LocationOn,
                    isError = viewModel.companyAddressError != null,
                    errorMessage = viewModel.companyAddressError
                )

                Spacer(modifier = Modifier.height(16.dp))

                NextStepZTextField(
                    value = viewModel.taxCode,
                    onValueChange = {
                        viewModel.updateTaxCode(it.filter { c -> c.isDigit() })
                    },
                    label = "Mã số thuế",
                    placeholder = "0123456789",
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    isError = viewModel.taxCodeError != null,
                    errorMessage = viewModel.taxCodeError
                )

                Spacer(modifier = Modifier.height(16.dp))

                FieldDropdown(
                    selectedField = viewModel.field,
                    fields = viewModel.getBusinessFields(),
                    onFieldSelected = viewModel::updateField,
                    isError = viewModel.fieldError != null,
                    errorMessage = viewModel.fieldError
                )

                if (viewModel.field == "Khác") {
                    Spacer(modifier = Modifier.height(16.dp))
                    NextStepZTextField(
                        value = viewModel.customField,
                        onValueChange = viewModel::updateCustomField,
                        label = "Lĩnh vực hoạt động (Khác)",
                        placeholder = "Nhập lĩnh vực hoạt động",
                        isError = viewModel.fieldError != null,
                        errorMessage = viewModel.fieldError
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        GlassCard {
            Column {
                Text(
                    text = "Thông tin người tuyển dụng",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(16.dp))

                NextStepZTextField(
                    value = viewModel.recruiterName,
                    onValueChange = viewModel::updateRecruiterName,
                    label = "Tên người tuyển dụng",
                    placeholder = "Nguyễn Văn B",
                    leadingIcon = Icons.Outlined.Person,
                    isError = viewModel.recruiterNameError != null,
                    errorMessage = viewModel.recruiterNameError
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
                    placeholder = "hr@company.com",
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
                        text = "nội quy, quy chế, cơ chế dành cho nhà tuyển dụng",
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
            text = "Gửi đăng ký Nhà tuyển dụng",
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

@Composable
private fun FieldDropdown(
    selectedField: String,
    fields: List<String>,
    onFieldSelected: (String) -> Unit,
    isError: Boolean,
    errorMessage: String?,
    modifier: Modifier = Modifier
) {
    var expanded by remember { mutableStateOf(false) }

    Column(modifier = modifier.fillMaxWidth()) {
        Text(
            text = "Lĩnh vực hoạt động",
            style = MaterialTheme.typography.labelLarge,
            color = TextPrimary,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Box {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(InputBackground)
                    .clickable { expanded = true }
                    .padding(horizontal = 16.dp, vertical = 16.dp)
            ) {
                Text(
                    text = selectedField.ifBlank { "Chọn lĩnh vực hoạt động" },
                    style = MaterialTheme.typography.bodyLarge,
                    color = if (selectedField.isBlank()) InputPlaceholder else TextPrimary
                )
            }

            Icon(
                imageVector = Icons.Filled.KeyboardArrowDown,
                contentDescription = null,
                tint = InputPlaceholder,
                modifier = Modifier.padding(16.dp)
            )

            DropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false },
                modifier = Modifier.background(InputBackground)
            ) {
                fields.forEach { field ->
                    DropdownMenuItem(
                        text = {
                            Text(
                                text = field,
                                color = if (field == selectedField) MaterialTheme.colorScheme.primary else TextPrimary
                            )
                        },
                        onClick = {
                            onFieldSelected(field)
                            expanded = false
                        }
                    )
                }
            }
        }

        if (isError && errorMessage != null) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = errorMessage,
                style = MaterialTheme.typography.bodySmall,
                color = ErrorRed,
                modifier = Modifier.padding(start = 4.dp)
            )
        }
    }
}
