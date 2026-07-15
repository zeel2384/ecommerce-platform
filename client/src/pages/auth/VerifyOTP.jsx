import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { verifyOTP, resendOTP } from "../../api";
import toast from "react-hot-toast";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email passed from Register page
  const email = location.state?.email;

  // Redirect if no email
  if (!email) {
    navigate("/register");
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const { data } = await verifyOTP({ email, otp });
      login(data.user, data.token);
      toast.success("Account verified successfully! 🎉");
      if (data.user.role === "vendor") {
        navigate("/vendor/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendOTP({ email });
      toast.success("New OTP sent to your email! 📧");
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--surface)",
          padding: "2.5rem",
          borderRadius: "16px",
          boxShadow: "var(--shadow-lg)",
          width: "100%",
          maxWidth: "420px",
          border: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📧</div>

        {/* Title */}
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "800",
            color: "var(--text)",
            marginBottom: "0.5rem",
          }}
        >
          Verify Your Email
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "14px",
            marginBottom: "0.5rem",
          }}
        >
          We sent a 6-digit OTP to
        </p>
        <p
          style={{
            color: "#6366f1",
            fontWeight: "700",
            fontSize: "15px",
            marginBottom: "2rem",
          }}
        >
          {email}
        </p>

        <form onSubmit={handleVerify}>
          {/* OTP Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <input
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "12px",
                border: "2px solid var(--border)",
                fontSize: "2rem",
                fontWeight: "800",
                letterSpacing: "12px",
                textAlign: "center",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "var(--surface2)",
                color: "var(--text)",
                fontFamily: "monospace",
              }}
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                if (val.length <= 6) setOtp(val);
              }}
              maxLength={6}
              required
            />
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "13px",
                marginTop: "8px",
              }}
            >
              OTP expires in 10 minutes
            </p>
          </div>

          {/* Verify Button */}
          <button
            style={{
              width: "100%",
              padding: "0.85rem",
              backgroundColor: loading ? "#a5b4fc" : "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "1rem",
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP ✅"}
          </button>
        </form>

        {/* Resend OTP */}
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "14px",
            marginBottom: "0.5rem",
          }}
        >
          Didn't receive the OTP?
        </p>
        <button
          style={{
            backgroundColor: "transparent",
            border: "1px solid #6366f1",
            color: "#6366f1",
            padding: "0.6rem 1.5rem",
            borderRadius: "8px",
            cursor: resendLoading ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
          onClick={handleResend}
          disabled={resendLoading}
        >
          {resendLoading ? "Sending..." : "Resend OTP 📧"}
        </button>

        {/* Back to Register */}
        <p
          style={{
            marginTop: "1.5rem",
            color: "var(--text-secondary)",
            fontSize: "14px",
          }}
        >
          Wrong email?{" "}
          <span
            style={{
              color: "#6366f1",
              fontWeight: "700",
              cursor: "pointer",
            }}
            onClick={() => navigate("/register")}
          >
            Go back
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
