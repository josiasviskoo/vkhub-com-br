# Rotina de otimização SEO + GEO (VK Hub)

Rotina para aplicar em **toda página nova** e também em **páginas antigas**.
Objetivo: a página ser encontrada e indexada de forma rápida e simples (Google, Bing e IAs como ChatGPT, Claude e Perplexity).

## Regra de ouro

**Não alterar o conteúdo visível da página**: nenhum texto, imagem, layout ou CSS existente muda.
A rotina só mexe em:

- bloco de metadados dentro do `<head>` (entre `<!-- seo:start -->` e `<!-- seo:end -->`)
- `sitemap.xml`
- `llms.txt`
- card na home (`index.html`) e lista `ItemList` do JSON-LD da home
- `robots.txt` (só se surgir um bot novo)

Se a página já tem `<title>` e `<meta name="description">`, eles são **substituídos** pelos do bloco `seo` (para não duplicar). Se o texto atual for bom, reaproveite-o.

## Checklist para página nova

Slug da pasta = título do produto, em minúsculas, sem acento, com hífens (ex.: `pudim-100-receitas-irresistiveis-ebook`). Página em `<slug>/index.html`, com URL final `https://vkhub.com.br/<slug>/`.

### 1. Bloco de SEO no `<head>`

Inserir logo após `<meta name="viewport">`:

```html
<!-- seo:start -->
<title>Nome do Produto: Benefício Principal | Formato</title>          <!-- até ~60 caracteres -->
<meta name="description" content="...">                                <!-- 130 a 160 caracteres, com preço/formato se houver -->
<meta name="author" content="Josias Viskoo">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="https://vkhub.com.br/<slug>/">
<meta property="og:type" content="product">                            <!-- "book" para livro na Amazon -->
<meta property="og:site_name" content="VK Hub">
<meta property="og:locale" content="pt_BR">                            <!-- en_US / es_ES nas versões em outro idioma -->
<meta property="og:title" content="(igual ao title)">
<meta property="og:description" content="(igual à description)">
<meta property="og:url" content="https://vkhub.com.br/<slug>/">
<meta property="og:image" content="https://vkhub.com.br/<slug>/<caminho-da-capa>">   <!-- URL absoluta -->
<meta property="og:image:alt" content="descrição da imagem">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="(mesma URL absoluta da capa)">
<script type="application/ld+json">{ ... }</script>
<!-- seo:end -->
```

Regras:
- Título e description **únicos** (nunca repetir de outra página).
- URLs de imagem e canonical sempre **absolutas**, com `https://vkhub.com.br/` e barra final nas pastas.
- Usar como imagem a capa/hero que **já existe** na página, sem criar nem editar imagens.

### 2. JSON-LD (`@graph`)

Manter esta ordem, reutilizando os mesmos `@id` em todas as páginas:

| Nó | `@id` | Observação |
|---|---|---|
| `Organization` | `https://vkhub.com.br/#organization` | VK Hub, `founder` aponta para Josias |
| `Person` | `https://vkhub.com.br/#josias` | Josias Viskoo |
| `WebSite` | `https://vkhub.com.br/#website` | `inLanguage` conforme a página |
| `WebPage` | `<url>#webpage` | `dateModified`, `breadcrumb`, `primaryImageOfPage`, `about` → produto |
| `BreadcrumbList` | `<url>#breadcrumb` | VK Hub (1) → produto (2) |
| `Product` **ou** `Book` | `<url>#produto` / `#livro` | ver abaixo |
| `FAQPage` | (sem id) | só se a página **já tem FAQ visível**; copiar as mesmas perguntas e respostas |

Escolha do tipo:
- **Product**: e-book, pacote, template, ferramenta com checkout próprio (Kiwify, Hotmart, Stripe, WhatsApp). Incluir `sku`, `brand`, `category`, `keywords`, `image` e `offers` (`price` com ponto decimal, `priceCurrency: BRL`, `availability`, `url` do checkout, `seller`).
- **Book**: livro na Amazon (`bookFormat`, `numberOfPages`, `datePublished`, `sameAs` = link da Amazon, `isAccessibleForFree: false`).

Regras de honestidade (o Google penaliza dado que não bate com a página):
- Só declarar **preço que aparece na página**. Sem preço visível, omitir `offers`.
- **Nunca** inventar `aggregateRating`, `review`, número de avaliações ou de vendas.
- FAQ no schema = FAQ visível na página, palavra por palavra.

### 3. `sitemap.xml`

Adicionar antes de `</urlset>`:

```xml
<url>
  <loc>https://vkhub.com.br/<slug>/</loc>
  <lastmod>AAAA-MM-DD</lastmod>
  <image:image>
    <image:loc>https://vkhub.com.br/<slug>/<capa></image:loc>
    <image:caption>Legenda da imagem</image:caption>
  </image:image>
</url>
```

Ao alterar uma página antiga, atualizar o `lastmod` dela. Validar com `xmllint --noout sitemap.xml`.

### 4. `llms.txt` (GEO)

Adicionar em "Produtos" uma linha: `- [Nome](URL): descrição de 1 frase` (pode usar a própria meta description). Se surgir novo tipo de produto, atualizar também a frase de resumo no topo do arquivo. Páginas em outro idioma entram também na seção "Idiomas".

### 5. Home (`index.html`)

1. Copiar a capa para `images/` da raiz (ex.: `images/capa-<slug>.jpg`), pois os cards da home usam imagens da pasta `images/`.
2. Adicionar o card seguindo o padrão existente (`.cartao-produto` dentro de `.col2`, imagem `.produto-img r2x1`, `loading="lazy"`, `target="_blank" rel="noopener noreferrer"`). Dois cards por `.sec-linha`.
3. Adicionar o produto no `ItemList` do JSON-LD da home (`position` sequencial) e atualizar `numberOfItems`.
4. Se a `description` da home citar categorias, incluir a nova (mantendo `og:description` e `twitter:description` iguais).
5. Atualizar `dateModified` do `WebPage` e o `lastmod` da home no sitemap.

### 6. `robots.txt`

Já libera todos os rastreadores de busca e de IA (Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot) e aponta para o sitemap. Só mexer se surgir um bot novo. **Não bloquear** pastas de produto.

## Aplicar em páginas antigas

Para cada pasta existente:

1. Ler o `<head>`. Se já tem bloco `seo:start`, só conferir o checklist e atualizar `dateModified`.
2. Se não tem, montar o bloco com **os textos que a página já usa** (título, promessa, FAQ, preço).
3. Conferir presença no `sitemap.xml`, no `llms.txt` e na home.

## Indexação rápida (depois de publicar)

1. Publicar (push para `main`) e abrir `https://vkhub.com.br/<slug>/` no navegador para confirmar que carrega.
2. **Google Search Console**: propriedade `vkhub.com.br` → "Inspeção de URL" → colar a URL → **Solicitar indexação**. Enviar `sitemap.xml` em Sitemaps (só na primeira vez).
3. **Bing Webmaster Tools**: "Enviar URLs" (ou importar o site do Search Console). O Bing alimenta também ChatGPT Search e outras IAs.
4. Deixar a página linkada a partir da **home** (o card faz isso) para o rastreador achá-la sozinho.

Opcional: [IndexNow](https://www.indexnow.org/) para avisar Bing/Yandex na hora, quando houver muitas páginas novas.

## Validação antes do commit

```bash
# JSON-LD válido em todas as páginas alteradas
python3 - <<'EOF'
import json, re, sys
for f in sys.argv[1:] or ["index.html"]:
    for m in re.finditer(r'ld\+json">(.*?)</script>', open(f, encoding="utf-8").read(), re.S):
        json.loads(m.group(1)); print("ok", f)
EOF

xmllint --noout sitemap.xml          # sitemap válido
grep -c "seo:start" <slug>/index.html   # deve ser 1
git diff --stat                      # conferir que só metadados/cards mudaram
```

Conferência manual final:
- [ ] Nenhum texto, imagem ou CSS da página foi alterado
- [ ] `title` e `description` únicos, dentro dos tamanhos
- [ ] Canonical e imagens com URL absoluta
- [ ] Preço/FAQ do schema batem com o que está visível
- [ ] Presente no sitemap, no llms.txt e na home
- [ ] Rich Results Test (https://search.google.com/test/rich-results) sem erros, quando a página for importante

## Pedido rápido ao Claude

> Aplique a rotina de `OTIMIZACAO-SEO-GEO.md` na pasta `<slug>` (ou "em todas as páginas"), sem alterar textos nem imagens.
