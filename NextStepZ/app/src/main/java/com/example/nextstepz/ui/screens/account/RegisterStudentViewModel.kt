package com.example.nextstepz.ui.screens.account

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.auth.data.model.StudentRegistrationRequest
import com.example.nextstepz.auth.data.repository.AuthRepository
import com.example.nextstepz.ui.screens.auth.ProfileState
import kotlinx.coroutines.launch

class RegisterStudentViewModel : ViewModel() {
    private val authRepository = AuthRepository()
    var profileState by mutableStateOf<ProfileState>(ProfileState.Idle)
        private set

    var fullName by mutableStateOf("")
        private set
    var dateOfBirth by mutableStateOf("")
        private set
    var phone by mutableStateOf("")
        private set
    var email by mutableStateOf("")
        private set
    var province by mutableStateOf("")
        private set
    var university by mutableStateOf("")
        private set
    var major by mutableStateOf("")
        private set
    var graduationYear by mutableStateOf("")
        private set
    var gpa by mutableStateOf("")
        private set
    var termsAccepted by mutableStateOf(false)
        private set

    var fullNameError by mutableStateOf<String?>(null)
        private set
    var dateOfBirthError by mutableStateOf<String?>(null)
        private set
    var phoneError by mutableStateOf<String?>(null)
        private set
    var emailError by mutableStateOf<String?>(null)
        private set
    var provinceError by mutableStateOf<String?>(null)
        private set
    var universityError by mutableStateOf<String?>(null)
        private set
    var majorError by mutableStateOf<String?>(null)
        private set
    var graduationYearError by mutableStateOf<String?>(null)
        private set
    var gpaError by mutableStateOf<String?>(null)
        private set

    var showSuccessDialog by mutableStateOf(false)
        private set

    fun updateFullName(value: String) { fullName = value; fullNameError = null }
    fun updateDateOfBirth(value: String) { dateOfBirth = value; dateOfBirthError = null }
    fun updatePhone(value: String) { phone = value; phoneError = null }
    fun updateEmail(value: String) { email = value; emailError = null }
    fun updateProvince(value: String) { province = value; provinceError = null; university = "" }
    fun updateUniversity(value: String) { university = value; universityError = null }
    fun updateMajor(value: String) { major = value; majorError = null }
    fun updateGraduationYear(value: String) { graduationYear = value; graduationYearError = null }
    fun updateGpa(value: String) { gpa = value; gpaError = null }
    fun updateTermsAccepted(value: Boolean) { termsAccepted = value }

    private fun isValidEmail(email: String): Boolean {
        return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }

    private fun isValidVietnamesePhone(phone: String): Boolean {
        val cleanPhone = phone.replace("\\s".toRegex(), "")
        val phoneRegex = Regex("^(0[3|5|7|8|9])[0-9]{8}$")
        return phoneRegex.matches(cleanPhone)
    }

    private fun isValidDate(date: String): Boolean {
        val regex = Regex("^\\d{2}/\\d{2}/\\d{4}$")
        if (!regex.matches(date)) return false
        val parts = date.split("/")
        val day = parts[0].toIntOrNull() ?: return false
        val month = parts[1].toIntOrNull() ?: return false
        val year = parts[2].toIntOrNull() ?: return false
        if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) return false
        val today = java.util.Calendar.getInstance()
        val birthDate = java.util.Calendar.getInstance().apply {
            set(year, month - 1, day)
        }
        return birthDate.before(today)
    }

    fun submit(userId: String) {
        var hasError = false

        if (fullName.isBlank()) {
            fullNameError = "Họ và tên không được để trống"
            hasError = true
        }

        if (dateOfBirth.isBlank()) {
            dateOfBirthError = "Ngày sinh không được để trống"
            hasError = true
        } else if (!isValidDate(dateOfBirth)) {
            dateOfBirthError = "Ngày sinh không hợp lệ (DD/MM/YYYY)"
            hasError = true
        }

        if (phone.isBlank()) {
            phoneError = "Số điện thoại không được để trống"
            hasError = true
        } else if (!isValidVietnamesePhone(phone)) {
            phoneError = "Số điện thoại không hợp lệ (VD: 0912345678)"
            hasError = true
        }

        if (email.isBlank()) {
            emailError = "Email không được để trống"
            hasError = true
        } else if (!isValidEmail(email)) {
            emailError = "Email không hợp lệ"
            hasError = true
        }

        if (province.isBlank()) {
            provinceError = "Vui lòng chọn Tỉnh / Thành phố"
            hasError = true
        }

        if (university.isBlank()) {
            universityError = "Vui lòng chọn Trường Đại học"
            hasError = true
        }

        if (major.isBlank()) {
            majorError = "Chuyên ngành không được để trống"
            hasError = true
        }

        if (graduationYear.isBlank()) {
            graduationYearError = "Vui lòng nhập năm tốt nghiệp"
            hasError = true
        } else {
            val year = graduationYear.toIntOrNull()
            val currentYear = java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)
            if (year == null || year < 2000 || year > currentYear + 15) {
                graduationYearError = "Năm tốt nghiệp không hợp lệ"
                hasError = true
            }
        }

        val gpaValue = gpa.toDoubleOrNull()
        if (gpa.isBlank()) {
            gpaError = "GPA không được để trống"
            hasError = true
        } else if (gpaValue == null || gpaValue < 0 || gpaValue > 4.0) {
            gpaError = "GPA phải từ 0.0 đến 4.0"
            hasError = true
        }

        if (!termsAccepted) {
            hasError = true
        }

        if (hasError) return

        val request = StudentRegistrationRequest(
            userId = userId,
            fullName = fullName,
            dateOfBirth = dateOfBirth,
            phone = phone,
            email = email,
            province = province,
            university = university,
            major = major,
            graduationYear = graduationYear.toInt(),
            gpa = gpaValue!!
        )

        viewModelScope.launch {
            profileState = ProfileState.Loading
            try {
                val response = authRepository.registerStudent(request)
                if (response.success) {
                    profileState = ProfileState.Success(response.message)
                    showSuccessDialog = true
                } else {
                    profileState = ProfileState.Error(response.message)
                }
            } catch (e: Exception) {
                profileState = ProfileState.Error("Đã xảy ra lỗi: ${e.message}")
            }
        }
    }

    fun resetState() {
        profileState = ProfileState.Idle
        showSuccessDialog = false
    }
}
