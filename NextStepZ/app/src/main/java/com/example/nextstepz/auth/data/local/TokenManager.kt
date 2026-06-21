package com.example.nextstepz.auth.data.local

import android.content.Context
import android.content.SharedPreferences
import androidx.core.content.edit
import com.example.nextstepz.auth.data.model.EmployerProfileUi
import com.example.nextstepz.auth.data.model.StudentProfileUi

class TokenManager(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

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

    var contactEmail: String?
        get() = prefs.getString(KEY_CONTACT_EMAIL, null)
        set(value) = prefs.edit { putString(KEY_CONTACT_EMAIL, value) }

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

    // Student profile
    var studentFullName: String?
        get() = prefs.getString(KEY_STUDENT_FULL_NAME, null)
        set(value) = prefs.edit { putString(KEY_STUDENT_FULL_NAME, value) }

    var studentDob: String?
        get() = prefs.getString(KEY_STUDENT_DOB, null)
        set(value) = prefs.edit { putString(KEY_STUDENT_DOB, value) }

    var provinceName: String?
        get() = prefs.getString(KEY_PROVINCE_NAME, null)
        set(value) = prefs.edit { putString(KEY_PROVINCE_NAME, value) }

    var universityName: String?
        get() = prefs.getString(KEY_UNIVERSITY_NAME, null)
        set(value) = prefs.edit { putString(KEY_UNIVERSITY_NAME, value) }

    var major: String?
        get() = prefs.getString(KEY_MAJOR, null)
        set(value) = prefs.edit { putString(KEY_MAJOR, value) }

    var graduationYear: String?
        get() = prefs.getString(KEY_GRADUATION_YEAR, null)
        set(value) = prefs.edit { putString(KEY_GRADUATION_YEAR, value) }

    var gpa: String?
        get() = prefs.getString(KEY_GPA, null)
        set(value) = prefs.edit { putString(KEY_GPA, value) }

    // Employer profile
    var companyName: String?
        get() = prefs.getString(KEY_COMPANY_NAME, null)
        set(value) = prefs.edit { putString(KEY_COMPANY_NAME, value) }

    var companyAddress: String?
        get() = prefs.getString(KEY_COMPANY_ADDRESS, null)
        set(value) = prefs.edit { putString(KEY_COMPANY_ADDRESS, value) }

    var employerName: String?
        get() = prefs.getString(KEY_EMPLOYER_NAME, null)
        set(value) = prefs.edit { putString(KEY_EMPLOYER_NAME, value) }

    var taxCode: String?
        get() = prefs.getString(KEY_TAX_CODE, null)
        set(value) = prefs.edit { putString(KEY_TAX_CODE, value) }

    var industry: String?
        get() = prefs.getString(KEY_INDUSTRY, null)
        set(value) = prefs.edit { putString(KEY_INDUSTRY, value) }

    fun saveStudentProfile(profile: StudentProfileUi) {
        prefs.edit {
            putString(KEY_USER_NAME, profile.fullName)
            putString(KEY_USER_PHONE, profile.phone)
            putString(KEY_USER_ROLE, "student")

            putString(KEY_CONTACT_EMAIL, profile.email)

            putString(KEY_STUDENT_FULL_NAME, profile.fullName)
            putString(KEY_STUDENT_DOB, profile.dob)
            putString(KEY_PROVINCE_NAME, profile.provinceName)
            putString(KEY_UNIVERSITY_NAME, profile.universityName)
            putString(KEY_MAJOR, profile.major)
            putString(KEY_GRADUATION_YEAR, profile.graduationYear)
            putString(KEY_GPA, profile.gpa)

            remove(KEY_COMPANY_NAME)
            remove(KEY_COMPANY_ADDRESS)
            remove(KEY_EMPLOYER_NAME)
            remove(KEY_TAX_CODE)
            remove(KEY_INDUSTRY)
        }
    }

    fun saveEmployerProfile(profile: EmployerProfileUi) {
        prefs.edit {
            putString(KEY_USER_NAME, profile.employerName)
            putString(KEY_USER_PHONE, profile.phone)
            putString(KEY_USER_ROLE, "employer")

            putString(KEY_CONTACT_EMAIL, profile.email)

            putString(KEY_COMPANY_NAME, profile.companyName)
            putString(KEY_COMPANY_ADDRESS, profile.companyAddress)
            putString(KEY_EMPLOYER_NAME, profile.employerName)
            putString(KEY_TAX_CODE, profile.taxCode)
            putString(KEY_INDUSTRY, profile.industry)

            remove(KEY_STUDENT_FULL_NAME)
            remove(KEY_STUDENT_DOB)
            remove(KEY_PROVINCE_NAME)
            remove(KEY_UNIVERSITY_NAME)
            remove(KEY_MAJOR)
            remove(KEY_GRADUATION_YEAR)
            remove(KEY_GPA)
        }
    }
    fun saveGuestProfile() {
        prefs.edit {
            // Xóa sạch token và dữ liệu cá nhân
            clear()

            // Chỉ lưu lại role là guest
            putString(KEY_USER_ROLE, "guest")
        }
    }
    fun isLoggedIn(): Boolean = !token.isNullOrBlank()

    fun isGuest(): Boolean {
        // Là Guest nếu chưa đăng nhập, hoặc role được set rõ ràng là "guest", hoặc role bị rỗng
        return !isLoggedIn() || userRole == "guest" || userRole.isNullOrBlank()
    }

    fun clearAll() {
        prefs.edit { clear() }
    }

    companion object {
        private const val PREFS_NAME = "nextstepz_auth"

        private const val KEY_TOKEN = "auth_token"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USER_NAME = "user_name"
        private const val KEY_USER_EMAIL = "user_email"
        private const val KEY_CONTACT_EMAIL = "contact_email"
        private const val KEY_USER_PHONE = "user_phone"
        private const val KEY_USER_ROLE = "user_role"
        private const val KEY_IS_VERIFIED = "is_verified"
        private const val KEY_USER_AVATAR = "user_avatar"

        private const val KEY_STUDENT_FULL_NAME = "student_full_name"
        private const val KEY_STUDENT_DOB = "student_dob"
        private const val KEY_PROVINCE_NAME = "province_name"
        private const val KEY_UNIVERSITY_NAME = "university_name"
        private const val KEY_MAJOR = "major"
        private const val KEY_GRADUATION_YEAR = "graduation_year"
        private const val KEY_GPA = "gpa"

        private const val KEY_COMPANY_NAME = "company_name"
        private const val KEY_COMPANY_ADDRESS = "company_address"
        private const val KEY_EMPLOYER_NAME = "employer_name"
        private const val KEY_TAX_CODE = "tax_code"
        private const val KEY_INDUSTRY = "industry"
    }
}