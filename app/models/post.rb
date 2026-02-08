class Post < ActiveRecord::Base
  belongs_to :user
  
  scope :popular, -> { order(votes: :desc) }

end
