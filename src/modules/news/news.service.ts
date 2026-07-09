import Parser from "rss-parser";

type NewsItem = {
    title: string;
    link: string;
};

export class NewService {
    private parser = new Parser();

    async getTOPVNEXpressNews(limit = 10): Promise<NewsItem[]> {
        const feed = await this.parser.parseURL("https://vnexpress.net/rss/tin-moi-nhat.rss");

        return feed.items.slice(0, limit).map((item) => ({
            title: item.title || "No titke",
            link: item.link || ","
        }));
    }
}