// assets/js/offline-db.js
let db;
const initDB = indexedDB.open('BancoDenuncias', 1);

initDB.onupgradeneeded = (e) => {
    const bancoLocal = e.target.result;
    if (!bancoLocal.objectStoreNames.contains('denunciasPendentes')) {
        bancoLocal.createObjectStore('denunciasPendentes', { autoIncrement: true });
    }
};

initDB.onsuccess = (e) => db = e.target.result;

// Função para salvar offline e avisar o Service Worker
function salvarOffline(denuncia, callbackSucesso) {
    if (!db) return alert("Banco offline ainda carregando...");
    
    const transacao = db.transaction(['denunciasPendentes'], 'readwrite');
    transacao.objectStore('denunciasPendentes').add(denuncia);
    
    transacao.oncomplete = () => {
        if (callbackSucesso) callbackSucesso();
        
        // Avisa o SW para sincronizar quando a internet voltar
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(sw => sw.sync.register('sincronizar-denuncias'));
        }
    };
}