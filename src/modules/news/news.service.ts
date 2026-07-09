import { chromium } from "playwright";

type NewsItem = {
    title: string;
    link: string;
};

export class NewsService {
    async getTopVnExpressNews(limit = 10): Promise<NewsItem[]> {
        const browser = await chromium.launch({
            headless: false,
        });

        const page = await browser.newPage({
            userAgent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        });
        try {
            await page.goto("https://vnexpress.net/", {
                waitUntil: "domcontentloaded",
                timeout: 60000,
            });

            await page.waitForTimeout(5000);

            const news = await page.evaluate((limit) => {
                const selectors = [
                    "article.item-news h3.title-news a",
                    "article.item-news h2.title-news a",
                    "h3.title-news a",
                    "h2.title-news a",
                    ".title-news a",
                    "article a[href]",

                ];
                const elements: HTMLAnchorElement[] = [];

                for (const selector of selectors) {
                    const found = Array.from(
                        document.querySelectorAll<HTMLAnchorElement>(selector)
                    );

                    elements.push(...found);
                }

                const items = elements
                    .map((element) => {
                        const title = element.textContent?.trim().replace(/\s+/g, " ") || "";
                        const link = element.href || "";

                        return {
                            title,
                            link,
                        };
                    })
                    .filter((item) => {
                        return (
                            item.title.length > 20
                            && item.link.includes("vnexpress.net") &&
                            !item.link.includes("/video/") &&
                            !item.link.includes("/podcast/")
                            && !item.link.includes("#")
                        );
                    });
                const uniqueItems = Array.from(
                    new Map(items.map((item) => [item.link, item])).values()
                );
                return uniqueItems.slice(0, limit);
            }, limit);

            console.log("Fetched news count:", news.length);
            console.log("Fetched news:", news);

            return news;
        } finally {
            await browser.close();
        }
    }
}