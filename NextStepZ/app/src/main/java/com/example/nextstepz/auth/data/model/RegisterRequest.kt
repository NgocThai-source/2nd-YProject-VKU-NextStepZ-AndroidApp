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
data class ForgotPasswordRequest (
    val email: String,
)
data class VerifyOtpRequest (
    val email: String,
    val otp: String,
)
data class ResetPasswordRequest (
    val email: String,
    val newPassword: String,
)