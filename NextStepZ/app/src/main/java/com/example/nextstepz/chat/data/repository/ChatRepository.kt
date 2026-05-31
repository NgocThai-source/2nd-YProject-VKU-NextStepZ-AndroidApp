package com.example.nextstepz.chat.data.repository

import android.content.Context
import com.example.nextstepz.auth.data.remote.RetrofitClientAuth
import com.example.nextstepz.auth.data.remote.RetrofitClientChat
import com.example.nextstepz.chat.data.model.ConversationResponse
import com.example.nextstepz.chat.data.model.CreateConversationRequest
import com.example.nextstepz.chat.data.model.CreateConversationResponse
import com.example.nextstepz.chat.data.model.MessageResponse

class ChatRepository(private val context: Context) {
    private val chatApi = RetrofitClientChat.getApiInterface(context)

    suspend fun getConversations(profileId: String): Result<ConversationResponse> {
        return try {
            val response = chatApi.getConversations(profileId)
            if (response.success) {
                Result.success(response)
            } else {
                Result.failure(Exception(response.message))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getMessages(conversationId: String, page: Int = 1, limit: Int = 50): Result<MessageResponse> {
        return try {
            val response = chatApi.getMessages(conversationId, page, limit)
            if (response.success) {
                Result.success(response)
            } else {
                Result.failure(Exception(response.message))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createOrGetConversation(myProfileId: String, partnerProfileId: String): Result<CreateConversationResponse> {
        return try {
            val response = chatApi.createOrGetConversation(
                CreateConversationRequest(myProfileId, partnerProfileId)
            )
            if (response.success) {
                Result.success(response)
            } else {
                Result.failure(Exception(response.message))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
