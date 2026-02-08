# frozen_string_literal: true

require_relative "config/application"

# Charge toutes les tasks standard ActiveRecord :
# db:create, db:drop, db:migrate, db:rollback, db:version, db:schema:dump, etc.
require "sinatra/activerecord/rake"

# ----------------------------
# Dev tools (optionnels)
# ----------------------------
begin
  require "rspec/core/rake_task"
  RSpec::Core::RakeTask.new(:spec)
rescue LoadError
  # rspec pas installé (normal en prod)
end

desc "Look for style guide offenses (optional)"
task :rubocop do
  sh "rubocop --format simple || true"
end

# ----------------------------
# Database helpers (autonomes)
# ----------------------------
namespace :db do
  desc "Seed the database (db/seeds.rb)"
  task :seed do
    require_relative "db/seeds"
  end

  desc "Print a timestamp for migration filenames"
  task :timestamp do
    puts DateTime.now.strftime("%Y%m%d%H%M%S")
  end
end

# Par défaut : en dev tu peux faire `rake` => rubocop + spec
# En prod, tu lanceras explicitement `rake db:migrate`
task default: [:rubocop, :spec]
