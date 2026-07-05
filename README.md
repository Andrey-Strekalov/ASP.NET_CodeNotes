# CodeNotes

Веб-приложение для управления заметками с JWT-авторизацией. Бэкенд на ASP.NET MVC, фронтенд на React + Vite.

## Стек

**Backend**
- ASP.NET MVC · C# · .NET 8
- Entity Framework Core + SQLite
- ASP.NET Identity
- JWT Bearer Authentication

**Frontend**
- React + Vite
- React Router
- Material UI
- Axios
- Formik + Zod (валидация форм)

## Возможности

- Регистрация и вход с JWT-токеном
- Создание, просмотр, редактирование и удаление заметок
- Теги для заметок
- Защищённые маршруты (PrivateRoute / PublicRoute)

## Структура проекта

CODNOT/
└── CODNOT/
├── Controllers/       — контроллеры
├── Data/              — контекст БД
├── Dto/               — объекты передачи данных
├── Migrations/        — миграции EF Core
├── Models/            — модели данных
├── Services/          — бизнес-логика
├── ViewModels/        — модели для представлений
├── Views/
│   ├── Account/
│   ├── Home/
│   ├── Notes/
│   └── Tags/
└── wwwroot/           — статические файлы
frontend/
└── src/
├── components/
│   ├── auth/          — LoginForm, RegisterForm, маршруты
│   ├── layout/        — Navbar
│   ├── notes/         — NoteList, NoteForm, NoteDetails
│   └── tags/          — TagList
├── context/           — AuthContext (хранение токена)
└── services/          — api.js, authService.js

## Запуск

**Backend**

1. Открыть `CODNOT/CODNOT.sln` в Visual Studio.
2. Применить миграции:
```bash
   dotnet ef database update
```
3. Запустить проект.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

## Что использовалось

Связка ASP.NET Identity + JWT дала понимание того, как устроена аутентификация в .NET: от регистрации и хэширования пароля до выдачи токена и его валидации на каждом запросе. На фронте авторизация живёт в React Context, откуда токен подставляется в заголовки через Axios-интерцептор.
