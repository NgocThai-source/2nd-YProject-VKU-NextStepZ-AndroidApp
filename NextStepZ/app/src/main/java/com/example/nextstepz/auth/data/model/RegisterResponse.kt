package com.example.nextstepz.auth.data.model

interface BaseResponse {
    val success: Boolean
    val message: String
}

data class RegisterResponse (
    override val success: Boolean,
    override val message: String,
    val userData: UserData?
): BaseResponse

data class LoginResponse (
    override val success: Boolean,
    override val message: String,
    val token: String? = null,
    val userData: UserData? = null
): BaseResponse

data class ForgotPasswordResponse (
    override val success: Boolean,
    override val message: String,
): BaseResponse


data class UserData (
    val userId: String,
    val name: String,
    val email: String,
)