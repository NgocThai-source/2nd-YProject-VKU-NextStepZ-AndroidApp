package com.example.nextstepz.ui.screens.auth

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.auth.data.model.ApiResponse
import com.example.nextstepz.auth.data.model.BaseResponse
import com.example.nextstepz.auth.data.model.EmployerRegistrationRequest
import com.example.nextstepz.auth.data.model.ForgotPasswordRequest
import com.example.nextstepz.auth.data.model.LoginRequest
import com.example.nextstepz.auth.data.model.RegisterRequest
import com.example.nextstepz.auth.data.model.ResetPasswordRequest
import com.example.nextstepz.auth.data.model.StudentRegistrationRequest
import com.example.nextstepz.auth.data.model.UpdateEmailRequest
import com.example.nextstepz.auth.data.model.UpdatePasswordRequest
import com.example.nextstepz.auth.data.model.UserData
import com.example.nextstepz.auth.data.model.UserRole
import com.example.nextstepz.auth.data.model.VerifyOtpRequest
import com.example.nextstepz.auth.data.repository.AuthRepository
import kotlinx.coroutines.launch
import org.json.JSONObject
import retrofit2.HttpException

class AuthViewModel : ViewModel() {
    private val authRepository = AuthRepository()
    var authState by mutableStateOf<AuthState>(AuthState.Idle)
        private set

    var profileState by mutableStateOf<ProfileState>(ProfileState.Idle)
        private set

    var currentUser by mutableStateOf<UserData?>(null)
        private set

    var userRole by mutableStateOf<UserRole>(UserRole.GUEST)
        private set

    private fun <T : BaseResponse> executeAuthAction(apiCall: suspend () -> T) {
        viewModelScope.launch {
            authState = AuthState.Loading
            try {
                val response = apiCall()
                if (response.success) {
                    authState = AuthState.Success(response.message)
                } else {
                    authState = AuthState.Error(response.message)
                }
            } catch (e: HttpException) {
                val errorBodyString = e.response()?.errorBody()?.string()
                val messageFromServer = try {
                    JSONObject(errorBodyString ?: "").getString("message")
                } catch (jsonException: Exception) {
                    "Lỗi định dạng dữ liệu từ Server"
                }
                authState = AuthState.Error(messageFromServer)
            } catch (e: Exception) {
                authState = AuthState.Error("Đã xảy ra lỗi kết nối: ${e.message}")
            }
        }
    }

    private fun <T : BaseResponse> executeProfileAction(apiCall: suspend () -> T) {
        viewModelScope.launch {
            profileState = ProfileState.Loading
            try {
                val response = apiCall()
                if (response.success) {
                    profileState = ProfileState.Success(response.message)
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

    fun register(request: RegisterRequest) = executeAuthAction { authRepository.register(request) }

    fun login(request: LoginRequest) = executeAuthAction { authRepository.login(request) }

    fun forgotPassword(request: ForgotPasswordRequest) = executeAuthAction { authRepository.forgotPassword(request) }

    fun verifyOtp(request: VerifyOtpRequest) = executeAuthAction { authRepository.verifyOtp(request) }

    fun resetPassword(request: ResetPasswordRequest) = executeAuthAction { authRepository.resetPassword(request) }

    fun registerStudent(request: StudentRegistrationRequest) = executeProfileAction { authRepository.registerStudent(request) }

    fun registerEmployer(request: EmployerRegistrationRequest) = executeProfileAction { authRepository.registerEmployer(request) }

    fun updateEmail(request: UpdateEmailRequest) = executeProfileAction { authRepository.updateEmail(request) }

    fun updatePassword(request: UpdatePasswordRequest) = executeProfileAction { authRepository.updatePassword(request) }

    fun logout(userId: String) = executeProfileAction { authRepository.logout(userId) }

    fun setUserData(userData: UserData?) {
        currentUser = userData
        userRole = UserRole.fromValue(userData?.role)
    }

    fun updateUserRole(role: UserRole) {
        userRole = role
    }

    fun resetState() {
        authState = AuthState.Idle
    }

    fun resetProfileState() {
        profileState = ProfileState.Idle
    }
}

sealed class ProfileState {
    object Idle : ProfileState()
    object Loading : ProfileState()
    data class Success(val message: String) : ProfileState()
    data class Error(val message: String) : ProfileState()
}
