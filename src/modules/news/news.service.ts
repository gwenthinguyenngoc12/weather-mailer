import type { Page } from "playwright";

export type NewsItem = {
    title: string;
    link: string;
};

export class NewsService {
    async getTopVnExpressNews(page: Page, url: string): Promise<NewsItem[]> {
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
        });

        return this.extractTop10NewsFromCurrentPage(page);
    }
    async extractTop10NewsFromCurrentPage(page: Page): Promise<NewsItem[]> {
        await page.waitForTimeout(5000);

        return page.evaluate(() => {
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
            return uniqueItems.slice(0, 10);
        });
    }
}

