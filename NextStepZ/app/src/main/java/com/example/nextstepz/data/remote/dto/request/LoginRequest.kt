package com.example.nextstepz.data.remote.dto.request

import com.google.gson.annotations.SerializedName

// Login Request DTO - Body gui len API /auth/login
data class LoginRequest(
    @SerializedName("emailOrPhone")
    val emailOrPhone: String,

    @SerializedName("password")
    val password: String
)
