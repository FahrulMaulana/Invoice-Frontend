import { AuthPage } from "@refinedev/mui";

export const ForgotPassword = () => {
  return (
    <AuthPage
      type="forgotPassword"
      title={
        <div
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#3d5af1",
            marginBottom: "16px",
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <img
            src="/pngwing.png"
            alt="Invoice Manager"
            style={{
              width: "60px",
              height: "60px",
              marginBottom: "8px",
            }}
          />
          Reset Your Password
          <div
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "#64748b",
              marginTop: "-8px",
            }}
          >
            We'll send a reset link to your email
          </div>
        </div>
      }
    />
  );
};
