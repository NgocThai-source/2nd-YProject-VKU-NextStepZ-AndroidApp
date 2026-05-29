package com.example.nextstepz.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.nextstepz.ui.theme.DarkSurface
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary

@Composable
fun TermsDialog(
    title: String,
    content: String,
    onDismiss: () -> Unit,
    onAccept: () -> Unit
) {
    val scrollState = rememberScrollState()
    var countdown by remember { mutableIntStateOf(5) }

    LaunchedEffect(Unit) {
        while (countdown > 0) {
            kotlinx.coroutines.delay(1000)
            countdown--
        }
    }

    Dialog(
        onDismissRequest = { if (countdown <= 0) onDismiss() },
        properties = DialogProperties(
            dismissOnBackPress = countdown <= 0,
            dismissOnClickOutside = countdown <= 0,
            usePlatformDefaultWidth = false
        )
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(DarkSurface.copy(alpha = 0.95f))
                .padding(horizontal = 16.dp)
                .padding(top = 48.dp, bottom = 24.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(scrollState)
                    .clip(RoundedCornerShape(24.dp))
                    .background(GlassWhite)
                    .border(1.dp, GlassBorder, RoundedCornerShape(24.dp))
                    .padding(24.dp)
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold),
                    color = TextPrimary,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(20.dp))

                Text(
                    text = content,
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary,
                    textAlign = TextAlign.Justify
                )

                Spacer(modifier = Modifier.height(24.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (countdown > 0) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            CircularProgressIndicator(
                                progress = { countdown / 5f },
                                modifier = Modifier.size(24.dp),
                                color = GradientStart,
                                strokeWidth = 2.dp,
                            )
                            Text(
                                text = "Vui lòng đọc kỹ nội dung ($countdown s)",
                                style = MaterialTheme.typography.bodySmall,
                                color = TextSecondary.copy(alpha = 0.7f),
                                textAlign = TextAlign.Center
                            )
                        }
                    } else {
                        TextButton(onClick = onAccept) {
                            Text(
                                text = "Tôi đã đọc và đồng ý",
                                style = MaterialTheme.typography.labelLarge,
                                color = TextPrimary,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }
        }
    }
}

object TermsContent {
    const val STUDENT = """
NỘI QUY, QUY CHẾ, CƠ CHẾ DÀNH CHO SINH VIÊN

1. GIỚI THIỆU
NextStepZ là nền tảng kết nối việc làm và định hướng nghề nghiệp dành cho sinh viên và nhà tuyển dụng. Khi sử dụng nền tảng này với vai trò Sinh viên, bạn đồng ý tuân thủ các điều khoản sau.

2. TRÁCH NHIỆM CỦA SINH VIÊN
- Thông tin cá nhân cung cấp phải chính xác, trung thực và cập nhật.
- Không được sử dụng nền tảng cho mục đích gian lận, lừa đảo hoặc các hoạt động bất hợp pháp.
- Không được phát tán thông tin cá nhân của người khác mà không có sự đồng ý.
- Chịu trách nhiệm bảo mật tài khoản của mình, không chia sẻ mật khẩu cho bất kỳ ai.
- Không được sử dụng công cụ tự động (bot) hoặc phần mềm để thu thập dữ liệu từ nền tảng.

3. SỞ HỮU TRÍ TUỆ
- Mọi nội dung do sinh viên đăng tải (CV, bài viết, bình luận) phải là của chính mình hoặc có quyền sử dụng.
- Người dùng giữ quyền sở hữu đối với nội dung do mình tạo ra nhưng cấp quyền sử dụng cho NextStepZ theo quy định.

4. BẢO MẬT VÀ QUYỀN RIÊNG TƯ
- NextStepZ cam kết bảo vệ thông tin cá nhân của sinh viên theo quy định pháp luật hiện hành.
- Thông tin cá nhân có thể được chia sẻ với nhà tuyển dụng khi sinh viên ứng tuyển công việc.
- Sinh viên có quyền yêu cầu xóa tài khoản và dữ liệu cá nhân.

5. CHẾ ĐỘ SỬ DỤNG
- Hồ sơ CV và thông tin ứng tuyển chỉ được sử dụng cho mục đích tìm kiếm việc làm hợp pháp.
- NextStepZ không chịu trách nhiệm về tính chính xác của thông tin tuyển dụng từ nhà tuyển dụng.
- Việc ứng tuyển thành công hay thất bại phụ thuộc vào quyết định của nhà tuyển dụng.

6. CHÍNH SÁCH KIỂM TOÁN VÀ GIỚI HẠN
- NextStepZ có quyền kiểm tra, xác minh và từ chối hồ sơ không đạt yêu cầu.
- Tài khoản vi phạm có thể bị tạm khóa hoặc xóa vĩnh viễn mà không cần báo trước.

7. GIỚI HẠN TRÁCH NHIỆM
- NextStepZ không đại diện hay bảo lãnh cho bất kỳ nhà tuyển dụng nào.
- Mọi giao dịch hoặc thỏa thuận giữa sinh viên và nhà tuyển dụng nằm ngoài phạm vi trách nhiệm của NextStepZ.

8. THAY ĐỔI ĐIỀU KHOẢN
- NextStepZ có quyền thay đổi nội quy này vào bất kỳ lúc nào.
- Thông báo thay đổi sẽ được đăng tải trên nền tảng; việc tiếp tục sử dụng đồng nghĩa với việc chấp nhận các thay đổi.

9. LIÊN HỆ
- Nếu có thắc mắc, vui lòng liên hệ qua email: support@nextstepz.com
"""

    const val EMPLOYER = """
NỘI QUY, QUY CHẾ, CƠ CHẾ DÀNH CHO NHÀ TUYỂN DỤNG

1. GIỚI THIỆU
NextStepZ là nền tảng kết nối việc làm dành cho sinh viên và nhà tuyển dụng. Khi đăng ký với vai trò Nhà tuyển dụng, bạn đồng ý tuân thủ các điều khoản sau. Đăng ký nhà tuyển dụng cần được xét duyệt bởi quản trị viên trước khi kích hoạt.

2. ĐIỀU KIỆN ĐĂNG KÝ
- Công ty/doanh nghiệp phải hợp pháp theo quy định của pháp luật Việt Nam.
- Thông tin công ty, mã số thuế và lĩnh vực hoạt động phải chính xác và có thể xác minh.
- Người đại diện tuyển dụng phải có thẩm quyền thực hiện hoạt động tuyển dụng.
- Mã số thuế phải hợp lệ và chưa được đăng ký với tài khoản nhà tuyển dụng khác.

3. TRÁCH NHIỆM CỦA NHÀ TUYỂN DỤNG
- Tất cả thông tin tuyển dụng phải trung thực, chính xác và không gây hiểu lầm.
- Không được đăng tin tuyển dụng giả, tin đã hết hạn hoặc không có thật.
- Không được thu phí từ ứng viên dưới bất kỳ hình thức nào.
- Bảo mật thông tin ứng viên, không sử dụng cho mục đích khác ngoài tuyển dụng.
- Cập nhật trạng thái tuyển dụng kịp thời (đã tuyển xong cần đóng tin).
- Không được phát tán danh sách ứng viên cho bên thứ ba không có liên quan.

4. QUY TRÌNH XÉT DUYỆT
- Đăng ký nhà tuyển dụng sẽ được gửi đến quản trị viên để xét duyệt.
- Thời gian xét duyệt: trong vòng 24-48 giờ làm việc.
- Quản trị viên có quyền yêu cầu bổ sung hồ sơ hoặc từ chối nếu không đạt yêu cầu.
- Nhà tuyển dụng sẽ nhận thông báo qua email khi được phê duyệt hoặc từ chối.

5. CHÍNH SÁCH ĐĂNG TIN
- Tin tuyển dụng phải tuân thủ quy định pháp luật về lao động Việt Nam.
- Không phân biệt giới tính, độ tuổi, dân tộc, tôn giáo trong mô tả công việc.
- Mô tả công việc phải rõ ràng, bao gồm: vị trí, địa điểm, mức lương (nếu công khai), yêu cầu.

6. BẢO MẬT VÀ DỮ LIỆU
- Thông tin công ty và dữ liệu tuyển dụng thuộc quyền quản lý của nhà tuyển dụng.
- NextStepZ không chịu trách nhiệm về việc rò rỉ thông tin do lỗi của nhà tuyển dụng.
- Nhà tuyển dụng chịu trách nhiệm bảo mật tài khoản và thông tin đăng nhập.

7. GIỚI HẠN TRÁCH NHIỆM
- NextStepZ không chịu trách nhiệm về chất lượng, năng lực thực tế của ứng viên.
- Mọi thỏa thuận lao động giữa nhà tuyển dụng và ứng viên không thuộc phạm vi trách nhiệm của NextStepZ.

8. CHẾ TÀI XỬ LÝ
- Vi phạm nội quy: cảnh cáo, tạm khóa hoặc khóa vĩnh viễn tài khoản.
- Hành vi gian lận hoặc lừa đảo sẽ bị chuyển cơ quan có thẩm quyền xử lý.

9. THAY ĐỔI ĐIỀU KHOẢN
- NextStepZ có quyền thay đổi quy chế này vào bất kỳ lúc nào.
- Thông báo thay đổi sẽ được gửi qua email đăng ký.

10. LIÊN HỆ
- Hỗ trợ: support@nextstepz.com
- Báo cáo vi phạm: abuse@nextstepz.com
"""
}
