package com.example.nextstepz.auth.data.model

data class StudentProfileUi(
    val fullName: String,
    val dob: String,
    val email: String,
    val phone: String,
    val provinceName: String,
    val universityName: String,
    val major: String,
    val graduationYear: String,
    val gpa: String
)

data class EmployerProfileUi(
    val companyName: String,
    val companyAddress: String,
    val employerName: String,
    val phone: String,
    val email: String,
    val taxCode: String,
    val industry: String
)