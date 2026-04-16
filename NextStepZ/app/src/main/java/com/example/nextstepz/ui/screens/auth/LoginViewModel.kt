package com.example.nextstepz.ui.screens.auth

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.data.local.TokenManager
import com.example.nextstepz.data.repository.AuthRepository
import com.example.nextstepz.domain.model.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

// Login UI State
sealed class LoginUiState {
    data object Idle : LoginUiState()
    data object Loading : LoginUiState()
    data class Success(val user: User) : LoginUiState()
    data class Error(val message: String) : LoginUiState()
}

// Login ViewModel - Quan ly state cho Login Screen
class LoginViewModel(application: Application) : AndroidViewModel(application) {

    private val authRepository = AuthRepository()
    private val tokenManager = TokenManager(application)

    // Form state
    private val _email = MutableStateFlow("")
    val email: StateFlow<String> = _email.asStateFlow()

    private val _password = MutableStateFlow("")
    val password: StateFlow<String> = _password.asStateFlow()

    private val _showPassword = MutableStateFlow(false)
    val showPassword: StateFlow<Boolean> = _showPassword.asStateFlow()

    // UI state
    private val _uiState = MutableStateFlow<LoginUiState>(LoginUiState.Idle)
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun onEmailChange(value: String) {
        _email.value = value
        if (_uiState.value is LoginUiState.Error) {
            _uiState.value = LoginUiState.Idle
        }
    }

    fun onPasswordChange(value: String) {
        _password.value = value
        if (_uiState.value is LoginUiState.Error) {
            _uiState.value = LoginUiState.Idle
        }
    }

    fun toggleShowPassword() {
        _showPassword.value = !_showPassword.value
    }

    fun login() {
        val emailValue = _email.value.trim()
        val passwordValue = _password.value.trim()

        if (emailValue.isEmpty() || passwordValue.isEmpty()) {
            _uiState.value = LoginUiState.Error("Vui lòng nhập email/số điện thoại và mật khẩu")
            return
        }

        viewModelScope.launch {
            _uiState.value = LoginUiState.Loading

            try {
                val response = authRepository.login(emailValue, passwordValue)
                if (response != null) {
                    // Save token
                    tokenManager.saveAccessToken(response.accessToken)
                    tokenManager.saveUserInfo(response.id, response.role)

                    // Create User model
                    val user = User(
                        id = response.id,
                        email = response.email,
                        firstName = response.firstName,
                        lastName = response.lastName,
                        phone = response.phone,
                        avatar = response.avatar,
                        role = response.role,
                        birthDate = response.birthDate,
                        province = response.province,
                        school = response.school,
                        major = response.major,
                        companyName = response.companyName,
                        website = response.website,
                        address = response.address,
                        taxId = response.taxId
                    )

                    _uiState.value = LoginUiState.Success(user)
                } else {
                    _uiState.value = LoginUiState.Error("Phản hồi rỗng từ server")
                }
            } catch (e: Exception) {
                _uiState.value = LoginUiState.Error(
                    e.message ?: "Có lỗi xảy ra. Vui lòng thử lại."
                )
            }
        }
    }

    fun resetState() {
        _uiState.value = LoginUiState.Idle
    }
}
