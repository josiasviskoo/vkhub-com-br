// Service worker do player: guarda os vídeos no cache do navegador para não baixar de novo.
//
// - Vídeo já no cache: responde dali, recortando o trecho (Range) que o <video> pedir.
// - Vídeo fora do cache: quando o <video> pede o arquivo desde o início ("bytes=0-"),
//   baixa uma única vez o arquivo inteiro e divide o download em dois: um vai para o
//   player e o outro para o cache. Pedidos de outros trechos (avançar o vídeo) vão
//   direto para a rede enquanto o download não termina.
// - O botão "baixar tudo" da página baixa e guarda os vídeos ela mesma: esses pedidos vêm
//   com o cabeçalho X-Player-Baixar e passam direto por aqui.
// - O botão "limpar" da página apaga o cache inteiro (caches.delete).
// - A página (index.html) e o lista.js ficam num cache à parte, buscados primeiro na rede
//   e, sem internet, servidos dali — assim o player abre off-line.
var CACHE = 'player-videos-v2';
var APP = 'player-app-v1';
var VIDEO = /\.(mp4|webm|ogv|ogg|mov|m4v|mkv)$/i;
var baixando = {}; // urls sendo guardadas agora, para não baixar a mesma duas vezes

self.addEventListener('install', function () { self.skipWaiting(); });
// Ao trocar o nome do CACHE (ex.: vídeos reconvertidos), apaga os caches antigos.
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (nomes) {
    return Promise.all(nomes.filter(function (n) { return n !== CACHE && n !== APP; })
      .map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  var chave = url.origin + url.pathname;
  if (VIDEO.test(url.pathname)) {
    if (req.headers.get('X-Player-Baixar')) return;
    e.respondWith(responder(e, req, chave));
  } else if (req.mode === 'navigate' || /\/lista\.js$/.test(url.pathname)) {
    e.respondWith(redePrimeiro(e, req, chave));
  }
});

function redePrimeiro(e, req, chave) {
  return fetch(req).then(function (resp) {
    if (resp.ok) {
      var copia = resp.clone();
      e.waitUntil(caches.open(APP).then(function (cache) { return cache.put(chave, copia); }).catch(function () {}));
    }
    return resp;
  }, function (err) {
    return caches.open(APP).then(function (cache) { return cache.match(chave); }).then(function (salvo) {
      if (salvo) return salvo;
      throw err;
    });
  });
}

function responder(e, req, chave) {
  var range = req.headers.get('Range');
  return caches.open(CACHE)
    .then(function (cache) { return cache.match(chave); })
    .then(function (salvo) {
      if (salvo) return recortar(salvo, range);
      if ((!range || /^bytes=0-$/.test(range)) && !baixando[chave]) return baixarESalvar(e, chave);
      return fetch(req);
    })
    .catch(function () { return fetch(req); });
}

function baixarESalvar(e, chave) {
  baixando[chave] = true;
  return fetch(chave).then(function (resp) {
    var tamanho = resp.headers.get('Content-Length');
    if (resp.status !== 200 || !resp.body || !tamanho) {
      delete baixando[chave];
      return resp;
    }
    var tipo = resp.headers.get('Content-Type') || 'video/mp4';
    var partes = resp.body.tee();
    var guardar = caches.open(CACHE).then(function (cache) {
      return cache.put(chave, new Response(partes[1], {
        headers: { 'Content-Type': tipo, 'Content-Length': tamanho }
      }));
    }).catch(function () {}).then(function () { delete baixando[chave]; });
    e.waitUntil(guardar);
    var total = Number(tamanho);
    return new Response(partes[0], {
      status: 206,
      headers: {
        'Content-Type': tipo,
        'Content-Length': tamanho,
        'Content-Range': 'bytes 0-' + (total - 1) + '/' + total,
        'Accept-Ranges': 'bytes'
      }
    });
  }, function (err) {
    delete baixando[chave];
    throw err;
  });
}

function recortar(salvo, range) {
  var tipo = salvo.headers.get('Content-Type') || 'video/mp4';
  return salvo.blob().then(function (blob) {
    var total = blob.size;
    var m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!m) {
      return new Response(blob, {
        status: 200,
        headers: { 'Content-Type': tipo, 'Content-Length': String(total), 'Accept-Ranges': 'bytes' }
      });
    }
    var inicio, fim;
    if (m[1] === '') {
      inicio = Math.max(0, total - Number(m[2] || 0));
      fim = total - 1;
    } else {
      inicio = Number(m[1]);
      fim = m[2] ? Math.min(Number(m[2]), total - 1) : total - 1;
    }
    if (inicio > fim) {
      return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + total } });
    }
    return new Response(blob.slice(inicio, fim + 1), {
      status: 206,
      headers: {
        'Content-Type': tipo,
        'Content-Length': String(fim - inicio + 1),
        'Content-Range': 'bytes ' + inicio + '-' + fim + '/' + total,
        'Accept-Ranges': 'bytes'
      }
    });
  });
}
