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
import com.example.nextstepz.auth.data.model.ProvinceItem
import com.example.nextstepz.auth.data.model.UniversityItem
import com.example.nextstepz.ui.theme.InputBackground
import com.example.nextstepz.ui.theme.InputBorder
import com.example.nextstepz.ui.theme.InputBorderFocused
import com.example.nextstepz.ui.theme.InputPlaceholder
import com.example.nextstepz.ui.theme.TextPrimary

@Composable
fun CityDropdown(
    selectedProvince: ProvinceItem?,
    provinces: List<ProvinceItem>,
    onProvinceSelected: (ProvinceItem) -> Unit,
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
                        text = selectedProvince?.name ?: "Chọn Tỉnh / Thành phố",
                        style = MaterialTheme.typography.bodyLarge,
                        color = if (selectedProvince == null) InputPlaceholder else TextPrimary,
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
                provinces.forEach { province ->
                    DropdownMenuItem(
                        text = {
                            Text(
                                text = province.name,
                                color = if (province.code == selectedProvince?.code) {
                                    MaterialTheme.colorScheme.primary
                                }else {
                                    TextPrimary
                                }
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
    selectedUniversity: UniversityItem?,
    universities: List<UniversityItem>,
    onUniversitySelected: (UniversityItem) -> Unit,
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
                        text = selectedUniversity?.name ?: "Chọn Trường Đại học theo tỉnh",
                        style = MaterialTheme.typography.bodyLarge,
                        color = if (selectedUniversity == null) InputPlaceholder else TextPrimary,
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
                                text = if (uni.short_name.isNullOrBlank()){
                                    uni.name
                                }else{
                                    "${uni.short_name} - ${uni.name}"
                                },
                                color = if (uni.id == selectedUniversity?.id) {
                                    MaterialTheme.colorScheme.primary
                                }else {
                                    TextPrimary
                                }
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
