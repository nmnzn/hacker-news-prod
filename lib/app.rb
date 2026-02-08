require "sinatra"
require "sinatra/reloader" if development?
require "pry-byebug" if development?

require_relative "../config/application"

enable :sessions
set :session_secret, 'mon_super_secret_ultra_long_hacker_news_session_key_avec_plein_de_caracteres_2025'
set :root, File.expand_path("..", __dir__)
set :views, proc { File.join(root, "app/views") }
set :public_folder, proc { File.join(root, "public") }
set :static, true
set :bind, '0.0.0.0'


after do
  ActiveRecord::Base.connection.close
end

configure do
  set :host_authorization, { permitted_hosts: [] }
end

get "/" do
  # TODO
  # 1. fetch posts from database.
  # 2. Store these posts in an instance variable
  # 3. Use it in the

    @posts = Post.popular

  erb :index # Do not remove this line
end

get "/posts/:id" do
  @post = Post.find(params[:id])

  # Vérifier quand l'utilisateur a voté la dernière fois
  session[:last_vote_time] ||= {}
  last_vote = session[:last_vote_time][@post.id.to_s]

  # Calculer le temps restant avant de pouvoir re-voter
  if last_vote
    time_elapsed = Time.now.to_i - last_vote
    @cooldown_remaining = [30 - time_elapsed, 0].max
  else
    @cooldown_remaining = 0
  end

  erb :show
end

post "/posts/:id/upvote" do
  @post = Post.find(params[:id])

  # Initialiser la session
  session[:last_vote_time] ||= {}

  # Vérifier le cooldown
  last_vote = session[:last_vote_time][@post.id.to_s]
  if last_vote && (Time.now.to_i - last_vote) < 30
    # Trop tôt ! Rediriger avec un message
    redirect "/posts/#{params[:id]}"
  else
    # OK, on peut voter !
    @post.votes += 1
    @post.save

    # Enregistrer le timestamp du vote
    session[:last_vote_time][@post.id.to_s] = Time.now.to_i

    redirect "/posts/#{params[:id]}"
  end
end

post "/posts/:id/downvote" do
  @post = Post.find(params[:id])

  # Initialiser la session
  session[:last_vote_time] ||= {}

  # Vérifier le cooldown
  last_vote = session[:last_vote_time][@post.id.to_s]
  if last_vote && (Time.now.to_i - last_vote) < 30
    # Trop tôt ! Rediriger
    redirect "/posts/#{params[:id]}"
  else
    # OK, on peut voter !
    @post.votes -= 1
    @post.save

    # Enregistrer le timestamp du vote
    session[:last_vote_time][@post.id.to_s] = Time.now.to_i

    redirect "/posts/#{params[:id]}"
  end
end


post "/posts" do
  # 1. Récupérer les données du formulaire
  title = params[:title]
  url = params[:url]

  # 2. Créer le post dans la DB
  post = Post.create(
    title: title,
    url: url,
    votes: 0,           # Commence à 0
    user_id: 1          # Pour l'instant, user_id fixe à 1
  )

  # 3. Vérifier si la création a réussi
  if post.persisted?
    # Succès → redirection vers la page d'accueil
    redirect "/"
  else
    # Erreur → afficher un message (simple pour l'instant)
    "Erreur : #{post.errors.full_messages.join(', ')}"
  end
end
# TODO: add more routes to your app!
