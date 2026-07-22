import { selectors, type Page } from "playwright";
import type { NewsItem } from "../../types/news.type";

export class NewsService {
    async getTopVnExpressNews(page: Page, url: string): Promise<NewsItem[]> {
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 6000,
        });

        return this.extractTop10NewsFromCurrentPage(page);
    }
    async extractTop10NewsFromCurrentPage(page: Page): Promise<NewsItem[]> {
        await page.waitForLoadState("domcontentloaded")
        await page.waitForSelector("article.item-news, .item-news, article",
            {
                timeout: 3000,
            }
        )

        const newsItems = await page.evaluate(() => {
            const selectors = [
                "article.item-news",
                ".item-news",
                "article",
            ];
            let articles: Element[] = [];
            for (const selector of selectors) {
                const found = Array.from(
                    document.querySelectorAll(selector),);
                if (found.length > 0) {
                    articles = found;
                    break;
                }
            }
            return articles.map((article, index) => {
                const titleElement =
                    article.querySelector<HTMLAnchorElement>(
                        "h2.title-news a, h3.title-news a, h2 a, h3 a",
                    );

                const descriptionElement =
                    article.querySelector<HTMLElement>(
                        ".description a, .description",
                    );

                const imageElement = article.querySelector<HTMLImageElement>("img");
                const timeElement = article.querySelector<HTMLTimeElement>("time");
                return {
                    id: index + 1,
                    title: titleElement?.textContent?.trim() ?? "",
                    link: titleElement?.href ?? "",
                    imageUrl: imageElement?.getAttribute("data-src") ??
                        imageElement?.getAttribute("data-original") ??
                        imageElement?.getAttribute("src") ??
                        "",
                    description: descriptionElement?.textContent?.trim() ?? "",
                    publishedAt: timeElement?.textContent?.trim() ??
                        timeElement?.getAttribute("datetime") ??
                        "",
                };
            });
        });

        const validNews = newsItems.filter((item) => {
            return (
                item.title.length > 20
                && item.link.includes("vnexpress.net") &&
                !item.link.includes("/video/") &&
                !item.link.includes("/podcast/")
                && !item.link.includes("#")
            );
        });
        const uniqueItems = Array.from(
            new Map(
                validNews.map((item) => [item.link, item])).values()
        );
        return uniqueItems.slice(0, 10);
    }
}

