type NewsItem = {
    title: string;
    link: string;
};
type WelcomeEmailTemplateInput = {
    name: string;
    city: string;
    temperature: number;
    news: NewsItem[];
};

export function welcomeEmailTemplate(input: WelcomeEmailTemplateInput) {
    const { name, city, temperature, news = [] } = input;
    const newsHtml = news.map(
        (item) => `
        <li>
            <a href="${item.link}" target="_blank">
            ${item.title}
            </a>
        </li>
        `
    )
        .join("");
    return `
    <div style="font-family: Arial, sans-serif, line-height: 1.6;">
        <h2>Hi, ${name}!</h2>

        <p>
            The current temperature in <strong>${city}</strong> is
            <strong>${temperature}°C</strong>.
        </p>

        <h3>Top 10 lastest Vnexpress news</h3>

        <ol>
            ${newsHtml}
        </ol>

        <p>Have a great day!<p>
    </div>
    `;
}