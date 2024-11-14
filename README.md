## 🌐 Plex Notifier

Welcome to the **Plex Notifier** repository! This is a simple Node.js Express API that automatically sends a message to a Telegram bot whenever a new film is available on Plex (via Plex webhooks).

## 📋 Prerequisites

- VPS or dedicated Server
- NodeJS
- Docker (Optionnal)

## ⚙️ Installation

```bash
git clone https://github.com/DeadGolden0/Plex-Notifier
cd Plex-Notifier
```

## 📋 Configuration
If using only Node.js, set up and configure the .env file. If using Docker, configure the docker-compose.yml file instead.

```bash
# Global Env Settings
PORT=
TELEGRAM_TOKEN=
TELEGRAM_CHAT_ID=

# The Movie DB Settings
TMDB_API_KEY=
```

## 🖥️ Usage

# Using Node.js
Start the server with:

```bash
Node .
```

# Using Docker
Start the service with Docker Compose:

```bash
docker compose build
docker compose up -d
```

To stop the service:

```bash
docker compose down
```
 
## 🤝 Contributing

Your contributions make the open source community a fantastic place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✉️ Contact

For any questions or suggestions, please feel free to contact me:

[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/w92W7XR9Yg)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:deadgolden9122@gmail.com)
[![Steam](https://img.shields.io/badge/steam-%23000000.svg?style=for-the-badge&logo=steam&logoColor=white)](https://steamcommunity.com/id/DeAdGoLdEn/)
