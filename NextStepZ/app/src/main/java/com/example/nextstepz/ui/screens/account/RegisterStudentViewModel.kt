package com.example.nextstepz.ui.screens.account

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.auth.data.model.BaseResponse
import com.example.nextstepz.auth.data.model.CompleteProfileRequest
import com.example.nextstepz.auth.data.model.ProvinceItem
import com.example.nextstepz.auth.data.model.StudentProfileUi
import com.example.nextstepz.auth.data.model.UniversityItem
import com.example.nextstepz.auth.data.model.UserRole
import com.example.nextstepz.auth.data.repository.ProfileRepository
import kotlinx.coroutines.launch
import org.json.JSONObject
import retrofit2.HttpException

class RegisterStudentViewModel(application: Application) : AndroidViewModel(application) {
    private val profileRepository = ProfileRepository(application)
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
    var provinces by mutableStateOf<List<ProvinceItem>>(emptyList())
        private set

    var universities by mutableStateOf<List<UniversityItem>>(emptyList())
        private set

    var selectedProvince by mutableStateOf<ProvinceItem?>(null)
        private set

    var selectedUniversity by mutableStateOf<UniversityItem?>(null)
        private set

    var isLoadingProvinces by mutableStateOf(false)
        private set

    var isLoadingUniversities by mutableStateOf(false)
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
    fun updateProvince(value: ProvinceItem) {
        selectedProvince = value
        provinceError = null

        selectedUniversity = null
        universityError = null
        universities = emptyList()

        loadUniversitiesByProvince(value.code)
    }

    fun updateUniversity(value: UniversityItem) {
        selectedUniversity = value
        universityError = null
    }
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

    fun loadProvinces() {
        viewModelScope.launch {
            isLoadingProvinces = true

            try {
                val response = profileRepository.getProvinces()

                if (response.success) {
                    provinces = response.data
                } else {
                    profileState = ProfileState.Error(response.message)
                }
            } catch (e: Exception) {
                profileState = ProfileState.Error("Không thể tải tỉnh/thành phố: ${e.message}")
            } finally {
                isLoadingProvinces = false
            }
        }
    }

    private fun loadUniversitiesByProvince(provinceCode: Int) {
        viewModelScope.launch {
            isLoadingUniversities = true

            try {
                val response = profileRepository.getUniversitiesByProvince(provinceCode)

                if (response.success) {
                    universities = response.data
                } else {
                    profileState = ProfileState.Error(response.message)
                }
            } catch (e: Exception) {
                profileState = ProfileState.Error("Không thể tải trường đại học: ${e.message}")
            } finally {
                isLoadingUniversities = false
            }
        }
    }

    fun buildStudentProfileUi(): StudentProfileUi {
        return StudentProfileUi(
            fullName = fullName,
            dob = dateOfBirth,
            email = email,
            phone = phone,
            provinceName = selectedProvince?.name.orEmpty(),
            universityName = selectedUniversity?.name.orEmpty(),
            major = major,
            graduationYear = graduationYear,
            gpa = gpa
        )
    }

    private fun <T : BaseResponse> executeProfileAction(
        onSuccess: () -> Unit,
        apiCall: suspend () -> T
    ) {
        viewModelScope.launch {
            profileState = ProfileState.Loading

            try {
                val response = apiCall()

                if (response.success) {
                    profileState = ProfileState.Success(response.message)
                    onSuccess()
                } else {
                    profileState = ProfileState.Error(response.message)
                }
            } catch (e: HttpException) {
                val errorBodyString = e.response()?.errorBody()?.string()

                val messageFromServer = try {
                    JSONObject(errorBodyString ?: "").getString("message")
                } catch (jsonException: Exception) {
                    "Lỗi định dạng dữ liệu từ Server"
                }

                profileState = ProfileState.Error(messageFromServer)
            } catch (e: Exception) {
                profileState = ProfileState.Error("Đã xảy ra lỗi kết nối: ${e.message}")
            }
        }
    }
    private fun validateForm(): Boolean {
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

        if (selectedProvince == null) {
            provinceError = "Vui lòng chọn Tỉnh / Thành phố"
            hasError = true
        }

        if (selectedUniversity == null) {
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


        return !hasError
    }

    fun submit(userId: String) {
        if(userId.isBlank()){
            profileState = ProfileState.Error("Không tìm thấy thông tin người dùng")
            return
        }
        if (!validateForm()) {
            return
        }
        val gpaValue = gpa.trim().toDoubleOrNull()
        val request = CompleteProfileRequest(
            role = UserRole.STUDENT.value,

            dob = dateOfBirth,
            province_code = selectedProvince!!.code,
            university_id = selectedUniversity!!.id,
            major = major,
            graduation_year = graduationYear.toInt(),
            gpa = gpaValue!!,
            bio = "",

            contact_phone = phone,
            contact_email = email,
            contact_full_name = fullName
        )
        executeProfileAction(onSuccess = {showSuccessDialog = true}){
            profileRepository.completeProfile(userId, request)
        }
    }

}
