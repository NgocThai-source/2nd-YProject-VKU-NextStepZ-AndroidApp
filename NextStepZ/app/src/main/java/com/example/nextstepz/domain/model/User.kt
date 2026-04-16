package com.example.nextstepz.domain.model

// User Domain Model - Thong tin nguoi dung
data class User(
    val id: String,
    val email: String,
    val firstName: String?,
    val lastName: String?,
    val phone: String?,
    val avatar: String?,
    val role: String,
    val birthDate: String?,
    val province: String?,
    val school: String?,
    val major: String?,
    val companyName: String?,
    val website: String?,
    val address: String?,
    val taxId: String?
) {
    val fullName: String
        get() = listOfNotNull(firstName, lastName).joinToString(" ").ifEmpty { email.substringBefore("@") }

    val username: String
        get() = firstName ?: email.substringBefore("@")

    val isEmployer: Boolean
        get() = role == "employer"
}
