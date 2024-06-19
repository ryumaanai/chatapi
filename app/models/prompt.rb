class Prompt < ApplicationRecord
    validates :content, presence: true
    validates :response, presence: true
end
