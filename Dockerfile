# Utiliser une image Node.js
FROM node:18

# Créer un dossier de travail
WORKDIR /app

# Copier les fichiers de l'application
COPY package*.json ./
RUN npm install
COPY . .

# Exposer le port de l'application
EXPOSE 8100

# Commande pour démarrer l'application
CMD ["node", "src/app.js"]
