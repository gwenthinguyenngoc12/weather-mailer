auto-email-weather-app/
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── config/
│   │   ├── env.ts
│   │   └── mail.ts
│   │
│   ├── modules/
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.model.ts
│   │   │
│   │   ├── email/
│   │   │   ├── email.service.ts
│   │   │   └── email.template.ts
│   │   │
│   │   └── weather/
│   │       ├── weather.service.ts
│   │       └── weather.types.ts
│   │
│   ├── jobs/
│   │   └── weather-email.job.ts
│   │
│   ├── database/
│   │   └── connection.ts
│   │
│   ├── middlewares/
│   │   └── error.middleware.ts
│   │
│   └── utils/
│       └── logger.ts
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore