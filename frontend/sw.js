const CACHE_NAME = 'denuncia-pwa-v3';

const urlsToCache = [
  './',
  './index.html',
  './login.html',
  './cadastro.html',
  './style.css',
  './manifest.json',
  './img/test.png',
  './img/teste.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Ignora requisições pro servidor (Node), só faz cache dos arquivos front-end
  if (event.request.url.includes('localhost:3000')) return;

  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'sincronizar-denuncias') {
    event.waitUntil(processarDenunciasPendentes());
  }
});

function processarDenunciasPendentes() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BancoDenuncias', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['denunciasPendentes'], 'readwrite');
      const store = transaction.objectStore('denunciasPendentes');
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = async () => {
        const denuncias = getAllRequest.result;
        if (denuncias.length === 0) return resolve();

        // Faz o disparo real para o servidor Node
        for (let denuncia of denuncias) {
          try {
            await fetch('http://localhost:3000/denuncia', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(denuncia)
            });
          } catch (err) {
            console.error('Falha ao sincronizar:', err);
            return reject(err); // Se falhar, tenta de novo depois
          }
        }

        // Deu certo? Limpa o banco offline
        const clearTransaction = db.transaction(['denunciasPendentes'], 'readwrite');
        clearTransaction.objectStore('denunciasPendentes').clear();
        resolve();
      };
    };
  });
}