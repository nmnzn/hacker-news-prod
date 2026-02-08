FROM ruby:3.2-slim

# Dépendances système
RUN apt-get update && apt-get install -y \
    build-essential \
    sqlite3 \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier les gems
COPY Gemfile Gemfile.lock ./
RUN bundle install --without development

# Copier tout le projet
COPY . .

# Script de démarrage
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 4567

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["ruby", "lib/app.rb", "-o", "0.0.0.0"]
