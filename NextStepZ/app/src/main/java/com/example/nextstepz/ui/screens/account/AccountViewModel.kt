package com.example.nextstepz.ui.screens.account

import android.app.Application
import androidx.compose.runtime.State
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.account.data.EmployerApprovalRepository
import com.example.nextstepz.auth.data.local.TokenManager
import com.example.nextstepz.auth.data.model.EmployerProfileUi
import com.example.nextstepz.auth.data.model.StudentProfileUi
import com.example.nextstepz.auth.data.model.UserRole
import com.example.nextstepz.feeds.jobs.viewmodel.JobsUiState
import kotlinx.coroutines.launch

class AccountViewModel(application: Application) : AndroidViewModel(application) {

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

    /** "pending" | "approved" | "rejected" | null (not an employer applicant). */
    var employerStatus by mutableStateOf<String?>(null)
        private set

    var showLogoutDialog by mutableStateOf(false)
        private set
    private val tokenManager = TokenManager(application)
    val role = tokenManager.userRole
    fun loadUserData(tokenManager: TokenManager) {
        userName = tokenManager.userName ?: "Người dùng"

        // Luôn lấy email đăng ký tài khoản
        userEmail = tokenManager.userEmail ?: ""

        userPhone = tokenManager.userPhone ?: ""
        userRole = UserRole.fromValue(tokenManager.userRole)
        isVerified = tokenManager.isVerified
        employerStatus = tokenManager.employerStatus

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
        // Registration is pending admin approval — the Employer role is NOT
        // granted yet. The account stays a guest until an admin approves.
        userRole = UserRole.GUEST
        employerStatus = "pending"
        employerProfile = null
        studentProfile = null

        userPhone = profile.phone
        userEmail = tokenManager.userEmail ?: ""

        tokenManager.saveEmployerProfile(profile)
    }

    /**
     * Reflects an admin's Approve/Reject decision by reading employers.status
     * from Supabase, so the role updates without forcing a re-login.
     */
    fun syncEmployerApproval(tokenManager: TokenManager) {
        val uid = tokenManager.userId?.takeIf { it.isNotBlank() } ?: return
        viewModelScope.launch {
            val status = EmployerApprovalRepository.fetchStatus(uid) ?: return@launch
            when (status.lowercase()) {
                "approved" -> tokenManager.markEmployerApproved()
                "rejected" -> tokenManager.markEmployerRejected()
                "pending" -> {
                    tokenManager.employerStatus = "pending"
                    if (tokenManager.userRole == "employer") tokenManager.userRole = "guest"
                }
            }
            loadUserData(tokenManager)
        }
    }

    fun openLogoutDialog() {
        showLogoutDialog = true
    }

    fun dismissLogoutDialog() {
        showLogoutDialog = false
    }
}