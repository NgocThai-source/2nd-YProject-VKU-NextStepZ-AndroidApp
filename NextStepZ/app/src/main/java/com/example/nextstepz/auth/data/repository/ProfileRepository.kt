package com.example.nextstepz.auth.data.repository

import android.content.Context
import com.example.nextstepz.auth.data.model.CompleteProfileRequest
import com.example.nextstepz.auth.data.model.ProvinceListResponse
import com.example.nextstepz.auth.data.model.SimpleResponse
import com.example.nextstepz.auth.data.model.UniversityListResponse
import com.example.nextstepz.auth.data.model.UpdateEmailRequest
import com.example.nextstepz.auth.data.model.UpdatePasswordRequest
import com.example.nextstepz.auth.data.remote.RetrofitClientAuth

class ProfileRepository(private val context: Context) {
    suspend fun getProvinces(): ProvinceListResponse {
        return RetrofitClientAuth.getApiInterface(context).getProvinces()
    }

    suspend fun getUniversitiesByProvince(provinceCode: Int): UniversityListResponse {
        return RetrofitClientAuth.getApiInterface(context).getUniversitiesByProvince(provinceCode)
    }

    suspend fun completeProfile(profileId: String, request: CompleteProfileRequest): SimpleResponse {
        return RetrofitClientAuth.getApiInterface(context).completeProfile(profileId, request)
    }

    suspend fun updateEmail(request: UpdateEmailRequest): SimpleResponse {
        return RetrofitClientAuth.getApiInterface(context).updateEmail(request)
    }

    suspend fun updatePassword(request: UpdatePasswordRequest): SimpleResponse {
        return RetrofitClientAuth.getApiInterface(context).updatePassword(request)
    }

    suspend fun logout(userId: String): SimpleResponse {
        return RetrofitClientAuth.getApiInterface(context).logout(userId)
    }
}