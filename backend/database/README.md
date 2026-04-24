# 📦 Estrutura do Banco de Dados

Este documento descreve a modelagem do banco de dados do sistema **Dispatcher System**, incluindo entidades, relacionamentos e regras de negócio implícitas.

---

## 🧠 Visão Geral

O sistema é baseado em três pilares principais:

* 👤 **Usuários (User)**
* 🧑‍💼 **Despachantes (Dispatcher)**
* 🎫 **Chamados (Ticket)**

Além disso, há suporte para:

* Catálogo de serviços
* Avaliações
* Mensagens (chat)
* Timeline de eventos

---

## 🗂️ Entidades

### 👤 User

Representa qualquer usuário do sistema (cliente ou despachante).

**Campos principais:**

* `id`
* `cpf`
* `name`
* `email`
* `password`
* `deleted_at` (soft delete)

**Relacionamentos:**

* 1:1 → Address
* 1:1 → Dispatcher
* 1:N → Ticket
* 1:N → TicketMessage

---

### 📍 Address

Endereço do usuário.

**Regra importante:**

* Um usuário possui **apenas um endereço** (`unique=True`)

---

### 🧑‍💼 Dispatcher

Representa o despachante (profissional).

**Campos importantes:**

* `status`: `pendente | aprovado | rejeitado`
* `regis_crdd`

**Relacionamentos:**

* 1:1 → User
* 1:1 → Profile
* 1:1 → Office
* 1:N → ServiceDetails
* 1:N → Ticket

---

### 🪪 Profile

Perfil público do despachante.

**Exemplo de dados:**

* Foto
* Instagram
* WhatsApp
* Website

---

### 🏢 Office

Dados do estabelecimento do despachante.

---

### 🛠️ Service

Catálogo global de serviços disponíveis no sistema.

**Exemplo:**

* Transferência de veículo
* Licenciamento
* Emplacamento

---

### 🔗 ServiceDetails

Tabela de vínculo entre **Despachante ↔ Serviço**

**Função:**

* Define quais serviços um despachante oferece
* Permite customização (ex: preço)

**Campos importantes:**

* `dispatcher_id`
* `service_id`
* `price`

---

### 🎫 Ticket

Representa um chamado aberto por um usuário.

**Relaciona:**

* Cliente (`user`)
* Despachante (`dispatcher`)
* Serviço (`service_details`)

**Status:**

* `pendente`
* `em andamento`
* `finalizado`
* `encerrado`

---

### 🕒 TicketTimeline

Histórico de eventos do chamado.

**Exemplo:**

* Status alterado
* Atualizações do sistema

---

### 💬 TicketMessage

Chat entre cliente e despachante dentro do chamado.

**Campos:**

* `message`
* `is_system_message`

---

### ⭐ TicketReview

Avaliação do cliente após finalização do chamado.

**Regras importantes:**

* Um ticket pode ter **apenas uma avaliação**
* `rating`: de 1 a 5

---

## 🔄 Relacionamentos (Resumo)

```
User
 ├── Address (1:1)
 ├── Dispatcher (1:1)
 ├── Ticket (1:N)
 └── TicketMessage (1:N)

Dispatcher
 ├── Profile (1:1)
 ├── Office (1:1)
 ├── ServiceDetails (1:N)
 └── Ticket (1:N)

Service
 └── ServiceDetails (1:N)

ServiceDetails
 └── Ticket (1:N)

Ticket
 ├── Timeline (1:N)
 ├── Message (1:N)
 └── Review (1:1)
```
