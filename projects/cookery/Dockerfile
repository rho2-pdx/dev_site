FROM rust:1.88-slim AS build
WORKDIR /app

COPY Cargo.toml .
COPY src ./src

RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=build /app/target/release/cookery /usr/local/bin/cookery

EXPOSE 8081
CMD ["cookery"]

