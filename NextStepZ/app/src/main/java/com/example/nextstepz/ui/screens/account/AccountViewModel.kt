package com.example.nextstepz.ui.screens.account

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.example.nextstepz.auth.data.local.TokenManager
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

    var showLogoutDialog by mutableStateOf(false)
        private set

    fun loadUserData(tokenManager: TokenManager) {
        userName = tokenManager.userName ?: ""
        userEmail = tokenManager.userEmail ?: ""
        userPhone = tokenManager.userPhone ?: ""
        userRole = UserRole.fromValue(tokenManager.userRole)
        isVerified = tokenManager.isVerified
    }

    fun updateAfterRegistration(role: UserRole) {
        userRole = role
    }

    fun openLogoutDialog() {
        showLogoutDialog = true
    }

    fun dismissLogoutDialog() {
        showLogoutDialog = false
    }
}
