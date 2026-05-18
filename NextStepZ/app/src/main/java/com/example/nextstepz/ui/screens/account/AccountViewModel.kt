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
        userName = tokenManager.userName ?: ""
        userEmail = tokenManager.userEmail ?: ""
        userPhone = tokenManager.userPhone ?: ""
        userRole = UserRole.fromValue(tokenManager.userRole)
        isVerified = tokenManager.isVerified
    }

    fun updateAfterStudentRegistration(
        profile: StudentProfileUi,
        tokenManager: TokenManager
    ) {
        userRole = UserRole.STUDENT
        studentProfile = profile
        employerProfile = null

        userName = profile.fullName
        userEmail = profile.email
        userPhone = profile.phone

        tokenManager.userRole = UserRole.STUDENT.value
        tokenManager.userName = profile.fullName
        tokenManager.userEmail = profile.email
        tokenManager.userPhone = profile.phone
        tokenManager.university = profile.universityName
        tokenManager.major = profile.major
    }

    fun updateAfterEmployerRegistration(
        profile: EmployerProfileUi,
        tokenManager: TokenManager
    ) {
        userRole = UserRole.EMPLOYER
        employerProfile = profile
        studentProfile = null

        userName = profile.employerName
        userEmail = profile.email
        userPhone = profile.phone

        tokenManager.userRole = UserRole.EMPLOYER.value
        tokenManager.userName = profile.employerName
        tokenManager.userEmail = profile.email
        tokenManager.userPhone = profile.phone
    }

    fun openLogoutDialog() {
        showLogoutDialog = true
    }

    fun dismissLogoutDialog() {
        showLogoutDialog = false
    }
}