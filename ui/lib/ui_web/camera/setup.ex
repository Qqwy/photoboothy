defmodule UIWeb.Camera.Setup do
  @moduledoc """
  Plug for streaming an image
  """
  import Plug.Conn

  @behaviour Plug

  def init(_opts) do
    Picam.set_size(1920,1080)
    false
  end

  def call(conn, _opts) do
    conn
  end

end
