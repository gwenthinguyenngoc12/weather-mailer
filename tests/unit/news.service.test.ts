import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import type { Page } from "playwright";
import { NewsService } from "../../src/modules/news/news.service";

describe("NewsService", () => {
    let newsService: NewsService;

    let gotoMock: Mock;
    let waitForLoadStateMock: Mock;
    let waitForSelectorMock: Mock;
    let evaluateMock: Mock;

    let pageMock: Page;

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
        const url = "https://vnexpress.net";

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
})