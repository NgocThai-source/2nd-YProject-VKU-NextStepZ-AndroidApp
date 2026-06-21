package com.example.nextstepz.account.data

import android.util.Log
import com.example.nextstepz.notifications.data.remote.NotificationSupabaseConfig
import com.google.gson.annotations.SerializedName
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Query

/**
 * Reads the current user's employer approval state straight from the Supabase
 * `employers.status` column so the app reflects an admin's Approve/Reject
 * decision without forcing a re-login. Returns the raw status
 * ("Pending" | "Approved" | "Rejected") or null when there is no employer row.
 */
object EmployerApprovalRepository {

    private data class StatusDto(@SerializedName("status") val status: String? = null)

    private interface Api {
        @GET("rest/v1/employers")
        suspend fun getStatus(
            @Query(value = "profile_id", encoded = true) profileId: String,
            @Query(value = "select", encoded = true) select: String = "status",
        ): List<StatusDto>
    }

    private val api: Api by lazy {
        val authInterceptor = okhttp3.Interceptor { chain ->
            val request = chain.request().newBuilder()
                .addHeader("apikey", NotificationSupabaseConfig.API_KEY)
                .addHeader("Authorization", "Bearer ${NotificationSupabaseConfig.API_KEY}")
                .addHeader("Accept", "application/json")
                .build()
            chain.proceed(request)
        }
        val client = OkHttpClient.Builder().addInterceptor(authInterceptor).build()
        Retrofit.Builder()
            .baseUrl(NotificationSupabaseConfig.BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(Api::class.java)
    }

    suspend fun fetchStatus(userId: String): String? = try {
        api.getStatus(profileId = "eq.$userId").firstOrNull()?.status
    } catch (e: Exception) {
        Log.e("EmployerApproval", "fetchStatus error", e)
        null
    }
}
