package com.example.nextstepz.auth.data.repository

import com.example.nextstepz.auth.data.model.LoginRequest
import com.example.nextstepz.auth.data.model.LoginResponse
import com.example.nextstepz.auth.data.model.RegisterRequest
import com.example.nextstepz.auth.data.model.RegisterResponse
import com.example.nextstepz.auth.data.remote.RetrofitClient


class AuthRepository {
    suspend fun register(request: RegisterRequest): RegisterResponse {
        return RetrofitClient.apiInterface.register(request)
    }
    suspend fun login(request: LoginRequest): LoginResponse {
        return RetrofitClient.apiInterface.login(request)
    }
}