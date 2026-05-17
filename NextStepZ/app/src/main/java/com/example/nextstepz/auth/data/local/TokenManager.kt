package com.example.nextstepz.auth.data.local

import android.content.Context
import android.content.SharedPreferences
import androidx.core.content.edit

class TokenManager(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    var token: String?
        get() = prefs.getString(KEY_TOKEN, null)
        set(value) = prefs.edit { putString(KEY_TOKEN, value) }

    var userId: String?
        get() = prefs.getString(KEY_USER_ID, null)
        set(value) = prefs.edit { putString(KEY_USER_ID, value) }

    var userName: String?
        get() = prefs.getString(KEY_USER_NAME, null)
        set(value) = prefs.edit { putString(KEY_USER_NAME, value) }

    var userEmail: String?
        get() = prefs.getString(KEY_USER_EMAIL, null)
        set(value) = prefs.edit { putString(KEY_USER_EMAIL, value) }

    var userPhone: String?
        get() = prefs.getString(KEY_USER_PHONE, null)
        set(value) = prefs.edit { putString(KEY_USER_PHONE, value) }

    var userRole: String?
        get() = prefs.getString(KEY_USER_ROLE, null)
        set(value) = prefs.edit { putString(KEY_USER_ROLE, value) }

    var isVerified: Boolean
        get() = prefs.getBoolean(KEY_IS_VERIFIED, false)
        set(value) = prefs.edit { putBoolean(KEY_IS_VERIFIED, value) }

    var userAvatar: String?
        get() = prefs.getString(KEY_USER_AVATAR, null)
        set(value) = prefs.edit { putString(KEY_USER_AVATAR, value) }

    var university: String?
        get() = prefs.getString(KEY_UNIVERSITY, null)
        set(value) = prefs.edit { putString(KEY_UNIVERSITY, value) }

    var major: String?
        get() = prefs.getString(KEY_MAJOR, null)
        set(value) = prefs.edit { putString(KEY_MAJOR, value) }

    fun isLoggedIn(): Boolean = !token.isNullOrBlank()

    fun clearAll() {
        prefs.edit { clear() }
    }

    companion object {
        private const val PREFS_NAME = "nextstepz_auth"
        private const val KEY_TOKEN = "auth_token"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USER_NAME = "user_name"
        private const val KEY_USER_EMAIL = "user_email"
        private const val KEY_USER_PHONE = "user_phone"
        private const val KEY_USER_ROLE = "user_role"
        private const val KEY_IS_VERIFIED = "is_verified"
        private const val KEY_USER_AVATAR = "user_avatar"
        private const val KEY_UNIVERSITY = "university"
        private const val KEY_MAJOR = "major"
    }
}
