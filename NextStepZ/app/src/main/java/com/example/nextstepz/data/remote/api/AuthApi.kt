package com.example.nextstepz.data.remote.api

import com.example.nextstepz.data.remote.dto.request.LoginRequest
import com.example.nextstepz.data.remote.dto.response.LoginResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

// Auth API Interface
// Endpoints xac thuc nguoi dung - tuong ung backend NestJS: /api/auth/
interface AuthApi {

    // Dang nhap bang email/phone + password.
    // POST /auth/login
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
}
