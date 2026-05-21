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
import com.example.nextstepz.auth.data.model.EmployerProfileUi
import com.example.nextstepz.auth.data.model.UserRole
import com.example.nextstepz.auth.data.repository.ProfileRepository
import kotlinx.coroutines.launch
import org.json.JSONObject
import retrofit2.HttpException

class RegisterEmployerViewModel(application: Application) : AndroidViewModel(application) {
    private val profileRepository = ProfileRepository(application)
    var profileState by mutableStateOf<ProfileState>(ProfileState.Idle)
        private set

    var companyName by mutableStateOf("")
        private set
    var companyAddress by mutableStateOf("")
        private set
    var employerName by mutableStateOf("")
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
    var employerNameError by mutableStateOf<String?>(null)
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

    private val industryOptions = listOf(
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

    fun getIndustryFields() = industryOptions

    fun updateCompanyName(value: String) {
        companyName = value; companyNameError = null
    }

    fun updateCompanyAddress(value: String) {
        companyAddress = value; companyAddressError = null
    }

    fun updateEmployerName(value: String) {
        employerName = value; employerNameError = null
    }

    fun updatePhone(value: String) {
        phone = value; phoneError = null
    }

    fun updateEmail(value: String) {
        email = value; emailError = null
    }

    fun updateTaxCode(value: String) {
        taxCode = value; taxCodeError = null
    }

    fun updateField(value: String) {
        field = value; fieldError = null; if (value != "Khác") customField = ""
    }

    fun updateCustomField(value: String) {
        customField = value
    }

    fun updateTermsAccepted(value: Boolean) {
        termsAccepted = value
    }

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

    private fun <T : BaseResponse> executeProfileAction(
        onSuccess: () -> Unit = {},
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

        if (companyName.isBlank()) {
            companyNameError = "Tên công ty không được để trống"
            hasError = true
        }

        if (companyAddress.isBlank()) {
            companyAddressError = "Địa chỉ công ty không được để trống"
            hasError = true
        }

        if (employerName.isBlank()) {
            employerNameError = "Tên người tuyển dụng không được để trống"
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
            profileState = ProfileState.Error("Bạn cần chấp nhận nội quy để tiếp tục")
            hasError = true
        }

        return !hasError
    }
    fun buildEmployerProfileUi(): EmployerProfileUi {
        return EmployerProfileUi(
            companyName = companyName,
            companyAddress = companyAddress,
            employerName = employerName,
            phone = phone,
            email = email,
            taxCode = taxCode,
            industry = if (field == "Khác") customField else field
        )
    }
    fun submit(userId: String) {
        if (userId.isBlank()) {
            profileState = ProfileState.Error("Không tìm thấy thông tin người dùng")
            return
        }
        if (!validateForm()) return
        val request = CompleteProfileRequest(
            role = UserRole.EMPLOYER.value,

            company_name = companyName,
            tax_code = taxCode,
            company_address = companyAddress,
            employer_name = employerName,
            industry = if (field == "Khác") customField else field,

            contact_phone = phone,
            contact_email = email
        )

        executeProfileAction(onSuccess = {showPendingDialog = true}) {
            profileRepository.completeProfile(userId, request)
        }
    }
}
