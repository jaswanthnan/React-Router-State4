import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
 
const NotFound = ({ darkMode = false }) => {
  const navigate = useNavigate();
 
  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const cardBg = darkMode ? "#1e293b" : "#ffffff";
  const titleCol = darkMode ? "#f1f5f9" : "#1e293b";
  const subTitleCol = darkMode ? "#94a3b8" : "#64748b";
 
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "48px",
          background: cardBg,
          borderRadius: "24px",
          boxShadow: darkMode
            ? "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
            : "0 20px 25px -5px rgba(0, 0, 0, 0.05)",
          textAlign: "center",
        }}
      >
        <Result
          icon={<img src="https://illustrations.popsy.co/violet/page-not-found.svg" alt="Lost" style={{ width: '280px', margin: '0 auto', display: 'block' }} />}
          title={<span style={{ fontSize: "64px", fontWeight: 900, color: titleCol, letterSpacing: "-2px" }}>404</span>}
          subTitle={
            <div style={{ marginTop: "-10px" }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: titleCol, marginBottom: "8px" }}>Page Not Found</div>
              <div style={{ fontSize: "16px", color: subTitleCol }}>
                The page you're looking for doesn't exist or has been moved.
              </div>
            </div>
          }
          extra={
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
              style={{
                height: "48px",
                padding: "0 32px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 700,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                border: "none",
                marginTop: "12px",
                boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
              }}
            >
              Back to Dashboard
            </Button>
          }
        />
      </div>
    </div>
  );
};
 
export default NotFound;
