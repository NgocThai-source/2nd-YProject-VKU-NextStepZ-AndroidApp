package com.example.nextstepz.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.example.nextstepz.ui.theme.InputBackground
import com.example.nextstepz.ui.theme.InputBorder
import com.example.nextstepz.ui.theme.InputBorderFocused
import com.example.nextstepz.ui.theme.InputPlaceholder
import com.example.nextstepz.ui.theme.TextPrimary

data class University(
    val name: String,
    val province: String
)

object VietnamUniversities {
    val universities = listOf(
        University("Đại học Bách khoa Hà Nội", "Hà Nội"),
        University("Đại học Quốc gia Hà Nội", "Hà Nội"),
        University("Đại học Ngoại thương", "Hà Nội"),
        University("Đại học Kinh tế Quốc dân", "Hà Nội"),
        University("Đại học Luật Hà Nội", "Hà Nội"),
        University("Đại học Y Hà Nội", "Hà Nội"),
        University("Đại học FPT", "Hà Nội"),
        University("Học viện Tài chính", "Hà Nội"),
        University("Học viện Ngân hàng", "Hà Nội"),
        University("Đại học Thương mại", "Hà Nội"),
        University("Đại học Sư phạm Hà Nội", "Hà Nội"),
        University("Đại học Công nghệ Giao thông Vận tải", "Hà Nội"),
        University("Đại học Kiến trúc Hà Nội", "Hà Nội"),
        University("Học viện Bưu chính Viễn thông", "Hà Nội"),
        University("Đại học Mở Hà Nội", "Hà Nội"),
        University("Đại học KHTN - ĐHQG HCM", "TP. Hồ Chí Minh"),
        University("Đại học BK - ĐHQG HCM", "TP. Hồ Chí Minh"),
        University("Đại học Quốc tế - ĐHQG HCM", "TP. Hồ Chí Minh"),
        University("Đại học Kinh tế - ĐHQG HCM", "TP. Hồ Chí Minh"),
        University("Đại học Luật TP. Hồ Chí Minh", "TP. Hồ Chí Minh"),
        University("Đại học Y khoa Phạm Ngọc Thạch", "TP. Hồ Chí Minh"),
        University("Đại học Bình Dương", "Bình Dương"),
        University("Đại học Quốc tế Miền Đông", "Bình Dương"),
        University("Đại học Đà Nẵng", "Đà Nẵng"),
        University("Đại học Bách khoa - ĐHĐN", "Đà Nẵng"),
        University("Đại học Kinh tế - ĐHĐN", "Đà Nẵng"),
        University("Đại học Sư phạm - ĐHĐN", "Đà Nẵng"),
        University("Đại học Ngoại ngữ - ĐHĐN", "Đà Nẵng"),
        University("Đại học Cần Thơ", "Cần Thơ"),
        University("Đại học An Giang", "An Giang"),
        University("Đại học Văn Lang", "TP. Hồ Chí Minh"),
        University("Đại học RMIT Việt Nam", "TP. Hồ Chí Minh"),
        University("Trường ĐH Tôn Đức Thắng", "TP. Hồ Chí Minh"),
        University("Đại học Tài chính - Marketing", "TP. Hồ Chí Minh"),
        University("Đại học Giao thông Vận tải TP.HCM", "TP. Hồ Chí Minh"),
        University("Đại học Sài Gòn", "TP. Hồ Chí Minh"),
        University("Đại học Sư phạm TP.HCM", "TP. Hồ Chí Minh"),
        University("Đại học Kinh tế TP.HCM", "TP. Hồ Chí Minh"),
        University("Đại học Ngân hàng TP.HCM", "TP. Hồ Chí Minh"),
        University("Đại học Mở TP.HCM", "TP. Hồ Chí Minh"),
        University("Đại học Văn Hiến", "TP. Hồ Chí Minh"),
        University("Khoa học Tự nhiên - ĐHQG HCM", "TP. Hồ Chí Minh"),
        University("Đại học Huế", "Thừa Thiên Huế"),
        University("Đại học Khoa học - ĐH Huế", "Thừa Thiên Huế"),
        University("Đại học Nông nghiệp", "Hà Nội"),
        University("Học viện Nông nghiệp Việt Nam", "Hà Nội"),
        University("Đại học Thủy lợi", "Hà Nội"),
        University("Đại học Lâm nghiệp", "Hà Nội"),
        University("Đại học Mỏ - Địa chất", "Hà Nội"),
        University("Học viện Công nghệ Bưu chính Viễn thông", "Hà Nội"),
        University("Đại học VinUniversity", "Hà Nội"),
        University("Trường ĐH Kinh tế - Luật, ĐHĐN", "Đà Nẵng"),
        University("Đại học Trà Vinh", "Trà Vinh"),
        University("Đại học Cửu Long", "Vĩnh Long"),
        University("Đại học Tiền Giang", "Tiền Giang"),
        University("Đại học Tân Tạo", "Long An"),
        University("Đại học Duy Tân", "Đà Nẵng"),
    )

    val provinces = universities.map { it.province }.distinct().sorted()
    fun getUniversitiesByProvince(province: String): List<String> {
        return universities.filter { it.province == province }.map { it.name }.sorted()
    }
}

@Composable
fun CityDropdown(
    selectedProvince: String,
    onProvinceSelected: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String = "Tỉnh / Thành phố",
    isError: Boolean = false,
    errorMessage: String? = null
) {
    var expanded by remember { mutableStateOf(false) }

    Column(modifier = modifier.fillMaxWidth()) {
        Text(
            text = label,
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
                    .border(
                        width = 1.5.dp,
                        color = if (isError) MaterialTheme.colorScheme.error else InputBorder,
                        shape = RoundedCornerShape(16.dp)
                    )
                    .clickable { expanded = true }
                    .padding(horizontal = 16.dp, vertical = 16.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = selectedProvince.ifBlank { "Chọn Tỉnh / Thành phố" },
                        style = MaterialTheme.typography.bodyLarge,
                        color = if (selectedProvince.isBlank()) InputPlaceholder else TextPrimary,
                        modifier = Modifier.weight(1f)
                    )
                    Icon(
                        imageVector = Icons.Filled.KeyboardArrowDown,
                        contentDescription = null,
                        tint = InputPlaceholder
                    )
                }
            }

            DropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false },
                modifier = Modifier.background(InputBackground)
            ) {
                VietnamUniversities.provinces.forEach { province ->
                    DropdownMenuItem(
                        text = {
                            Text(
                                text = province,
                                color = if (province == selectedProvince) MaterialTheme.colorScheme.primary else TextPrimary
                            )
                        },
                        onClick = {
                            onProvinceSelected(province)
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
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(start = 4.dp)
            )
        }
    }
}

@Composable
fun UniversityDropdown(
    selectedUniversity: String,
    universities: List<String>,
    onUniversitySelected: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String = "Trường Đại học",
    isError: Boolean = false,
    errorMessage: String? = null
) {
    var expanded by remember { mutableStateOf(false) }
    val isEnabled = universities.isNotEmpty()

    Column(modifier = modifier.fillMaxWidth()) {
        Text(
            text = label,
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
                    .border(
                        width = 1.5.dp,
                        color = if (isError) MaterialTheme.colorScheme.error else InputBorder,
                        shape = RoundedCornerShape(16.dp)
                    )
                    .clickable(enabled = isEnabled) { expanded = true }
                    .padding(horizontal = 16.dp, vertical = 16.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = selectedUniversity.ifBlank {
                            if (!isEnabled) "Vui lòng chọn Tỉnh / Thành phố trước"
                            else "Chọn Trường Đại học"
                        },
                        style = MaterialTheme.typography.bodyLarge,
                        color = if (selectedUniversity.isBlank()) InputPlaceholder else TextPrimary,
                        modifier = Modifier.weight(1f)
                    )
                    Icon(
                        imageVector = Icons.Filled.KeyboardArrowDown,
                        contentDescription = null,
                        tint = InputPlaceholder
                    )
                }
            }

            DropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false },
                modifier = Modifier.background(InputBackground)
            ) {
                universities.forEach { uni ->
                    DropdownMenuItem(
                        text = {
                            Text(
                                text = uni,
                                color = if (uni == selectedUniversity) MaterialTheme.colorScheme.primary else TextPrimary
                            )
                        },
                        onClick = {
                            onUniversitySelected(uni)
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
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(start = 4.dp)
            )
        }
    }
}

@Composable
fun YearDropdown(
    selectedYear: Int?,
    onYearSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
    label: String = "Năm tốt nghiệp (dự kiến)"
) {
    var expanded by remember { mutableStateOf(false) }
    val currentYear = java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)
    val years = (currentYear..currentYear + 10).toList()

    Column(modifier = modifier.fillMaxWidth()) {
        Text(
            text = label,
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
                    .border(1.5.dp, InputBorder, RoundedCornerShape(16.dp))
                    .clickable { expanded = true }
                    .padding(horizontal = 16.dp, vertical = 16.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = selectedYear?.toString() ?: "Chọn năm tốt nghiệp",
                        style = MaterialTheme.typography.bodyLarge,
                        color = if (selectedYear == null) InputPlaceholder else TextPrimary,
                        modifier = Modifier.weight(1f)
                    )
                    Icon(
                        imageVector = Icons.Filled.KeyboardArrowDown,
                        contentDescription = null,
                        tint = InputPlaceholder
                    )
                }
            }

            DropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false },
                modifier = Modifier.background(InputBackground)
            ) {
                years.forEach { year ->
                    DropdownMenuItem(
                        text = {
                            Text(
                                text = year.toString(),
                                color = if (year == selectedYear) MaterialTheme.colorScheme.primary else TextPrimary
                            )
                        },
                        onClick = {
                            onYearSelected(year)
                            expanded = false
                        }
                    )
                }
            }
        }
    }
}
