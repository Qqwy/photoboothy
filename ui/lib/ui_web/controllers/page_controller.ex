defmodule UiWeb.PageController do
  use UiWeb, :controller

  def index(conn, _params) do
    # Picam.set_size(1920,1080)
    render conn, "index.html"
  end

  def gum(conn, _params) do
    render conn, "gum.html"
  end

  def video(conn, _params) do
    Picam.set_size(1280,720)
    # Picam.set_vflip(true)
    camera = Application.get_env(:picam, :camera)
    jpg = next_frame()
    # jpg = Picam.next_frame()

    conn
    |> put_resp_header("Age", "0")
    |> put_resp_header("Cache-Control", "no-cache, private")
    |> put_resp_header("Pragma", "no-cache")
    |> put_resp_content_type("image/jpg")
    |> send_resp(200, jpg)
  end


  def take_picture(conn, _params) do
    # small_jpg = next_frame()
    # Picam.set_size(1920,1080)
    # :timer.sleep(500)
    jpg = next_frame()
    IO.puts("JPG: #{inspect(jpg)}")
    Task.start(fn ->
      photo_folder = Application.get_env(:ui, :photos_folder, "/root")
      photo_path = Path.join(photo_folder, "photobooth-#{NaiveDateTime.utc_now()}.jpg")
      # small_photo_path = Path.join(photo_folder, "photobooth-#{NaiveDateTime.utc_now()}-small.jpg")
      File.write!(photo_path, jpg)
      IO.puts("Done writing JPG #{photo_path}: #{inspect(jpg)}")
      # File.write!(small_photo_path, small_jpg)
    end)

    conn
    |> put_resp_header("Age", "0")
    |> put_resp_header("Cache-Control", "no-cache, private")
    |> put_resp_header("Pragma", "no-cache")
    |> send_resp(200, jpg)
  end

  defp next_frame() do
    camera = Application.get_env(:picam, :camera)
    GenServer.call(camera, :next_frame)
  end
end
