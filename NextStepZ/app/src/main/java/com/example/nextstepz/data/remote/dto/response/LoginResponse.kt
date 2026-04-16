package com.example.nextstepz.data.remote.dto.response

import com.google.gson.annotations.SerializedName

// Login Response DTO - Du lieu tra ve tu API /auth/login
data class LoginResponse(
    @SerializedName("accessToken")
    val accessToken: String,

    @SerializedName("id")
    val id: String,

    @SerializedName("email")
    val email: String,

    @SerializedName("firstName")
    val firstName: String?,

    @SerializedName("lastName")
    val lastName: String?,

    @SerializedName("phone")
    val phone: String?,

    @SerializedName("avatar")
    val avatar: String?,

    @SerializedName("role")
    val role: String,

    @SerializedName("birthDate")
    val birthDate: String?,

    @SerializedName("province")
    val province: String?,

    @SerializedName("school")
    val school: String?,

    @SerializedName("major")
    val major: String?,

    @SerializedName("companyName")
    val companyName: String?,

    @SerializedName("website")
    val website: String?,

    @SerializedName("address")
    val address: String?,

    @SerializedName("taxId")
    val taxId: String?
)
