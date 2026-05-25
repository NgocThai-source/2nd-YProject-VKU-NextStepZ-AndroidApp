package com.example.nextstepz.feeds.jobs.data.model

enum class JobType(val label: String, val icon: String) {
    FullTime("Toàn thời gian", "schedule"),
    PartTime("Bán thời gian", "schedule"),
    Internship("Thực tập", "school"),
    Remote("Từ xa", "home"),
    Freelance("Freelance", "work")
}

enum class ExperienceLevel(val label: String) {
    Fresher("Fresher"),
    Junior("Junior"),
    Middle("Middle"),
    Senior("Senior"),
    Manager("Manager")
}

enum class JobCategory(val label: String) {
    All("Tất cả"),
    IT("IT"),
    Finance("Tài chính"),
    Marketing("Marketing"),
    Economics("Kinh tế"),
    Law("Luật"),
    Construction("Xây dựng"),
    Healthcare("Y tế"),
    Education("Giáo dục"),
    Design("Thiết kế")
}

enum class JobSortBy(val label: String) {
    Newest("Mới nhất"),
    SalaryHigh("Lương cao nhất"),
    SalaryLow("Lương thấp nhất"),
    Deadline("Hạn nộp gần nhất")
}

data class Job(
    val id: String,
    val title: String,
    val companyName: String,
    val companyLogo: String? = null,
    val companyAddress: String,
    val location: String,
    val salaryMin: Int? = null,
    val salaryMax: Int? = null,
    val salaryUnit: String = "triệu/tháng",
    val jobType: JobType,
    val experienceLevel: ExperienceLevel,
    val description: String,
    val requirements: List<String> = emptyList(),
    val benefits: List<String> = emptyList(),
    val skills: List<String> = emptyList(),
    val deadline: String,
    val postedAt: String,
    val viewCount: Int = 0,
    val applicationCount: Int = 0,
    val isSaved: Boolean = false,
    val isFeatured: Boolean = false,
    val employerId: String,
    val employerName: String,
    val employerEmail: String = "",
    val employerPhone: String = "",
    val companySize: String? = null,
    val companyIndustry: String? = null,
    val companyWebsite: String? = null
) {
    val salaryDisplay: String
        get() = when {
            salaryMin == null && salaryMax == null -> "Thỏa thuận"
            salaryMin != null && salaryMax != null -> "$salaryMin - $salaryMax $salaryUnit"
            salaryMin != null -> "Từ $salaryMin $salaryUnit"
            else -> "Đến $salaryMax $salaryUnit"
        }

    val daysAgo: Int
        get() {
            return try {
                val posted = java.time.LocalDate.parse(postedAt.take(10))
                java.time.temporal.ChronoUnit.DAYS.between(posted, java.time.LocalDate.now()).toInt()
            } catch (e: Exception) {
                0
            }
        }

    val postedDisplay: String
        get() = when (daysAgo) {
            0 -> "Hôm nay"
            1 -> "Hôm qua"
            in 2..6 -> "$daysAgo ngày trước"
            in 7..29 -> "${daysAgo / 7} tuần trước"
            else -> "$daysAgo ngày trước"
        }
}
