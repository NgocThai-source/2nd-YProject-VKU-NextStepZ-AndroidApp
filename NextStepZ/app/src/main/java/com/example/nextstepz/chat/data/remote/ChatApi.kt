package com.example.nextstepz.chat.data.remote

import com.example.nextstepz.chat.data.model.ConversationResponse
import com.example.nextstepz.chat.data.model.CreateConversationRequest
import com.example.nextstepz.chat.data.model.CreateConversationResponse
import com.example.nextstepz.chat.data.model.MessageResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ChatApi {
    @GET("api/chat/conversations/{profileId}")
    suspend fun getConversations(
        @Path("profileId") profileId: String
    ): ConversationResponse

    @GET("api/chat/messages/{conversationId}")
    suspend fun getMessages(
        @Path("conversationId") conversationId: String,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 50
    ): MessageResponse

    @POST("api/chat/create-conversations")
    suspend fun createOrGetConversation(
        @Body request: CreateConversationRequest
    ): CreateConversationResponse
}