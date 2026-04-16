package com.example.nextstepz.data.repository

import com.example.nextstepz.data.remote.RetrofitClient
import com.example.nextstepz.data.remote.api.AuthApi
import com.example.nextstepz.data.remote.dto.request.LoginRequest
import com.example.nextstepz.data.remote.dto.response.LoginResponse

// Auth Repository
// Lop trung gian giua ViewModel va API.
class AuthRepository {

    private val authApi: AuthApi = RetrofitClient.instance.create(AuthApi::class.java)

    // Dang nhap voi email/phone + password.
    suspend fun login(emailOrPhone: String, password: String): LoginResponse? {
        return try {
            val response = authApi.login(LoginRequest(emailOrPhone, password))
            if (response.isSuccessful) {
                response.body()
            } else {
                val errorMessage = when (response.code()) {
                    401 -> "Tai khoan hoac mat khau khong chinh xac"
                    403 -> "Tai khoan da bi khoa"
                    404 -> "Tai khoan khong ton tai"
                    else -> "Da xay ra loi (${response.code()})"
                }
                throw Exception(errorMessage)
            }
        } catch (e: Exception) {
            throw e
        }
    }
}
