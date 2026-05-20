package com.example.nextstepz.auth.data.remote

object RetrofitClient {
    private const val BASE_URL = "http://10.0.2.2:5000/"
    private val retrofit by lazy {
        retrofit2.Retrofit.Builder().baseUrl(BASE_URL)
            .addConverterFactory(retrofit2.converter.gson.GsonConverterFactory.create())
            .build()
    }
    val apiInterface by lazy {
        retrofit.create(AuthApi::class.java)
    }
    val chatApi by lazy {
        retrofit.create(ChatApi::class.java)
    }
}
