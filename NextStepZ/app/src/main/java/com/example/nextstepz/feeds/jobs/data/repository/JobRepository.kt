import android.content.Context
import com.example.nextstepz.feeds.jobs.data.model.CreateJobRequest
import com.example.nextstepz.feeds.jobs.data.model.JobFilterParams
import com.example.nextstepz.feeds.jobs.data.model.JobResponse
import com.example.nextstepz.feeds.jobs.data.model.JobsResponse
import com.example.nextstepz.feeds.jobs.data.model.ReportJobRequest
import com.example.nextstepz.feeds.jobs.data.model.SaveJobResponse
import com.example.nextstepz.feeds.jobs.data.remote.RetrofitClientJob

class JobRepository (
    private val context: Context
){
    suspend fun createJob(request: CreateJobRequest): JobResponse {
        return RetrofitClientJob.getApiInterface(context).createJob(request)
    }

    suspend fun getJobs(params: JobFilterParams,savedOnly: Boolean = false): JobsResponse {
        return RetrofitClientJob.getApiInterface(context).getJobs(
            page = params.page,
            limit = params.limit,
            jobType = params.jobType?.label,
            keyword = params.keyword,
            savedOnly = savedOnly
        )
    }

    suspend fun getJobById(id: String): JobResponse {
        return RetrofitClientJob.getApiInterface(context).getJobById(id)
    }

    suspend fun reportJob(jobId: String, reason: String, customText: String? = null): SaveJobResponse {
        val request = ReportJobRequest(reason, customText)
        return RetrofitClientJob.getApiInterface(context).reportJob(jobId, request)
    }

    suspend fun saveJob(jobId: String): SaveJobResponse {
        return RetrofitClientJob.getApiInterface(context).saveJob(jobId)
    }

    suspend fun unSaveJob(jobId: String): SaveJobResponse {
        return RetrofitClientJob.getApiInterface(context).unsaveJob(jobId)
    }

    suspend fun applyJob(jobId: String): SaveJobResponse {
        return RetrofitClientJob.getApiInterface(context).applyJob(jobId)
    }
}
