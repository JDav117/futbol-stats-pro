# ✅ FIX ERROR 3: Imagen actualizada a node:24-slim (LTS activo, segura y optimizada).
# node:14 está fuera de soporte desde abril 2023.
FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ✅ FIX ERROR 4: Puerto corregido a 3000, que es el que usa la app
# (process.env.PORT || 3000 en src/app.js).
EXPOSE 3000

CMD ["npm", "start"]
