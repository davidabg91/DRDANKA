import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const alt = "Академия Сигурен Хранителен Бизнес | Д-р Данка Николова";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const logoPath = path.join(process.cwd(), "public", "logo-icon.png");
  const logoData = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#064e3b",
          backgroundImage: "radial-gradient(circle at center, #065f46 0%, #022c22 100%)",
          padding: "45px 50px",
          boxSizing: "border-box",
          border: "10px solid #d4af37",
          color: "#ffffff",
          fontFamily: "sans-serif",
          textAlign: "center",
        }}
      >
        {/* Top Section: Logo Icon + Site Brand Name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Official Logo Image */}
          <img
            src={logoBase64}
            alt="Logo"
            style={{
              width: "68px",
              height: "68px",
              objectFit: "contain",
            }}
          />
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#fef08a",
            }}
          >
            АКАДЕМИЯ
          </span>
        </div>

        {/* Center Title & Author */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            maxWidth: "1000px",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            "СИГУРЕН ХРАНИТЕЛЕН БИЗНЕС"
          </h1>
          <div
            style={{
              width: "120px",
              height: "2px",
              backgroundColor: "#d4af37",
            }}
          />
          <p
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#fbbf24",
              margin: 0,
            }}
          >
            Д-р Данка Николова
          </p>
          <p
            style={{
              fontSize: "18px",
              fontWeight: 400,
              color: "#e2e8f0",
              margin: 0,
              opacity: 0.9,
            }}
          >
            Консултант по безопасност на храните • HACCP & ISO 22000
          </p>
        </div>

        {/* Bottom Domain Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "19px",
            fontWeight: 700,
            color: "#fef08a",
            letterSpacing: "1px",
            padding: "8px 24px",
            borderRadius: "30px",
            backgroundColor: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(212,175,55,0.4)",
          }}
        >
          www.haccpspokoystvie.bg
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
