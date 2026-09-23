<?xml version="1.0" encoding="UTF-8"?>
<!-- Só muda a aparência do sitemap no navegador. Buscadores leem o sitemap.xml e ignoram este arquivo. -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>Sitemap | VK Hub</title>
        <style>
          body{margin:0;padding:32px 16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1d1d1f;background:#f6f6f7}
          main{max-width:1040px;margin:0 auto}
          h1{font-size:26px;margin:0 0 6px}
          p{margin:0 0 20px;color:#555}
          a{color:#c4213f;word-break:break-all}
          table{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}
          th,td{padding:12px 14px;text-align:left;border-bottom:1px solid #eee;font-size:14px;vertical-align:top}
          th{background:#111;color:#fff;font-weight:600}
          td.n{text-align:center;white-space:nowrap;color:#555}
          @media (max-width:640px){th.o,td.o{display:none}}
        </style>
      </head>
      <body>
        <main>
          <h1>Sitemap do VK Hub</h1>
          <p><xsl:value-of select="count(s:urlset/s:url)"/> páginas. Este arquivo é lido pelo Google, Bing e outros buscadores.</p>
          <table>
            <tr><th>Página</th><th class="o">Imagens</th><th class="o">Idiomas</th><th>Atualizada em</th></tr>
            <xsl:for-each select="s:urlset/s:url">
              <tr>
                <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                <td class="n o"><xsl:value-of select="count(image:image)"/></td>
                <td class="n o"><xsl:value-of select="count(xhtml:link)"/></td>
                <td class="n"><xsl:value-of select="s:lastmod"/></td>
              </tr>
            </xsl:for-each>
          </table>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
