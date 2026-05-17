package com.example.nextstepz.auth.data.repository

import com.example.nextstepz.auth.data.model.ApiResponse
import com.example.nextstepz.auth.data.model.EmployerRegistrationRequest
import com.example.nextstepz.auth.data.model.ForgotPasswordRequest
import com.example.nextstepz.auth.data.model.ForgotPasswordResponse
import com.example.nextstepz.auth.data.model.LoginRequest
import com.example.nextstepz.auth.data.model.LoginResponse
import com.example.nextstepz.auth.data.model.RegisterRequest
import com.example.nextstepz.auth.data.model.RegisterResponse
import com.example.nextstepz.auth.data.model.ResetPasswordRequest
import com.example.nextstepz.auth.data.model.StudentRegistrationRequest
import com.example.nextstepz.auth.data.model.UpdateEmailRequest
import com.example.nextstepz.auth.data.model.UpdatePasswordRequest
import com.example.nextstepz.auth.data.model.VerifyOtpRequest
import com.example.nextstepz.auth.data.remote.RetrofitClient

class AuthRepository {
    suspend fun register(request: RegisterRequest): RegisterResponse {
        return RetrofitClient.apiInterface.register(request)
    }
    suspend fun login(request: LoginRequest): LoginResponse {
        return RetrofitClient.apiInterface.login(request)
    }
    suspend fun forgotPassword(request: ForgotPasswordRequest): ForgotPasswordResponse {
        return RetrofitClient.apiInterface.forgotPassword(request)
    }

    suspend fun verifyOtp(request: VerifyOtpRequest): ForgotPasswordResponse {
        return RetrofitClient.apiInterface.verifyOtp(request)
    }

    suspend fun resetPassword(request: ResetPasswordRequest): ForgotPasswordResponse {
        return RetrofitClient.apiInterface.ResetPassword(request)
    }

    suspend fun registerStudent(request: StudentRegistrationRequest): ApiResponse {
        return RetrofitClient.apiInterface.registerStudent(request)
    }

    suspend fun registerEmployer(request: EmployerRegistrationRequest): ApiResponse {
        return RetrofitClient.apiInterface.registerEmployer(request)
    }

    suspend fun updateEmail(request: UpdateEmailRequest): ApiResponse {
        return RetrofitClient.apiInterface.updateEmail(request)
    }

    suspend fun updatePassword(request: UpdatePasswordRequest): ApiResponse {
        return RetrofitClient.apiInterface.updatePassword(request)
    }

    suspend fun logout(userId: String): ApiResponse {
        return RetrofitClient.apiInterface.logout(userId)
    }
}
