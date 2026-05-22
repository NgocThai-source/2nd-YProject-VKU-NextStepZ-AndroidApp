package com.example.nextstepz.feeds.data.repository

import com.example.nextstepz.feeds.data.model.Comment
import com.example.nextstepz.feeds.data.model.Post
import com.example.nextstepz.feeds.data.model.PostType
import com.example.nextstepz.feeds.data.model.UserRole

object MockDataProvider {

    fun getMockPosts(): List<Post> = listOf(
        Post(
            id = "post_1",
            authorId = "user_1",
            authorName = "Nguyễn Ngọc Thái",
            authorAvatar = null,
            authorRole = "Android Developer - VKU",
            type = PostType.Article,
            content = "Vừa hoàn thành xong bài viết về cách tạo một ứng dụng Android thuần Kotlin với Jetpack Compose từ con số 0. Trong bài viết, mình chia sẻ những kiến thức cơ bản nhất như setup project, cách sử dụng các composable function, và cách quản lý state trong Compose. Hy vọng có thể giúp ích cho những bạn đang bắt đầu học Android development.\n\n#AndroidDev #JetpackCompose #Kotlin",
            images = emptyList(),
            skillTags = listOf("Kotlin", "Jetpack Compose", "Android"),
            likeCount = 342,
            commentCount = 28,
            isLiked = false,
            isBookmarked = false,
            createdAt = "2026-05-21T14:30:00Z",
            authorEmail = "nguyenngocthai.job@gmail.com",
            authorPhone = "+84 338 445 343",
            authorUserRole = UserRole.Student,
            comments = listOf(
                Comment(
                    id = "c1",
                    authorName = "Trần Minh Đức",
                    authorAvatar = null,
                    content = "Bài viết rất chi tiết, cảm ơn bạn! Mình đang học Android, bài này giúp mình hiểu rõ hơn về Compose.",
                    createdAt = "2026-05-21T15:00:00Z",
                    likeCount = 12
                ),
                Comment(
                    id = "c2",
                    authorName = "Lê Hoàng Nam",
                    authorAvatar = null,
                    content = "Chia sẻ rất hữu ích. Mình đã làm theo và chạy được ngay. Code sạch và dễ hiểu!",
                    createdAt = "2026-05-21T16:30:00Z",
                    likeCount = 5
                )
            )
        ),
        Post(
            id = "post_2",
            authorId = "user_2",
            authorName = "TechViet Solutions",
            authorAvatar = null,
            authorRole = "Nhà tuyển dụng",
            type = PostType.Job,
            content = "TECHVIET SOLUTIONS TUYỂN DỤNG\n\nChúng tôi đang tìm kiếm 3 Flutter Developer cho dự án mới tại Đà Nẵng.\n\nYêu cầu:\n- Tốt nghiệp hoặc đang học năm 3+ ngành CNTT\n- Có kiến thức về Flutter/Dart\n- Biết sử dụng Firebase là điểm cộng\n- Tiếng Anh đọc hiểu tài liệu\n\nQuyền lợi:\n- Lương: 10-18 triệu/tháng (theo năng lực)\n- Làm việc hybrid, flexible hours\n- Đào tạo chuyên môn, tham gia tech talk\n- BHXH, BHYT đầy đủ\n\nLiên hệ: hr@techviet.vn với subject 'Flutter Developer'\nDeadline: 15/06/2026",
            images = emptyList(),
            skillTags = listOf("Flutter", "Dart", "Firebase"),
            likeCount = 89,
            commentCount = 15,
            isLiked = true,
            isBookmarked = true,
            createdAt = "2026-05-20T09:00:00Z",
            authorEmail = "hr@techviet.vn",
            authorPhone = "+84 236 888 1234",
            authorUserRole = UserRole.Employer,
            comments = listOf(
                Comment(
                    id = "c3",
                    authorName = "Phạm Quốc Huy",
                    authorAvatar = null,
                    content = "Mình ứng tuyển rồi, mong được phản hồi sớm!",
                    createdAt = "2026-05-20T10:30:00Z",
                    likeCount = 3
                )
            )
        ),
        Post(
            id = "post_3",
            authorId = "user_3",
            authorName = "Career Coach Minh",
            authorAvatar = null,
            authorRole = "HR Consultant",
            type = PostType.Tips,
            content = "5 Sai lầm phổ biến khi viết CV mà 90% sinh viên mới ra trường đều mắc phải:\n\n1. Copy y nguyên JD vào CV — NTD đã đọc JD rồi, họ muốn thấy BẠN khác biệt thế nào\n2. CV quá dài — 1-2 trang là đủ, không ai đọc CV 5 trang\n3. Không có kết quả cụ thể — thay 'Tham gia dự án' bằng 'Hoàn thành dự án X, giảm 30% thời gian xử lý'\n4. Dùng chung 1 CV cho tất cả vị trí — Mỗi JD cần một CV riêng\n5. Font lạ, màu sắc rối mắt — Giữ đơn giản, chuyên nghiệp\n\nBạn đang mắc bao nhiêu trong 5 lỗi trên? Để lại comment, mình sẽ review CV cho bạn miễn phí!",
            images = emptyList(),
            skillTags = listOf("CV", "Career Tips", "Interview"),
            likeCount = 567,
            commentCount = 89,
            isLiked = false,
            isBookmarked = true,
            createdAt = "2026-05-19T18:45:00Z",
            authorEmail = "coachminh.hr@gmail.com",
            authorPhone = "+84 901 234 567",
            authorUserRole = UserRole.Guest,
            comments = listOf(
                Comment(
                    id = "c4",
                    authorName = "Hoàng Thị Lan",
                    authorAvatar = null,
                    content = "Mình đang mắc lỗi 1 và 3, cảm ơn coach!",
                    createdAt = "2026-05-19T19:00:00Z",
                    likeCount = 8
                ),
                Comment(
                    id = "c5",
                    authorName = "Võ Đình Khôi",
                    authorAvatar = null,
                    content = "Lỗi 4 mình hay mắc phải, giờ mới biết phải custom CV cho từng vị trí.",
                    createdAt = "2026-05-19T20:15:00Z",
                    likeCount = 6
                )
            )
        ),
        Post(
            id = "post_4",
            authorId = "user_4",
            authorName = "Đoàn Văn Nguyên",
            authorAvatar = null,
            authorRole = "Backend Developer - VKU",
            type = PostType.Story,
            content = "Hành trình 6 tháng từ sinh viên không biết gì về Backend đến khi nhận được offer Intern Backend tại một startup ở Đà Nẵng.\n\nTháng 1: Bắt đầu học Node.js qua freeCodeCamp, mỗi ngày 2 tiếng sau giờ học.\n\nTháng 2: Chuyển sang học theo dự án nhỏ — làm một cái API đơn giản cho bài tập lớn môn CSDL.\n\nTháng 3: Học Express.js, bắt đầu deploy lên Railway.\n\nTháng 4: Nộp 15 application, nhận 3 phỏng vấn, fail hết. Nhưng mỗi lần fail đều học được điều mới.\n\nTháng 5: Tiếp tục học PostgreSQL, Docker cơ bản.\n\nTháng 6: Nhận được offer!\n\nKey takeaway: Đừng chờ đến khi 'sẵn sàng' mới bắt đầu. Just start!",
            images = emptyList(),
            skillTags = listOf("Node.js", "Express", "Backend", "Career"),
            likeCount = 892,
            commentCount = 67,
            isLiked = true,
            isBookmarked = false,
            createdAt = "2026-05-18T21:00:00Z",
            authorEmail = "doanvannguyen.dev@gmail.com",
            authorPhone = "+84 912 345 678",
            authorUserRole = UserRole.Student,
            comments = listOf(
                Comment(
                    id = "c6",
                    authorName = "Bùi Thanh Sơn",
                    authorAvatar = null,
                    content = "Truyền cảm hứng quá! Mình cũng đang ở tháng 2, sẽ cố gắng hơn.",
                    createdAt = "2026-05-18T22:00:00Z",
                    likeCount = 24
                ),
                Comment(
                    id = "c7",
                    authorName = "Trương Thị Hà",
                    authorAvatar = null,
                    content = "Bài chia sẻ rất thật, không hề 'ba hoa'. Cảm ơn bạn!",
                    createdAt = "2026-05-19T08:30:00Z",
                    likeCount = 15
                )
            )
        ),
        Post(
            id = "post_5",
            authorId = "user_5",
            authorName = "HR Community VN",
            authorAvatar = null,
            authorRole = "Cộng đồng Nhân sự",
            type = PostType.Article,
            content = "NHỮNG CÂU HỎI PHỎNG VẤN PHỔ BIẾN VÀ CÁCH TRẢ LỜI HAY NHẤT (Phần 2)\n\n6. 'Bạn thấy mình có điểm yếu gì?'\nCách trả lời hay: Nói điểm yếu thật + đang cải thiện thế nào\n\n7. 'Bạn có thể làm việc dưới áp lực không?'\nCách trả lời hay: Kể một câu chuyện cụ thể.\n\n8. 'Tại sao chúng tôi nên hire bạn?'\nCách trả lời hay: Nói về VALUE bạn mang lại.\n\nTiếp tục theo dõi Phần 3 nhé!",
            images = emptyList(),
            skillTags = listOf("Interview", "Career Tips"),
            likeCount = 423,
            commentCount = 34,
            isLiked = false,
            isBookmarked = false,
            createdAt = "2026-05-17T12:00:00Z",
            authorEmail = "hrcommunity.vn@gmail.com",
            authorPhone = "+84 28 1234 5678",
            authorUserRole = UserRole.Guest,
            comments = listOf(
                Comment(
                    id = "c8",
                    authorName = "Ngô Thị Mai",
                    authorAvatar = null,
                    content = "Câu 6 mình hay bị hỏi, giờ đã biết cách trả lời rồi!",
                    createdAt = "2026-05-17T13:30:00Z",
                    likeCount = 11
                )
            )
        ),
        Post(
            id = "post_6",
            authorId = "user_6",
            authorName = "GameDev Studio",
            authorAvatar = null,
            authorRole = "Nhà tuyển dụng",
            type = PostType.Job,
            content = "GAMEDEV STUDIO TUYỂN GAME DEVELOPER\n\nCông ty game Việt Nam đang mở rộng team, cần tuyển Junior Game Developer.\n\nVị trí: Junior Game Developer (2 người)\nĐịa điểm: Remote / TP.HCM / Đà Nẵng\n\nYêu cầu:\n- Yêu thích game và có đam mê phát triển game\n- Biết Unity (C#) hoặc Godot (GDScript)\n- Hiểu biết về game design patterns\n- Có portfolio game đã làm là lợi thế\n\nQuyền lợi:\n- Lương: 8-15 triệu\n- Được tham gia các khóa học game dev quốc tế\n- Work from anywhere\n\nApply: careers@gamedevstudio.vn",
            images = emptyList(),
            skillTags = listOf("Unity", "C#", "Game Development"),
            likeCount = 156,
            commentCount = 22,
            isLiked = false,
            isBookmarked = false,
            createdAt = "2026-05-16T08:00:00Z",
            authorEmail = "careers@gamedevstudio.vn",
            authorPhone = "+84 236 777 8888",
            authorUserRole = UserRole.Employer,
            comments = listOf(
                Comment(
                    id = "c9",
                    authorName = "Đặng Hoàng Phúc",
                    authorAvatar = null,
                    content = "Mình đang dùng Godot, có gửi portfolio được không?",
                    createdAt = "2026-05-16T09:30:00Z",
                    likeCount = 2
                )
            )
        ),
        Post(
            id = "post_7",
            authorId = "user_7",
            authorName = "Trần Thanh Hà",
            authorAvatar = null,
            authorRole = "Sinh viên CNTT - VKU",
            type = PostType.Tips,
            content = "Tổng hợp FREE RESOURCES để học Data Science cho người mới bắt đầu (2026 update)\n\n1. Python cơ bản — freeCodeCamp Python Course (17 tiếng)\n2. Data Analysis — Kaggle Python Course, Pandas Documentation\n3. Machine Learning — Andrew Ng's ML Course (Stanford - FREE)\n4. SQL — Mode Analytics Tutorial, LeetCode SQL Practice\n5. Data Visualization — Tableau Public (FREE forever)\n6. Projects thực tế — Kaggle Datasets & Competitions\n\nMình đang follow roadmap này và thấy rất hiệu quả. Share cho anh em cùng học nhé!",
            images = emptyList(),
            skillTags = listOf("Data Science", "Python", "Machine Learning", "SQL"),
            likeCount = 734,
            commentCount = 56,
            isLiked = true,
            isBookmarked = true,
            createdAt = "2026-05-15T16:20:00Z",
            authorEmail = "tranthanhha.ds@gmail.com",
            authorPhone = "+84 333 444 555",
            authorUserRole = UserRole.Student,
            comments = listOf(
                Comment(
                    id = "c10",
                    authorName = "Lê Đình Phong",
                    authorAvatar = null,
                    content = "Cảm ơn bạn! Mình đang cần tài liệu ML, sẽ follow ngay.",
                    createdAt = "2026-05-15T17:00:00Z",
                    likeCount = 18
                ),
                Comment(
                    id = "c11",
                    authorName = "Phạm Thị Thu",
                    authorAvatar = null,
                    content = "Andrew Ng course miễn phí trên Coursera đúng không?",
                    createdAt = "2026-05-15T18:30:00Z",
                    likeCount = 4
                )
            )
        ),
        Post(
            id = "post_8",
            authorId = "user_8",
            authorName = "CEO Nhật Minh",
            authorAvatar = null,
            authorRole = "Startup Founder",
            type = PostType.Story,
            content = "Mình muốn chia sẻ một sự thật mà nhiều bạn sinh viên chưa biết: Không phải cứ giỏi TOÀN BỘ công nghệ mới được nhận việc.\n\nTrong 5 năm tuyển dụng, những bạn được hire không phải là bạn biết nhiều nhất, mà là bạn:\n\n1. Biết rõ điểm mạnh của mình\n2. Có tư duy giải quyết vấn đề\n3. Chịu khó học hỏi\n4. Giao tiếp tốt\n\nĐừng cố trở thành 'một người biết tất cả'. Hãy trở thành 'một người giỏi một điều gì đó cụ thể'.\n\nCác bạn đang ở năm mấy? Điều gì khiến các bạn lo lắng nhất?",
            images = emptyList(),
            skillTags = listOf("Career", "Job Search", "Startup"),
            likeCount = 1203,
            commentCount = 145,
            isLiked = false,
            isBookmarked = false,
            createdAt = "2026-05-14T10:30:00Z",
            authorEmail = "nhatminh.ceo@gmail.com",
            authorPhone = "+84 901 999 888",
            authorUserRole = UserRole.Guest,
            comments = listOf(
                Comment(
                    id = "c12",
                    authorName = "Vũ Thị Mai Linh",
                    authorAvatar = null,
                    content = "Mình đang năm 3, lo lắng nhất là không biết chọn chuyên ngành gì.",
                    createdAt = "2026-05-14T11:00:00Z",
                    likeCount = 22
                )
            )
        ),
        Post(
            id = "post_9",
            authorId = "user_9",
            authorName = "CloudFirst Vietnam",
            authorAvatar = null,
            authorRole = "Nhà tuyển dụng",
            type = PostType.Job,
            content = "CLOUDFIRST VIETNAM — CLOUD ENGINEER INTERN\n\nChúng tôi đang tuyển 2 Cloud Engineer Intern cho team Infrastructure.\n\nMô tả:\n- Hỗ trợ vận hành hệ thống cloud trên AWS/GCP\n- Tham gia CI/CD pipeline setup\n- Hỗ trợ monitoring và troubleshooting\n\nYêu cầu:\n- Sinh viên năm 3-4 hoặc mới tốt nghiệp ngành CNTT\n- Có kiến thức cơ bản về Linux, Networking\n- Biết một ngôn ngữ scripting (Python/Shell)\n\nThông tin:\n- Lương: 6-8 triệu/tháng\n- Địa điểm: Đà Nẵng (hybrid)\n\nApply: jobs@cloudfirst.vn",
            images = emptyList(),
            skillTags = listOf("AWS", "GCP", "Cloud", "DevOps"),
            likeCount = 67,
            commentCount = 8,
            isLiked = false,
            isBookmarked = false,
            createdAt = "2026-05-13T11:00:00Z",
            authorEmail = "jobs@cloudfirst.vn",
            authorPhone = "+84 236 555 6666",
            authorUserRole = UserRole.Employer,
            comments = emptyList()
        ),
        Post(
            id = "post_10",
            authorId = "user_10",
            authorName = "Design Thinking Club",
            authorAvatar = null,
            authorRole = "Câu lạc bộ - VKU",
            type = PostType.Article,
            content = "Design Thinking không chỉ dành cho designer — đây là framework giải quyết vấn đề mà BẤT KỲ ai cũng nên biết.\n\n5 giai đoạn của Design Thinking:\n\n1. EMPATHIZE — Hiểu người dùng thực sự cần gì\n2. DEFINE — 'How might we...' là câu hỏi vàng\n3. IDEATE — Brainstorm không giới hạn\n4. PROTOTYPE — Nhanh, rẻ, sai. Build để học\n5. TEST — Thu thập feedback, iterate\n\nWorkshop tiếp theo của club sẽ diễn ra vào 25/05, đăng ký qua link trong bio!",
            images = emptyList(),
            skillTags = listOf("Design Thinking", "UX", "Innovation"),
            likeCount = 298,
            commentCount = 41,
            isLiked = true,
            isBookmarked = false,
            createdAt = "2026-05-12T14:00:00Z",
            authorEmail = "dtclub.vku@gmail.com",
            authorPhone = "+84 236 333 4444",
            authorUserRole = UserRole.Guest,
            comments = listOf(
                Comment(
                    id = "c13",
                    authorName = "Trần Đình Khoa",
                    authorAvatar = null,
                    content = "Workshop này mình nhất định phải đăng ký!",
                    createdAt = "2026-05-12T15:00:00Z",
                    likeCount = 7
                )
            )
        )
    )
}
