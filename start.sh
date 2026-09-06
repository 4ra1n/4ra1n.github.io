#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if [ -n "$1" ]; then
  PORT="$1"
else
  PORT="$(python3 -c 'import socket
s = socket.socket()
s.bind(("127.0.0.1", 0))
print(s.getsockname()[1])
s.close()')"
fi
echo "http://127.0.0.1:${PORT}  (Ctrl+C 停止)"
python3 -m http.server "$PORT" --bind 127.0.0.1
