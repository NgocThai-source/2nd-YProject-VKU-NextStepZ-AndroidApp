package com.example.nextstepz.ui.screens.account

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.auth.data.model.UpdateEmailRequest
import com.example.nextstepz.auth.data.model.UpdatePasswordRequest
import com.example.nextstepz.auth.data.repository.AuthRepository
import com.example.nextstepz.auth.data.repository.ProfileRepository
import kotlinx.coroutines.launch

class PrivacyViewModel : ViewModel() {
    private val profileRepository = ProfileRepository()
    var profileState by mutableStateOf<ProfileState>(ProfileState.Idle)
        private set

    var currentEmail by mutableStateOf("")
        private set
    var newEmail by mutableStateOf("")
        private set
    var confirmEmail by mutableStateOf("")
        private set

    var currentPassword by mutableStateOf("")
        private set
    var newPassword by mutableStateOf("")
        private set
    var confirmPassword by mutableStateOf("")
        private set

    var newEmailError by mutableStateOf<String?>(null)
        private set
    var confirmEmailError by mutableStateOf<String?>(null)
        private set
    var currentPasswordError by mutableStateOf<String?>(null)
        private set
    var newPasswordError by mutableStateOf<String?>(null)
        private set
    var confirmPasswordError by mutableStateOf<String?>(null)
        private set

    var showEmailSuccess by mutableStateOf(false)
        private set
    var showPasswordSuccess by mutableStateOf(false)
        private set

    fun updateCurrentEmail(email: String) { currentEmail = email }

    fun updateNewEmail(value: String) { newEmail = value; newEmailError = null }
    fun updateConfirmEmail(value: String) { confirmEmail = value; confirmEmailError = null }
    fun updateCurrentPassword(value: String) { currentPassword = value; currentPasswordError = null }
    fun updateNewPassword(value: String) { newPassword = value; newPasswordError = null }
    fun updateConfirmPassword(value: String) { confirmPassword = value; confirmPasswordError = null }

    private fun isValidEmail(email: String): Boolean {
        return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }

    fun submitEmailUpdate(userId: String) {
        var hasError = false

        if (newEmail.isBlank()) {
            newEmailError = "Email mới không được để trống"
            hasError = true
        } else if (!isValidEmail(newEmail)) {
            newEmailError = "Email không hợp lệ"
            hasError = true
        } else if (newEmail == currentEmail) {
            newEmailError = "Email mới phải khác email hiện tại"
            hasError = true
        }

        if (confirmEmail.isBlank()) {
            confirmEmailError = "Vui lòng xác nhận email mới"
            hasError = true
        } else if (confirmEmail != newEmail) {
            confirmEmailError = "Email xác nhận không khớp"
            hasError = true
        }

        if (hasError) return

        viewModelScope.launch {
            profileState = ProfileState.Loading
            try {
                val response = profileRepository.updateEmail(UpdateEmailRequest(userId, newEmail))
                if (response.success) {
                    currentEmail = newEmail
                    newEmail = ""
                    confirmEmail = ""
                    showEmailSuccess = true
                    profileState = ProfileState.Success(response.message)
                } else {
                    profileState = ProfileState.Error(response.message)
                }
            } catch (e: Exception) {
                profileState = ProfileState.Error("Đã xảy ra lỗi: ${e.message}")
            }
        }
    }

    fun submitPasswordUpdate(userId: String) {
        var hasError = false

        if (currentPassword.isBlank()) {
            currentPasswordError = "Mật khẩu hiện tại không được để trống"
            hasError = true
        }

        if (newPassword.isBlank()) {
            newPasswordError = "Mật khẩu mới không được để trống"
            hasError = true
        } else if (newPassword.length < 6) {
            newPasswordError = "Mật khẩu mới phải có ít nhất 6 ký tự"
            hasError = true
        }

        if (confirmPassword.isBlank()) {
            confirmPasswordError = "Vui lòng xác nhận mật khẩu mới"
            hasError = true
        } else if (confirmPassword != newPassword) {
            confirmPasswordError = "Mật khẩu xác nhận không khớp"
            hasError = true
        } else if (confirmPassword == currentPassword) {
            confirmPasswordError = "Mật khẩu mới phải khác mật khẩu hiện tại"
            hasError = true
        }

        if (hasError) return

        viewModelScope.launch {
            profileState = ProfileState.Loading
            try {
                val response = profileRepository.updatePassword(
                    UpdatePasswordRequest(userId, currentPassword, newPassword)
                )
                if (response.success) {
                    currentPassword = ""
                    newPassword = ""
                    confirmPassword = ""
                    showPasswordSuccess = true
                    profileState = ProfileState.Success(response.message)
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
        showEmailSuccess = false
        showPasswordSuccess = false
    }
}
