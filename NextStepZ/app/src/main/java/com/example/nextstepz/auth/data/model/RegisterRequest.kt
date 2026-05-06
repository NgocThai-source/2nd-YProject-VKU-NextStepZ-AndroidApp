package com.example.nextstepz.auth.data.model

data class RegisterRequest (
    val fullName: String,
    val email: String,
    val password: String,
)
data class LoginRequest (
    val email: String,
    val password: String,
)