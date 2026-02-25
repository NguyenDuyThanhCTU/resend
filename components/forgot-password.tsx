"use client";

import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
      }

      setStatus("success");
      setMessage(
        "Email khôi phục đã được gửi. Vui lòng kiểm tra hộp thư của bạn (bao gồm cả thư mục Spam).",
      );
      setEmail(""); // Xóa rỗng ô input sau khi gửi thành công
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 text-black">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Quên mật khẩu?
          </h1>
          <p className="text-sm text-gray-500">
            Nhập email tài khoản của bạn để nhận liên kết khôi phục mật khẩu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Địa chỉ Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ví dụ: khachhang@gmail.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors"
              disabled={status === "loading" || status === "success"}
            />
          </div>

          {/* Hiển thị thông báo lỗi */}
          {status === "error" && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {message}
            </div>
          )}

          {/* Hiển thị thông báo thành công */}
          {status === "success" && (
            <div className="p-4 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100 flex flex-col items-center text-center">
              <span className="text-2xl mb-2">✅</span>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center h-11"
          >
            {status === "loading" ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Gửi link khôi phục"
            )}
          </button>
        </form>

        {/* Nút quay lại */}
        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm text-gray-600 hover:text-black font-medium transition-colors"
          >
            &larr; Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
