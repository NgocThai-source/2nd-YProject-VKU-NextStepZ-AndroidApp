import android.content.Context
import com.example.nextstepz.feeds.applications.data.model.JobApplicationsResponse
import com.example.nextstepz.feeds.applications.data.model.UpdateStatusRequest
import com.example.nextstepz.feeds.applications.data.remote.RetrofitClientApplication

class ApplicationRepository (private val context: Context) {
    suspend fun getJobApplication(jobId: String?): JobApplicationsResponse {
        return RetrofitClientApplication.getApiInterface(context).getJobApplications(jobId)
    }

    suspend fun getAllEmployerApplications(): JobApplicationsResponse {
        return RetrofitClientApplication.getApiInterface(context).getAllEmployerApplications()
    }

    suspend fun updateApplicationStatus(applicationId: String?, status: String) : JobApplicationsResponse {
        return RetrofitClientApplication.getApiInterface(context).updateApplicationStatus(applicationId,
            UpdateStatusRequest(status)
        )
    }
}