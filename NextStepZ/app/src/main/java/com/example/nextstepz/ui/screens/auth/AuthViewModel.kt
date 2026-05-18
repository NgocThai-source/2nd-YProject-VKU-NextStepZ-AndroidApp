package com.example.nextstepz.ui.screens.auth

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.auth.data.local.TokenManager
import com.example.nextstepz.auth.data.model.BaseResponse
import com.example.nextstepz.auth.data.model.ForgotPasswordRequest
import com.example.nextstepz.auth.data.model.LoginRequest
import com.example.nextstepz.auth.data.model.RegisterRequest
import com.example.nextstepz.auth.data.model.ResetPasswordRequest
import com.example.nextstepz.auth.data.model.VerifyOtpRequest
import com.example.nextstepz.auth.data.repository.AuthRepository
import kotlinx.coroutines.launch
import org.json.JSONObject
import retrofit2.HttpException

class AuthViewModel : ViewModel() {
    private val authRepository = AuthRepository()

    var authState by mutableStateOf<AuthState>(AuthState.Idle)
        private set

    private fun <T : BaseResponse> executeAuthAction(
        onSuccess: (T) -> Unit = {},
        apiCall: suspend () -> T

    ) {
        viewModelScope.launch {
            authState = AuthState.Loading

            try {
                val response = apiCall()

                if (response.success) {
                    onSuccess(response)
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

    fun register(
        request: RegisterRequest,
        tokenManager: TokenManager
    ) = executeAuthAction(
        onSuccess = { response ->
            tokenManager.userId = response.userData?.userId
            tokenManager.userName = response.userData?.name
            tokenManager.userEmail = response.userData?.email
            tokenManager.userPhone = response.userData?.phone
            tokenManager.userRole = response.userData?.role
            tokenManager.userAvatar = response.userData?.avatar
            tokenManager.isVerified = response.userData?.isVerified ?: false
        }
    ) {
        authRepository.register(request)
    }

    fun login(
        request: LoginRequest,
        tokenManager: TokenManager
    ) = executeAuthAction(
        onSuccess = { response ->
            tokenManager.token = response.token
            tokenManager.userId = response.userId ?: response.userData?.userId
            tokenManager.userName = response.userData?.name
            tokenManager.userEmail = response.userData?.email
            tokenManager.userPhone = response.userData?.phone
            tokenManager.userRole = response.userData?.role
            tokenManager.userAvatar = response.userData?.avatar
            tokenManager.isVerified = response.userData?.isVerified ?: false
        }
    ) {
        authRepository.login(request)
    }

    fun forgotPassword(
        request: ForgotPasswordRequest
    ) = executeAuthAction {
        authRepository.forgotPassword(request)
    }

    fun verifyOtp(
        request: VerifyOtpRequest
    ) = executeAuthAction {
        authRepository.verifyOtp(request)
    }

    fun resetPassword(
        request: ResetPasswordRequest
    ) = executeAuthAction {
        authRepository.resetPassword(request)
    }

    fun resetState() {
        authState = AuthState.Idle
    }
}