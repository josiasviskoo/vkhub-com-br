#!/usr/bin/env bash
# Inicia o player: gera a lista de pastas/vídeos e abre no navegador
cd "$(dirname "$0")" && exec python3 servidor.py "$@"
