import { AuthPage } from "@refinedev/mui";

export const Login = () => {
  return (
    <AuthPage
      type="login"
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
          Welcome to Invoice Manager
          <div
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "#64748b",
              marginTop: "-8px",
            }}
          >
            Manage your invoices with ease
          </div>
        </div>
      }
      forgotPasswordLink={false}
      registerLink={false}
      formProps={{
        defaultValues: { email: "demo@refine.dev", password: "demodemo" },
      }}
    />
  );
};
