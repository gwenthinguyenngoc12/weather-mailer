import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import type { Page } from "playwright";
import { NewsService } from "../../src/modules/news/news.service";
import { NewsItem } from "../../src/types/news.type";

describe("NewsService", () => {
    let newsService: NewsService;

    let gotoMock: Mock;
    let waitForLoadStateMock: Mock;
    let waitForSelectorMock: Mock;
    let evaluateMock: Mock;

    let pageMock: Page;

 

    const url = "https://vnexpress.net";

    beforeEach(() => {
        newsService = new NewsService();

        gotoMock = vi.fn().mockResolvedValue(null);
        waitForLoadStateMock = vi.fn().mockResolvedValue(undefined);
        waitForSelectorMock = vi.fn().mockResolvedValue(null);
        evaluateMock = vi.fn().mockResolvedValue([]);

        pageMock = {
            goto: gotoMock,
            waitForLoadState: waitForLoadStateMock,
            waitForSelector: waitForSelectorMock,
            evaluate: evaluateMock,
        } as unknown as Page;
    });

    it("should navigate to URL and return valid news", async () => {

        evaluateMock.mockResolvedValue([]);

        await newsService.getTopVnExpressNews(pageMock, url);

        expect(gotoMock).toHaveBeenCalledOnce();

        const [actualUrl, actualOptions] = gotoMock.mock.calls[0];

        expect(actualUrl).toBe(url);

        expect(actualOptions).toEqual({
            waitUntil: "domcontentloaded",
            timeout: 6000,
        });
    });

    it("should filter invalid articles", async () => {

    it("should filter invalid articles", async () => {
        const url = "https://vnexpress.net";
        evaluateMock.mockResolvedValue([
            {
                id: 1,
                title: "Ngắn",
                link: "https://vnexpress.net/tin-1",
                imageUrl: "",
                description: "",
                publishedAt: "",
            },
            {
                id: 2,
                title: "Đây là tiêu đề bài viết hợp lệ và đủ dài",
                link: "https://example.com/tin-2",
                imageUrl: "",
                description: "",
                publishedAt: "",
            },
            {
                id: 3,
                title: "Đây là tiêu đề bài viết VNExpress hợp lệ",
                link: "https://vnexpress.net/tin-3",
                imageUrl: "",
                description: "",
                publishedAt: "",
            },
        ] satisfies NewsItem[]);

        const result = await newsService.getTopVnExpressNews(
            pageMock,
            url,
        );

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(3);
    });
})