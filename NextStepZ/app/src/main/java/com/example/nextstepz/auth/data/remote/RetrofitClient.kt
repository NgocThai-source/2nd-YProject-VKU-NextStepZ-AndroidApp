package com.example.nextstepz.auth.data.remote
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import com.example.nextstepz.auth.data.remote.AuthApi

object RetrofitClient{
    private const val BASE_URL = "http://10.0.2.2:5000/"
    private val retrofit by lazy {
        Retrofit.Builder().baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    val apiInterface by lazy {
        retrofit.create(AuthApi::class.java)
    }
}