import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Vui lòng nhập địa chỉ email" },
        { status: 400 },
      );
    }

    // Nơi bạn sẽ chèn logic Database (ví dụ dùng Prisma) sau này:
    // 1. Kiểm tra email có tồn tại trong bảng User không
    // 2. Tạo một token bảo mật (ví dụ dùng thư viện uuid) và lưu vào bảng PasswordResetToken

    // Hiện tại dùng token giả lập để test luồng gửi email
    const mockToken = "test-token-123456";
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${mockToken}`;

    const data = await resend.emails.send({
      from: "DNA Agency Support <no-reply@dnaagency.com.vn>",
      to: [email],
      subject: "Yêu cầu khôi phục mật khẩu",
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">Khôi phục mật khẩu</h2>
          <p style="color: #555; line-height: 1.5;">Xin chào,</p>
          <p style="color: #555; line-height: 1.5;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấn vào nút bên dưới để tiến hành thiết lập mật khẩu mới:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Đặt lại mật khẩu
            </a>
          </div>
          
          <p style="color: #777; font-size: 14px; line-height: 1.5;">
            Đường dẫn này sẽ hết hạn sau 15 phút. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email và tài khoản của bạn vẫn an toàn.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Lỗi Resend:", error);
    return NextResponse.json(
      { error: "Không thể gửi email lúc này. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }
}
