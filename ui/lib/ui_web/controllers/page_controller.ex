defmodule UiWeb.PageController do
  use UiWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def video(conn, _params) do
    Picam.set_size(1280,720)
    Picam.set_fps(30)
    # Picam.set_vflip(true)
    camera = Application.get_env(:picam, :camera)
    jpg = GenServer.call(camera, :next_frame)
    # jpg = Picam.next_frame()

    conn
    |> put_resp_header("Age", "0")
    |> put_resp_header("Cache-Control", "no-cache, private")
    |> put_resp_header("Pragma", "no-cache")
    |> put_resp_content_type("image/jpg")
    |> send_resp(200, jpg)
  end


  def take_picture(conn, _params) do
    Picam.set_size(1920,1080)
    Picam.set_fps(30)
    camera = Application.get_env(:picam, :camera)
    jpg = GenServer.call(camera, :next_frame)
    IO.puts("JPG: #{inspect(jpg)}")
    photo_folder = Application.get_env(:photobooth_ui, :photos_folder, "./")
    photo_path = Path.join(photo_folder, "photobooth-#{NaiveDateTime.utc_now()}.jpg")
    File.write!(photo_path, jpg)

    conn
    |> put_resp_header("Age", "0")
    |> put_resp_header("Cache-Control", "no-cache, private")
    |> put_resp_header("Pragma", "no-cache")
    |> send_resp(200, jpg)
  end
end
