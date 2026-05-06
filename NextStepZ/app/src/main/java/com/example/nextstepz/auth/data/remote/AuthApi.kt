package com.example.nextstepz.auth.data.remote

import com.example.nextstepz.auth.data.model.LoginRequest
import com.example.nextstepz.auth.data.model.LoginResponse
import retrofit2.http.POST
import retrofit2.http.Body
import retrofit2.Response
import com.example.nextstepz.auth.data.model.RegisterResponse
import com.example.nextstepz.auth.data.model.RegisterRequest

interface AuthApi {
    @POST("api/auth/register")
    suspend fun register(@Body registerRequest: RegisterRequest): RegisterResponse
    @POST("api/auth/login")
    suspend fun login(@Body loginRequest: LoginRequest): LoginResponse
}
