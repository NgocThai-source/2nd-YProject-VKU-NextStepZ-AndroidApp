package com.example.nextstepz.ui.screens.account

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.auth.data.model.EmployerRegistrationRequest
import com.example.nextstepz.auth.data.repository.AuthRepository
import com.example.nextstepz.ui.screens.auth.ProfileState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

class RegisterEmployerViewModel : ViewModel() {
    private val authRepository = AuthRepository()
    var profileState by mutableStateOf<ProfileState>(ProfileState.Idle)
        private set

    var companyName by mutableStateOf("")
        private set
    var companyAddress by mutableStateOf("")
        private set
    var recruiterName by mutableStateOf("")
        private set
    var phone by mutableStateOf("")
        private set
    var email by mutableStateOf("")
        private set
    var taxCode by mutableStateOf("")
        private set
    var field by mutableStateOf("")
        private set
    var customField by mutableStateOf("")
        private set
    var termsAccepted by mutableStateOf(false)
        private set

    var companyNameError by mutableStateOf<String?>(null)
        private set
    var companyAddressError by mutableStateOf<String?>(null)
        private set
    var recruiterNameError by mutableStateOf<String?>(null)
        private set
    var phoneError by mutableStateOf<String?>(null)
        private set
    var emailError by mutableStateOf<String?>(null)
        private set
    var taxCodeError by mutableStateOf<String?>(null)
        private set
    var fieldError by mutableStateOf<String?>(null)
        private set

    var showPendingDialog by mutableStateOf(false)
        private set

    private val businessFields = listOf(
        "Công nghệ thông tin",
        "Tài chính - Ngân hàng",
        "Kinh doanh - Marketing",
        "Kỹ thuật - Cơ khí",
        "Nhân sự - Hành chính",
        "Kế toán - Kiểm toán",
        "Giáo dục - Đào tạo",
        "Y tế - Dược phẩm",
        "Xây dựng - Bất động sản",
        "Sản xuất - Công nghiệp",
        "Dịch vụ - Du lịch",
        "Nông nghiệp - Thực phẩm",
        "Truyền thông - Báo chí",
        "Thiết kế - Sáng tạo",
        "Khác"
    )

    fun getBusinessFields() = businessFields

    fun updateCompanyName(value: String) { companyName = value; companyNameError = null }
    fun updateCompanyAddress(value: String) { companyAddress = value; companyAddressError = null }
    fun updateRecruiterName(value: String) { recruiterName = value; recruiterNameError = null }
    fun updatePhone(value: String) { phone = value; phoneError = null }
    fun updateEmail(value: String) { email = value; emailError = null }
    fun updateTaxCode(value: String) { taxCode = value; taxCodeError = null }
    fun updateField(value: String) { field = value; fieldError = null; if (value != "Khác") customField = "" }
    fun updateCustomField(value: String) { customField = value }
    fun updateTermsAccepted(value: Boolean) { termsAccepted = value }

    private fun isValidEmail(email: String): Boolean {
        return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }

    private fun isValidVietnamesePhone(phone: String): Boolean {
        val cleanPhone = phone.replace("\\s".toRegex(), "")
        val phoneRegex = Regex("^(0[3|5|7|8|9])[0-9]{8}$")
        return phoneRegex.matches(cleanPhone)
    }

    private fun isValidTaxCode(code: String): Boolean {
        val clean = code.replace("\\s".toRegex(), "")
        return clean.length in 10..13 && clean.all { it.isDigit() }
    }

    fun submit(userId: String) {
        var hasError = false

        if (companyName.isBlank()) {
            companyNameError = "Tên công ty không được để trống"
            hasError = true
        }

        if (companyAddress.isBlank()) {
            companyAddressError = "Địa chỉ công ty không được để trống"
            hasError = true
        }

        if (recruiterName.isBlank()) {
            recruiterNameError = "Tên người tuyển dụng không được để trống"
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

        if (taxCode.isBlank()) {
            taxCodeError = "Mã số thuế không được để trống"
            hasError = true
        } else if (!isValidTaxCode(taxCode)) {
            taxCodeError = "Mã số thuế không hợp lệ (10-13 chữ số)"
            hasError = true
        }

        if (field.isBlank()) {
            fieldError = "Vui lòng chọn lĩnh vực hoạt động"
            hasError = true
        } else if (field == "Khác" && customField.isBlank()) {
            fieldError = "Vui lòng nhập lĩnh vực hoạt động"
            hasError = true
        }

        if (!termsAccepted) {
            hasError = true
        }

        if (hasError) return

        val request = EmployerRegistrationRequest(
            userId = userId,
            companyName = companyName,
            companyAddress = companyAddress,
            recruiterName = recruiterName,
            phone = phone,
            email = email,
            taxCode = taxCode,
            field = if (field == "Khác") customField else field
        )

        viewModelScope.launch {
            profileState = ProfileState.Loading
            try {
                val response = authRepository.registerEmployer(request)
                if (response.success) {
                    profileState = ProfileState.Success(response.message)
                    showPendingDialog = true
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
        showPendingDialog = false
    }
}
