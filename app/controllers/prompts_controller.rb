require 'http'

class PromptsController < ApplicationController
  def index
    @prompt = Prompt.new
    @prompts = Prompt.order(created_at: :desc)
  end

  def create
    @prompt = Prompt.new(prompt_params)
    response = openai_api_call(prompt_params[:content])

    if response.success?
      @prompt.response = response.parsed_response['choices'][0]['text']
      if @prompt.save
        render json: { text: @prompt.response }
      else
        render json: { error: @prompt.errors.full_messages.join(', ') }, status: :unprocessable_entity
      end
    else
      render json: { error: 'APIリクエストが失敗しました' }, status: :unprocessable_entity
    end
  end

  private

  def prompt_params
    params.require(:prompt).permit(:content)
  end

  def openai_api_call(prompt)
    response = HTTP.post(
      'https://api.openai.com/v1/engines/text-davinci-002/completions',
      headers: {
        'Content-Type' => 'application/json',
        'Authorization' => "Bearer #{ENV['OPENAI_API_KEY']}"
      },
      json: {
        prompt: prompt,
        max_tokens: Float::INFINITY
      }
    )

    if response.status.success?
      response
    else
      raise "APIリクエストが失敗しました: #{response.status}"
    end
  end
end