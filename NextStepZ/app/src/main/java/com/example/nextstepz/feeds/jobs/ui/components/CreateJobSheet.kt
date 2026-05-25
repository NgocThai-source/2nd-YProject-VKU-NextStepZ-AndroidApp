package com.example.nextstepz.feeds.jobs.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccessTime
import androidx.compose.material.icons.outlined.AttachMoney
import androidx.compose.material.icons.outlined.Business
import androidx.compose.material.icons.outlined.CardGiftcard
import androidx.compose.material.icons.outlined.Close
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.Language
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material.icons.outlined.WorkOutline
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.nextstepz.feeds.jobs.data.model.ExperienceLevel
import com.example.nextstepz.feeds.jobs.data.model.JobType
import com.example.nextstepz.ui.components.GradientButton
import com.example.nextstepz.ui.theme.DarkBackground
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.InputBackground
import com.example.nextstepz.ui.theme.InputPlaceholder
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary

@Composable
fun CreateJobSheet(
    onDismiss: () -> Unit,
    onPost: (
        title: String,
        companyName: String,
        companyAddress: String,
        location: String,
        salaryMin: Int?,
        salaryMax: Int?,
        jobType: JobType,
        experienceLevel: ExperienceLevel,
        description: String,
        requirements: List<String>,
        benefits: List<String>,
        skills: List<String>,
        deadline: String,
        companyWebsite: String?
    ) -> Unit,
    modifier: Modifier = Modifier
) {
    var title by remember { mutableStateOf("") }
    var companyName by remember { mutableStateOf("") }
    var companyAddress by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var salaryMin by remember { mutableStateOf("") }
    var salaryMax by remember { mutableStateOf("") }
    var selectedJobType by remember { mutableStateOf(JobType.FullTime) }
    var selectedExpLevel by remember { mutableStateOf(ExperienceLevel.Fresher) }
    var description by remember { mutableStateOf("") }
    var requirementsText by remember { mutableStateOf("") }
    var benefitsText by remember { mutableStateOf("") }
    var skillsText by remember { mutableStateOf("") }
    var deadline by remember { mutableStateOf("") }
    var companyWebsite by remember { mutableStateOf("") }

    var showJobTypeMenu by remember { mutableStateOf(false) }
    var showExpMenu by remember { mutableStateOf(false) }

    val scrollState = rememberScrollState()

    val isValid = title.isNotBlank() && companyName.isNotBlank() &&
            location.isNotBlank() && description.isNotBlank()

    Surface(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
        color = DarkBackground
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .windowInsetsPadding(WindowInsets.navigationBars)
                .padding(24.dp)
                .verticalScroll(scrollState)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .width(40.dp)
                        .height(4.dp)
                        .clip(RoundedCornerShape(2.dp))
                        .background(GlassBorder)
                )

                Text(
                    text = "Đăng tin tuyển dụng",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = TextPrimary
                )

                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Close,
                        contentDescription = "Đóng",
                        tint = TextSecondary,
                        modifier = Modifier.size(22.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            FormTextField(
                value = title,
                onValueChange = { title = it },
                label = "Tiêu đề công việc",
                placeholder = "VD: Fresher Java Developer",
                icon = Icons.Outlined.WorkOutline
            )

            Spacer(modifier = Modifier.height(12.dp))

            FormTextField(
                value = companyName,
                onValueChange = { companyName = it },
                label = "Tên công ty",
                placeholder = "VD: FPT Software",
                icon = Icons.Outlined.Business
            )

            Spacer(modifier = Modifier.height(12.dp))

            FormTextField(
                value = companyAddress,
                onValueChange = { companyAddress = it },
                label = "Địa chỉ công ty",
                placeholder = "VD: Tòa nhà FPT Complex, Đà Nẵng",
                icon = Icons.Outlined.Business
            )

            Spacer(modifier = Modifier.height(12.dp))

            FormTextField(
                value = location,
                onValueChange = { location = it },
                label = "Địa điểm làm việc",
                placeholder = "VD: Đà Nẵng, Remote, TP. Hồ Chí Minh",
                icon = Icons.Outlined.LocationOn
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FormTextField(
                    value = salaryMin,
                    onValueChange = { salaryMin = it.filter { c -> c.isDigit() } },
                    label = "Lương tối thiểu (triệu)",
                    placeholder = "VD: 8",
                    icon = Icons.Outlined.AttachMoney,
                    modifier = Modifier.weight(1f)
                )
                FormTextField(
                    value = salaryMax,
                    onValueChange = { salaryMax = it.filter { c -> c.isDigit() } },
                    label = "Lương tối đa (triệu)",
                    placeholder = "VD: 15",
                    icon = Icons.Outlined.AttachMoney,
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Box(modifier = Modifier.weight(1f)) {
                    LabelText("Loại công việc")
                    Spacer(modifier = Modifier.height(6.dp))
                    Box {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(InputBackground)
                                .border(1.dp, GlassBorder, RoundedCornerShape(12.dp))
                                .clickable { showJobTypeMenu = true }
                                .padding(horizontal = 14.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = selectedJobType.label,
                                style = MaterialTheme.typography.bodyMedium,
                                color = TextPrimary,
                                modifier = Modifier.weight(1f)
                            )
                            Icon(
                                imageVector = Icons.Outlined.Schedule,
                                contentDescription = null,
                                tint = TextSecondary,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        DropdownMenu(
                            expanded = showJobTypeMenu,
                            onDismissRequest = { showJobTypeMenu = false },
                            modifier = Modifier.background(DarkSurfaceForDropdown)
                        ) {
                            JobType.entries.forEach { type ->
                                DropdownMenuItem(
                                    text = {
                                        Text(
                                            text = type.label,
                                            color = if (type == selectedJobType) GradientMid else TextPrimary
                                        )
                                    },
                                    onClick = {
                                        selectedJobType = type
                                        showJobTypeMenu = false
                                    }
                                )
                            }
                        }
                    }
                }

                Box(modifier = Modifier.weight(1f)) {
                    LabelText("Cấp bậc")
                    Spacer(modifier = Modifier.height(6.dp))
                    Box {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(InputBackground)
                                .border(1.dp, GlassBorder, RoundedCornerShape(12.dp))
                                .clickable { showExpMenu = true }
                                .padding(horizontal = 14.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = selectedExpLevel.label,
                                style = MaterialTheme.typography.bodyMedium,
                                color = TextPrimary,
                                modifier = Modifier.weight(1f)
                            )
                            Icon(
                                imageVector = Icons.Outlined.Star,
                                contentDescription = null,
                                tint = TextSecondary,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        DropdownMenu(
                            expanded = showExpMenu,
                            onDismissRequest = { showExpMenu = false },
                            modifier = Modifier.background(DarkBackground)
                        ) {
                            ExperienceLevel.entries.forEach { level ->
                                DropdownMenuItem(
                                    text = {
                                        Text(
                                            text = level.label,
                                            color = if (level == selectedExpLevel) GradientMid else TextPrimary
                                        )
                                    },
                                    onClick = {
                                        selectedExpLevel = level
                                        showExpMenu = false
                                    }
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            FormTextField(
                value = description,
                onValueChange = { description = it },
                label = "Mô tả công việc",
                placeholder = "Mô tả chi tiết công việc, môi trường làm việc...",
                icon = Icons.Outlined.Description,
                singleLine = false,
                minHeight = 100.dp
            )

            Spacer(modifier = Modifier.height(12.dp))

            FormTextField(
                value = requirementsText,
                onValueChange = { requirementsText = it },
                label = "Yêu cầu (mỗi dòng 1 item)",
                placeholder = "Tốt nghiệp CNTT\nBiết Java Core, OOP\nSử dụng được Git",
                icon = Icons.Outlined.Description,
                singleLine = false,
                minHeight = 80.dp
            )

            Spacer(modifier = Modifier.height(12.dp))

            FormTextField(
                value = benefitsText,
                onValueChange = { benefitsText = it },
                label = "Quyền lợi (mỗi dòng 1 item)",
                placeholder = "Lương cạnh tranh\nBHXH, BHYT\n14 ngày phép/năm",
                icon = Icons.Outlined.CardGiftcard,
                singleLine = false,
                minHeight = 80.dp
            )

            Spacer(modifier = Modifier.height(12.dp))

            FormTextField(
                value = skillsText,
                onValueChange = { skillsText = it },
                label = "Kỹ năng (cách nhau bởi dấu phẩy)",
                placeholder = "VD: Java, Spring Boot, MySQL, Git, Agile",
                icon = Icons.Outlined.Star
            )

            Spacer(modifier = Modifier.height(12.dp))

            FormTextField(
                value = deadline,
                onValueChange = { deadline = it },
                label = "Hạn nộp (YYYY-MM-DD)",
                placeholder = "VD: 2026-06-30",
                icon = Icons.Outlined.AccessTime
            )

            Spacer(modifier = Modifier.height(12.dp))

            FormTextField(
                value = companyWebsite,
                onValueChange = { companyWebsite = it },
                label = "Website công ty",
                placeholder = "VD: https://company.com.vn",
                icon = Icons.Outlined.Language
            )

            Spacer(modifier = Modifier.height(20.dp))

            GradientButton(
                text = "Đăng tin tuyển dụng",
                onClick = {
                    val requirements = requirementsText.split("\n")
                        .map { it.trim() }
                        .filter { it.isNotEmpty() }
                    val benefits = benefitsText.split("\n")
                        .map { it.trim() }
                        .filter { it.isNotEmpty() }
                    val skills = skillsText.split(",")
                        .map { it.trim() }
                        .filter { it.isNotEmpty() }
                    val website = if (companyWebsite.isNotBlank()) companyWebsite.trim() else null
                    onPost(
                        title, companyName, companyAddress, location,
                        salaryMin.toIntOrNull(), salaryMax.toIntOrNull(),
                        selectedJobType, selectedExpLevel,
                        description, requirements, benefits, skills,
                        deadline, website
                    )
                },
                enabled = isValid
            )

            Spacer(modifier = Modifier.height(8.dp))
        }
    }
}

@Composable
private fun LabelText(text: String) {
    Text(
        text = text,
        style = MaterialTheme.typography.labelMedium,
        color = TextSecondary
    )
}

@Composable
private fun FormTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    placeholder: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    modifier: Modifier = Modifier,
    singleLine: Boolean = true,
    minHeight: androidx.compose.ui.unit.Dp = 0.dp
) {
    Column(modifier = modifier) {
        LabelText(label)
        Spacer(modifier = Modifier.height(6.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .then(if (minHeight > 0.dp) Modifier.height(minHeight) else Modifier)
                .clip(RoundedCornerShape(12.dp))
                .background(InputBackground)
                .border(1.dp, GlassBorder, RoundedCornerShape(12.dp))
                .padding(horizontal = 14.dp, vertical = 12.dp)
        ) {
            Row(verticalAlignment = Alignment.Top) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = TextSecondary.copy(alpha = 0.6f),
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                BasicTextField(
                    value = value,
                    onValueChange = onValueChange,
                    modifier = Modifier.weight(1f),
                    textStyle = MaterialTheme.typography.bodyMedium.copy(color = TextPrimary),
                    cursorBrush = SolidColor(GradientMid),
                    singleLine = singleLine,
                    decorationBox = { innerTextField ->
                        Box {
                            if (value.isEmpty()) {
                                Text(
                                    text = placeholder,
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = InputPlaceholder
                                )
                            }
                            innerTextField()
                        }
                    }
                )
            }
        }
    }
}

private val DarkSurfaceForDropdown = androidx.compose.ui.graphics.Color(0xFF111827)
