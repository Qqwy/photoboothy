defmodule UiWeb.Router do
  use UiWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug UIWeb.Camera.Setup
  end

  forward "/video.mjpg", UIWeb.Camera.Streamer

  pipeline :api do
    plug :accepts, ["json"]
  end


  scope "/", UiWeb do
    pipe_through :browser # Use the default browser stack

    get "/video_call", PageController, :video
    get "/take_picture", PageController, :take_picture
    get "/", PageController, :index
  end



  # Other scopes may use custom stacks.
  # scope "/api", UiWeb do
  #   pipe_through :api
  # end
end
