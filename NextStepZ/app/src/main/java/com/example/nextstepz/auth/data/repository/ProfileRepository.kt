package com.example.nextstepz.auth.data.repository

import com.example.nextstepz.auth.data.model.BaseResponse
import com.example.nextstepz.auth.data.model.CompleteProfileRequest
import com.example.nextstepz.auth.data.model.ProvinceListResponse
import com.example.nextstepz.auth.data.model.SimpleResponse
import com.example.nextstepz.auth.data.model.UniversityListResponse
import com.example.nextstepz.auth.data.model.UpdateEmailRequest
import com.example.nextstepz.auth.data.model.UpdatePasswordRequest
import com.example.nextstepz.auth.data.remote.RetrofitClient

class ProfileRepository {
    suspend fun getProvinces(): ProvinceListResponse {
        return RetrofitClient.apiInterface.getProvinces()
    }

    suspend fun getUniversitiesByProvince(provinceCode: Int): UniversityListResponse {
        return RetrofitClient.apiInterface.getUniversitiesByProvince(provinceCode)
    }

    suspend fun completeProfile(profileId: String, request: CompleteProfileRequest): SimpleResponse {
        return RetrofitClient.apiInterface.completeProfile(profileId, request)
    }

    suspend fun updateEmail(request: UpdateEmailRequest): SimpleResponse {
        return RetrofitClient.apiInterface.updateEmail(request)
    }

    suspend fun updatePassword(request: UpdatePasswordRequest): SimpleResponse {
        return RetrofitClient.apiInterface.updatePassword(request)
    }

    suspend fun logout(userId: String): SimpleResponse {
        return RetrofitClient.apiInterface.logout(userId)
    }
}