#!/usr/bin/env python3
"""Servidor local do player.

Serve a pasta player/ e gera o lista.js automaticamente a partir das
subpastas e vídeos que existirem nela, a cada vez que a página é aberta.

Uso:  python3 servidor.py        (abre http://localhost:8000 no navegador)
      python3 servidor.py 9000   (outra porta)
"""
import json
import os
import re
import sys
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PASTA = os.path.dirname(os.path.abspath(__file__))
VIDEO_EXT = re.compile(r"\.(mp4|webm|ogv|ogg|mov|m4v|mkv)$", re.IGNORECASE)


def ordem_natural(nome):
    return [int(p) if p.isdigit() else p.lower() for p in re.split(r"(\d+)", nome)]


def gerar_lista():
    pastas = {}
    for nome in sorted(os.listdir(PASTA), key=ordem_natural):
        caminho = os.path.join(PASTA, nome)
        if nome.startswith((".", "_")) or not os.path.isdir(caminho):
            continue
        videos = [
            f for f in os.listdir(caminho)
            if VIDEO_EXT.search(f) and not f.startswith(".")
            and os.path.isfile(os.path.join(caminho, f))
        ]
        pastas[nome] = sorted(videos, key=ordem_natural)
    conteudo = (
        "// Gerado automaticamente pelo servidor.py — não edite à mão.\n"
        "window.PLAYER_PASTAS = "
        + json.dumps(pastas, ensure_ascii=False, indent=2)
        + ";\n"
    )
    # Salva no disco para funcionar também abrindo o index.html direto
    arquivo = os.path.join(PASTA, "lista.js")
    try:
        with open(arquivo, encoding="utf-8") as f:
            igual = f.read() == conteudo
    except OSError:
        igual = False
    if not igual:
        try:
            with open(arquivo, "w", encoding="utf-8") as f:
                f.write(conteudo)
        except OSError:
            pass
    return conteudo.encode("utf-8")


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PASTA, **kwargs)

    def do_GET(self):
        if self.path.split("?")[0] == "/lista.js":
            corpo = gerar_lista()
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript; charset=utf-8")
            self.send_header("Content-Length", str(len(corpo)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(corpo)
            return
        if "Range" in self.headers and self.servir_trecho():
            return
        super().do_GET()

    def servir_trecho(self):
        """Suporte a Range, para o navegador conseguir carregar vídeos grandes e avançar."""
        caminho = self.translate_path(self.path)
        if not os.path.isfile(caminho):
            return False
        m = re.match(r"bytes=(\d*)-(\d*)$", self.headers["Range"].strip())
        if not m:
            return False
        tamanho = os.path.getsize(caminho)
        inicio, fim = m.group(1), m.group(2)
        if inicio == "":
            inicio, fim = max(0, tamanho - int(fim or 0)), tamanho - 1
        else:
            inicio, fim = int(inicio), int(fim) if fim else tamanho - 1
        fim = min(fim, tamanho - 1)
        if inicio > fim:
            self.send_response(416)
            self.send_header("Content-Range", "bytes */%d" % tamanho)
            self.end_headers()
            return True
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(caminho))
        self.send_header("Content-Range", "bytes %d-%d/%d" % (inicio, fim, tamanho))
        self.send_header("Content-Length", str(fim - inicio + 1))
        self.end_headers()
        try:
            with open(caminho, "rb") as f:
                f.seek(inicio)
                restante = fim - inicio + 1
                while restante > 0:
                    bloco = f.read(min(1024 * 1024, restante))
                    if not bloco:
                        break
                    self.wfile.write(bloco)
                    restante -= len(bloco)
        except (BrokenPipeError, ConnectionResetError):
            pass
        return True

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def log_message(self, *args):
        pass


def main():
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    servidor = ThreadingHTTPServer(("127.0.0.1", porta), Handler)
    url = "http://localhost:%d/" % porta
    gerar_lista()
    print("Player rodando em %s  (Ctrl+C para parar)" % url)
    threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor parado.")


if __name__ == "__main__":
    main()
