package com.example.nextstepz.ui.screens.account

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.example.nextstepz.auth.data.local.TokenManager
import com.example.nextstepz.auth.data.model.EmployerProfileUi
import com.example.nextstepz.auth.data.model.StudentProfileUi
import com.example.nextstepz.auth.data.model.UserRole

class AccountViewModel : ViewModel() {

    var userName by mutableStateOf("")
        private set

    // Đây là email đăng ký tài khoản
    var userEmail by mutableStateOf("")
        private set

    var userPhone by mutableStateOf("")
        private set

    var userRole by mutableStateOf(UserRole.GUEST)
        private set

    var isVerified by mutableStateOf(false)
        private set

    var studentProfile by mutableStateOf<StudentProfileUi?>(null)
        private set

    var employerProfile by mutableStateOf<EmployerProfileUi?>(null)
        private set

    var showLogoutDialog by mutableStateOf(false)
        private set

    fun loadUserData(tokenManager: TokenManager) {
        userName = tokenManager.userName ?: "Người dùng"

        // Luôn lấy email đăng ký tài khoản
        userEmail = tokenManager.userEmail ?: ""

        userPhone = tokenManager.userPhone ?: ""
        userRole = UserRole.fromValue(tokenManager.userRole)
        isVerified = tokenManager.isVerified

        studentProfile = null
        employerProfile = null

        if (userRole == UserRole.STUDENT) {
            studentProfile = StudentProfileUi(
                fullName = tokenManager.studentFullName ?: userName,
                dob = tokenManager.studentDob ?: "",

                // Email liên hệ trong card thông tin
                email = tokenManager.contactEmail ?: "",

                phone = tokenManager.userPhone ?: "",
                provinceName = tokenManager.provinceName ?: "",
                universityName = tokenManager.universityName ?: "",
                major = tokenManager.major ?: "",
                graduationYear = tokenManager.graduationYear ?: "",
                gpa = tokenManager.gpa ?: ""
            )
        }

        if (userRole == UserRole.EMPLOYER) {
            employerProfile = EmployerProfileUi(
                companyName = tokenManager.companyName ?: "",
                companyAddress = tokenManager.companyAddress ?: "",
                employerName = tokenManager.employerName ?: userName,
                phone = tokenManager.userPhone ?: "",

                // Email liên hệ trong card thông tin
                email = tokenManager.contactEmail ?: "",

                taxCode = tokenManager.taxCode ?: "",
                industry = tokenManager.industry ?: ""
            )
        }
    }

    fun updateAfterStudentRegistration(
        profile: StudentProfileUi,
        tokenManager: TokenManager
    ) {
        userRole = UserRole.STUDENT
        studentProfile = profile
        employerProfile = null

        userName = profile.fullName
        userPhone = profile.phone

        // KHÔNG set userEmail = profile.email
        // Vì profile.email là email liên hệ, không phải email đăng ký tài khoản
        userEmail = tokenManager.userEmail ?: ""

        tokenManager.saveStudentProfile(profile)
    }

    fun updateAfterEmployerRegistration(
        profile: EmployerProfileUi,
        tokenManager: TokenManager
    ) {
        userRole = UserRole.EMPLOYER
        employerProfile = profile
        studentProfile = null

        userName = profile.employerName
        userPhone = profile.phone

        // KHÔNG set userEmail = profile.email
        userEmail = tokenManager.userEmail ?: ""

        tokenManager.saveEmployerProfile(profile)
    }

    fun openLogoutDialog() {
        showLogoutDialog = true
    }

    fun dismissLogoutDialog() {
        showLogoutDialog = false
    }
}