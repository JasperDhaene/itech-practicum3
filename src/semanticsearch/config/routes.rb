Rails.application.routes.draw do

  get '/query' => 'query#index'
  root 'homepage#index'

end
