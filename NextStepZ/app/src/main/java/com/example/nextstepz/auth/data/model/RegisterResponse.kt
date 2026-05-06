package com.example.nextstepz.auth.data.model

data class RegisterResponse (
    val success: Boolean,
    val message: String,
    val userData: UserData?
)

data class LoginResponse (
    val success: Boolean,
    val message: String,
    val token: String? = null,
    val userData: UserData? = null
)
data class UserData (
    val userId: String,
    val name: String,
    val email: String,
)