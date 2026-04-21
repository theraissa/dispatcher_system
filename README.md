# 🚗 Sistema de Despachante de Trânsito

Plataforma web que conecta clientes a despachantes de trânsito qualificados, permitindo encontrar profissionais próximos, visualizar serviços oferecidos e comparar valores de forma simples e transparente.

> ⚠️ **Projeto em desenvolvimento** — funcionalidades podem sofrer alterações.

## 📌 Visão Geral

O sistema é dividido em:

* **Frontend**: Interface web para clientes e despachantes
* **Backend**: API responsável pela lógica de negócio e autenticação
* **Banco de Dados**: PostgreSQL
* **Infraestrutura**: Docker para ambiente de desenvolvimento


## 🧰 Tecnologias Utilizadas

### Frontend

* React
* TypeScript
* Vite
* TailwindCSS

### Backend

* Python
* Flask
* SQLAlchemy
* JWT (autenticação)

### Infraestrutura

* Docker & Docker Compose
* PostgreSQL
* PgAdmin


## ⚙️ Pré-requisitos

Antes de rodar o projeto, você precisa ter instalado:

* Docker
* Docker Compose


## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd <nome-do-projeto>
```

---

### 2. Subir o ambiente com Docker

```bash
./dev.sh start
```

Isso irá iniciar em modo de desenvolvimento:
* Backend → http://localhost:5000
* Frontend → http://localhost:5173
* Banco de dados → porta 5432
* PgAdmin → http://localhost:5050

---

### 3. Parar o ambiente

```bash
./dev.sh stop
```

---

### 4. Reconstruir containers

```bash
./dev.sh build
```


## 🔍 Funcionalidades atuais

* Cadastro de usuários
* Login com autenticação JWT
* Busca de despachantes
* Visualização de perfis
* Estrutura base para permissões (client / dispatcher)



## 🧠 Estrutura do Projeto

```
/backend
  ├── services
  ├── models
  ├── routes
  ├── database

/frontend
  ├── components
  ├── pages
  ├── hooks
  ├── services
```
