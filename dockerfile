# Builder
FROM node:12.2.0-alpine as builder
ENV DISPLAY :99
ARG STAGE
COPY . /app
RUN echo "Cleaning cache"
RUN npm cache clean --force

RUN echo "Building App"
RUN cd /app && \
    npm install && \
    npm run build
    
RUN echo "Building Server"
RUN cd /app/server && \
    npm install

# Server Image
FROM node:12.2.0-alpine
COPY --from=builder /app/build /app/build
COPY --from=builder /app/config /app/config
COPY --from=builder /app/server /app/server
EXPOSE 3000
CMD ["node", "/app/server", "production"]
