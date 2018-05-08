defmodule UiWeb.PageController do
  use UiWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def video(conn, _params) do
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
end
