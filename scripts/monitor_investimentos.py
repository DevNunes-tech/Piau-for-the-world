from __future__ import annotations

import json
import sys
from datetime import datetime, timezone

import requests
from bs4 import BeautifulSoup


def monitorar_investimentos(limit: int = 8) -> list[dict[str, str]]:
    url = "https://investepiaui.com/noticias"
    headers = {"User-Agent": "Mozilla/5.0 (compatible; PiauíVivaBot/1.0; +https://example.local)"}

    response = requests.get(url, headers=headers, timeout=25)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    investimentos: list[dict[str, str]] = []

    for noticia in soup.select("div.noticia-item")[:limit]:
        titulo_el = noticia.find("h3")
        data_el = noticia.find("span", class_="data")
        if not titulo_el:
            continue
        titulo = titulo_el.get_text(strip=True)
        data_str = data_el.get_text(strip=True) if data_el else ""

        investimentos.append(
            {
                "titulo": titulo,
                "data": data_str,
                "origem": "Investe Piauí",
                "tipo": "Desenvolvimento/Negócios",
                "coletado_em": datetime.now(timezone.utc).isoformat(),
            }
        )

    return investimentos


def main() -> int:
    try:
        items = monitorar_investimentos()
    except Exception as exc:  
        print(f"Erro ao coletar: {exc}", file=sys.stderr)
        return 1

    print(json.dumps(items, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
