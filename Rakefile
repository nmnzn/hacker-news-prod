# frozen_string_literal: true

require "fileutils"
require "active_record"
require_relative "config/application"

# ----------------------------
# Helpers
# ----------------------------
def db_path
  # ActiveRecord 6+ / 7+ / 8+ (ok)
  ActiveRecord::Base.connection_db_config.database
end

def migration_context
  migrations_path = File.join(__dir__, "db", "migrate")
  ActiveRecord::MigrationContext.new(migrations_path, ActiveRecord::SchemaMigration)
end

# ----------------------------
# Optional: RSpec task (ne casse pas en prod)
# ----------------------------
begin
  require "rspec/core/rake_task"
  RSpec::Core::RakeTask.new(:spec)
rescue LoadError
  # rspec absent => normal
end

desc "Rubocop (optional)"
task :rubocop do
  sh "rubocop --format simple || true"
end

task default: [:rubocop, (Rake::Task.task_defined?(:spec) ? :spec : nil)].compact

# ----------------------------
# DB tasks
# ----------------------------
namespace :db do
  desc "Create the database file (SQLite)"
  task :create do
    FileUtils.mkdir_p(File.dirname(db_path))
    unless File.exist?(db_path)
      puts "Creating #{db_path}..."
      FileUtils.touch(db_path)
    else
      puts "Already exists: #{db_path}"
    end
  end

  desc "Drop the database file (SQLite)"
  task :drop do
    if File.exist?(db_path)
      puts "Deleting #{db_path}..."
      FileUtils.rm_f(db_path)
    else
      puts "No db file to delete: #{db_path}"
    end
  end

  desc "Migrate the database (VERSION=x optional)"
  task :migrate do
    version = ENV["VERSION"]&.to_i
    puts version ? "Migrating to VERSION=#{version}..." : "Migrating..."
    migration_context.migrate(version)
  end

  desc "Rollback migrations (STEP=x optional, default 1)"
  task :rollback do
    step = (ENV["STEP"] || "1").to_i
    puts "Rollback STEP=#{step}..."
    migration_context.rollback(step)
  end

  desc "Show current schema version"
  task :version do
    puts "Current version: #{ActiveRecord::SchemaMigration.maximum(:version) || 0}"
  end

  desc "Seed the database (db/seeds.rb)"
  task :seed do
    load File.join(__dir__, "db", "seeds.rb")
  end

  desc "Print a timestamp for migration filenames"
  task :timestamp do
    puts Time.now.strftime("%Y%m%d%H%M%S")
  end

  namespace :schema do
    desc "Dump schema to db/schema.rb"
    task :dump do
      require "active_record/schema_dumper"
      filename = File.join(__dir__, "db", "schema.rb")

      File.open(filename, "w:utf-8") do |file|
        ActiveRecord::SchemaDumper.dump(ActiveRecord::Base.connection_pool, file)
      end

      puts "Schema dumped to #{filename}"
    end
  end
end
