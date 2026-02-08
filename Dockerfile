FROM ruby:3.3.0

RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libsqlite3-dev \
    nodejs

WORKDIR /app

COPY Gemfile* ./

RUN bundle install

COPY . .

EXPOSE 4567

CMD ["ruby", "app/app.rb", "-o", "0.0.0.0"]
