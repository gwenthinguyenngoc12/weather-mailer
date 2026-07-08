type WelcomeEmailTemplateInput = {
    name: string;
    city: string;
    temperature: number;
}

export function welcomeEmailTemplate(input: WelcomeEmailTemplateInput) {
    const { name, city, temperature } = input;
    return `
    <div style="font-family: Arial, sans-serif, line-height: 1.6;">
        <h2>Welcome, ${name}!</h2>

        <p>
            The current temperature in <strong>${city}</strong> iss
            <strong>${temperature}°C</strong>.
        <p>

        <p>Have a great day!<p>
    </div>
    `;
}