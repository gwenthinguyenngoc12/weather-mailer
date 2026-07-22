import type { NewsItem } from "../../types/news.type";

type WelcomeEmailTemplateInput = {
  name: string;
  city: string;
  temperature: number;
  news: NewsItem[];
};

export function welcomeEmailTemplate(
  input: WelcomeEmailTemplateInput,
): string {
  const {
    name,
    city,
    temperature,
    news,
  } = input;
  const newsItemsHtml = news.map((item) => {
    const imageHtml = item.imageUrl
      ? `
            <div style="margin: 12px 0;">
              <img
                src="${item.imageUrl}"
                alt="${escapeHtml(item.title)}"
                style="
                  width: 100%;
                  max-width: 520px;
                  height: auto;
                  border-radius: 8px;
                  display: block;
                "
              />
            </div>
          `
      : "";

    const descriptionHtml = item.description
      ? `
            <p style="
              margin: 0 0 10px 0;
              color: #444;
              font-size: 15px;
              line-height: 1.6;
            ">
              ${escapeHtml(item.description)}
            </p>
          `
      : "";

    const publishedAtHtml = item.publishedAt
      ? `
            <p style="
              margin: 0 0 10px 0;
              color: #777;
              font-size: 13px;
            ">
              Thời gian đăng: ${escapeHtml(item.publishedAt)}
            </p>
          `
      : "";

    return `
          <div style="
            padding: 18px 0;
            border-bottom: 1px solid #e5e5e5;
          ">
            <h3 style="
              margin: 0 0 10px 0;
              color: #222;
              font-size: 18px;
            ">
              ${item.id}. ${escapeHtml(item.title)}
            </h3>

            ${imageHtml}

            ${descriptionHtml}

            ${publishedAtHtml}

            <a
              href="${item.link}"
              target="_blank"
              style="
                display: inline-block;
                padding: 8px 14px;
                background-color: #b00020;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-size: 14px;
              "
            >
              Đọc bài viết
            </a>
          </div>
        `;
  })
    .join("");

  return `
      <!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Tin mới nhất từ VnExpress</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        ">
          <div style="
            max-width: 680px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 24px;
            font-family: Arial, sans-serif;
          ">
            <div style="
              border-bottom: 3px solid #b00020;
              padding-bottom: 16px;
              margin-bottom: 20px;
            ">
              <h1 style="
                margin: 0;
                color: #b00020;
                font-size: 26px;
              ">
                Tin mới nhất từ VnExpress
              </h1>

              <p style="
                margin: 8px 0 0 0;
                color: #555;
                font-size: 15px;
              ">
                Dưới đây là 10 tin tức mới nhất được hệ thống
                tự động tổng hợp từ VnExpress.
              </p>
            </div>
            <div style="
              margin: 20px 0;
              padding: 16px;
              background-color: #f2f7ff;
              border-radius: 8px;
              border-left: 4px solid #3578e5;
            ">
              <h2 style="
                margin: 0 0 10px 0;
                font-size: 20px;
                color: #222;
              ">
                Thời tiết hiện tại
              </h2>

               <p style="
                margin: 0;
                font-size: 16px;
                color: #444;
              ">
                Địa điểm:
                  <strong>${escapeHtml(city)}</strong>
                </p>

                <p style="
                  margin: 8px 0 0 0;
                  font-size: 16px;
                  color: #444;
                ">
                  Nhiệt độ:
                  <strong>${temperature}°C</strong>
                </p>
              </div>
              
            ${newsItemsHtml}

            <div style="
              margin-top: 24px;
              padding-top: 16px;
              color: #777;
              font-size: 13px;
              text-align: center;
            ">
              <p style="margin: 0;">
                Email này được gửi tự động mỗi ngày.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}