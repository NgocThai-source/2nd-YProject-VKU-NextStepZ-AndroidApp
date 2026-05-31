package com.example.nextstepz.auth.data.repository

import android.content.Context
import com.example.nextstepz.auth.data.model.ForgotPasswordRequest
import com.example.nextstepz.auth.data.model.ForgotPasswordResponse
import com.example.nextstepz.auth.data.model.LoginRequest
import com.example.nextstepz.auth.data.model.LoginResponse
import com.example.nextstepz.auth.data.model.RegisterRequest
import com.example.nextstepz.auth.data.model.RegisterResponse
import com.example.nextstepz.auth.data.model.ResetPasswordRequest
import com.example.nextstepz.auth.data.model.VerifyOtpRequest
import com.example.nextstepz.auth.data.remote.RetrofitClient
import com.example.nextstepz.auth.data.remote.RetrofitClientPost


class AuthRepository(private  val context: Context) {
    suspend fun register(request: RegisterRequest): RegisterResponse {
        return RetrofitClient.getApiInterface(context).register(request)
    }
    suspend fun login(request: LoginRequest): LoginResponse {

        val response = RetrofitClient.getApiInterface(context).login(request)
        if(response.success && !response.token.isNullOrEmpty()){
            val sharedPreferences = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
            sharedPreferences.edit().putString("ACCESS_TOKEN", response.token).apply()
        }
        return response
    }
    suspend fun forgotPassword(request: ForgotPasswordRequest): ForgotPasswordResponse {
        return RetrofitClient.getApiInterface(context).forgotPassword(request)
    }

    suspend fun verifyOtp(request: VerifyOtpRequest): ForgotPasswordResponse {
        return RetrofitClient.getApiInterface(context).verifyOtp(request)
    }

    suspend fun resetPassword(request: ResetPasswordRequest): ForgotPasswordResponse {
        return RetrofitClient.getApiInterface(context).ResetPassword(request)
    }
}