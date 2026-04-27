# Aplica-o_PWA
Criei uma Aplicação em PWA para testes e aprendizado

-----

O que é um PWA?

- Um PWA de maneira bem resumida tem o nome como base de Progressive Web App, ou seja, aplicativo progressivo para web

Um PWA é uma aplicação web construído como um site comum em html, css e javascript porem que traz uma experiência totalmente diferente dos sites normais, pois não se engloba a funcionalidade de responsividade pois ele traz a experiencia em um aplicativo igual os que baixamos a PlayStore, porem é na web pelo navegador do seu celular, sendo assim ele tenta unir o melhor dos dois mundos, alcance da web e as funcionalidades avançadas de um aplicativo

-----

# 🛡️ App Seguro de Denúncias Anônimas (PWA)

Uma aplicação web progressiva (PWA) desenvolvida para envio de denúncias anônimas através de um chat em tempo real, com suporte avançado para funcionamento offline e arquitetura MVC.

## 🚀 Funcionalidades

* **Chat em Tempo Real:** Comunicação instantânea utilizando WebSockets (Socket.io).
* **Suporte Offline (PWA):** Uso de Service Workers e cache local para permitir o acesso e digitação mesmo sem conexão com a internet.
* **Sincronização em Segundo Plano:** Denúncias feitas offline são salvas no `IndexedDB` e enviadas automaticamente (Background Sync) assim que a conexão é restabelecida.
* **Status de Mensagem:** Sistema de visualização de status em tempo real (✓ Enviado, ✓✓ Entregue, ✓✓ Lido) integrado ao banco de dados.
* **Autenticação Segura:** Cadastro e login de identidades falsas (anônimas) com senhas criptografadas (`bcryptjs`).
* **Testes Mobile Dinâmicos:** Geração automática de QR Code no terminal exibindo o IP local para testes rápidos em smartphones na mesma rede Wi-Fi.

## 🛠️ Tecnologias Utilizadas

### Front-end (Modularizado)
* HTML5, CSS3 e JavaScript (Vanilla)
* **PWA:** Web App Manifest, Service Workers
* **Banco Local:** IndexedDB (para fila de mensagens offline)
* **Comunicação:** Fetch API e Socket.io-client

### Back-end (Arquitetura MVC)
* **Ambiente:** Node.js
* **Framework Web:** Express
* **Tempo Real:** Socket.io
* **Banco de Dados:** MySQL (driver `mysql2` com Promises)
* **Segurança:** `bcryptjs` (Hash de senhas), `cors`
* **Utilitários:** `qrcode-terminal` (Para acesso mobile via rede local)

## 📁 Estrutura do Projeto

O projeto adota uma separação clara de responsabilidades:
- O **Front-end** (`/assets`) separa CSS, scripts de API, banco offline e lógica de interface.
- O **Back-end** (`/src`) utiliza a arquitetura MVC (Models, Views, Controllers), isolando as rotas da lógica de negócio e eventos do Socket.io.

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) instalado.
* Um servidor MySQL (como [XAMPP](https://www.apachefriends.org/pt_br/index.html) ou MySQL nativo).

### 1. Clonar e Instalar Dependências
No terminal, clone o repositório e instale os pacotes necessários:
```bash
git clone [https://github.com/SEU_USUARIO/Aplicacao_PWA.git](https://github.com/SEU_USUARIO/Aplicacao_PWA.git)
cd Aplicacao_PWA/backend-denuncias
npm install
