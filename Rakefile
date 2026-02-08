# frozen_string_literal: true

require_relative "config/application"
require "active_record"
require "active_record/tasks/database_tasks"

ActiveRecord::Tasks::DatabaseTasks.database_configuration =
  YAML.load_file("config/database.yml")

ActiveRecord::Tasks::DatabaseTasks.db_dir = "db"
ActiveRecord::Tasks::DatabaseTasks.migrations_paths = ["db/migrate"]
ActiveRecord::Tasks::DatabaseTasks.root = Dir.pwd
