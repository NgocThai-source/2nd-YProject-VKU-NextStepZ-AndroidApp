package com.example.nextstepz.posthistory.data.repository

import com.example.nextstepz.posthistory.data.model.JobApproval
import com.example.nextstepz.posthistory.data.model.JobHistoryItem
import com.example.nextstepz.posthistory.data.model.PostHistoryItem
import com.example.nextstepz.posthistory.data.model.PostVisibility
import com.example.nextstepz.posthistory.data.remote.JobHistoryDto
import com.example.nextstepz.posthistory.data.remote.PostHistoryClient
import com.example.nextstepz.posthistory.data.remote.PostHistoryDto

class PostHistoryRepository {

    private val api = PostHistoryClient.api

    suspend fun getPosts(userId: String): List<PostHistoryItem> =
        api.getPosts(authorId = "eq.$userId", select = POST_SELECT).map { it.toItem() }

    suspend fun getJobs(userId: String): List<JobHistoryItem> =
        api.getJobs(employerId = "eq.$userId", select = JOB_SELECT).map { it.toItem() }

    companion object {
        private const val POST_SELECT =
            "id,content,type,created_at,like_count,comment_count,status"
        private const val JOB_SELECT =
            "id,title,status,created_at,salary_min,salary_max,application_count,deadline,job_type"
    }
}

private fun jobTypeLabel(raw: String?): String = when (raw) {
    "FullTime" -> "Toàn thời gian"
    "PartTime" -> "Bán thời gian"
    "Internship" -> "Thực tập"
    "Remote" -> "Từ xa"
    "Freelance" -> "Freelance"
    else -> raw ?: "—"
}

private fun String?.toDate(): String {
    if (this.isNullOrBlank()) return ""
    return try {
        val date = substringBefore('T')
        val time = substringAfter('T').take(5)
        val p = date.split("-")
        if (p.size == 3) "$time · ${p[2]}/${p[1]}/${p[0]}" else this
    } catch (e: Exception) {
        this
    }
}

private fun PostHistoryDto.toItem() = PostHistoryItem(
    id = id,
    content = content?.takeIf { it.isNotBlank() } ?: "(Không có nội dung)",
    type = type ?: "Bài viết",
    dateLabel = createdAt.toDate(),
    likeCount = likeCount ?: 0,
    commentCount = commentCount ?: 0,
    visibility = PostVisibility.fromDb(status),
)

private fun JobHistoryDto.toItem(): JobHistoryItem {
    val salary = when {
        salaryMin != null && salaryMax != null -> "$salaryMin - $salaryMax triệu/tháng"
        salaryMin != null -> "Từ $salaryMin triệu/tháng"
        salaryMax != null -> "Đến $salaryMax triệu/tháng"
        else -> "Thỏa thuận"
    }
    return JobHistoryItem(
        id = id,
        title = title ?: "(Không tiêu đề)",
        salaryText = salary,
        jobType = jobTypeLabel(jobType),
        deadline = deadline ?: "—",
        applicationCount = applicationCount ?: 0,
        dateLabel = createdAt.toDate(),
        approval = JobApproval.fromDb(status),
    )
}
