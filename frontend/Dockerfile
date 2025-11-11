FROM node:20-alpine AS build
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
ENV NITRO_PORT=3100
ENV PORT=3100
ENV HOST=0.0.0.0
WORKDIR /app
COPY --from=build /app/.output ./.output
EXPOSE 3100
CMD ["node", ".output/server/index.mjs"]
