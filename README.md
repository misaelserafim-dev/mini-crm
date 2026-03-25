# Mini CRM - Atendimento

---

## 🏗️ Arquitetura & Tecnologias

* **Domínios de Negócio:** Pacientes, Agendamentos... tudo separado por domínio para facilitar a compreensão e manutenção e por ser um padrão do mercado que evita mistura de lógicas.
* **Backend:** Node.js + Fastify + Prisma

  * Prisma facilita a interação com o banco, desde relacionamentos simples até os mais complexos usando `@relation`, mantendo segurança de tipos.
  * Fastify oferece boa performance e simplicidade no desenvolvimento.
* **Frontend:** React + Vite

  * Vite para desenvolvimento rápido e como padrão do mercado.
  * CSS puro para maior liberdade e velocidade na criação de estilos.
* **Docker:** Toda a aplicação está containerizada, garantindo consistência entre ambientes.

---

## 🏛️ Decisões de Arquitetura

Durante o desenvolvimento fiz algumas escolhas e alguns tradeoffs foram feitos:

* **Estrutura de Projeto:** 

Separei por domínios de negócio (Pacientes e Agendamentos) para manter cada parte isolada e fácil de evoluir, além da minha familiaridade com essa estrutura no dia a dia.

* **O que foi deixado de fora:**

  * Autenticação/Autorização: Não incluí para manter o escopo pequeno e focado na lógica central do CRM.
  * Frontend state management complexo (Redux/Zustand): deixei de lado, e optei por `useState` e `useEffect` já que o projeto é pequeno e não exige gerenciamento global sofisticado.
  * Optei também por não utilizar cache neste projeto, pois o volume de dados é pequeno e a estrutura atual já garante uma boa performance

* **Tradeoffs relevantes:**

  * Testes frontend foram manuais em vez de automatizados, para priorizar o tempo nas funcionalidades.
  * Usei CSS puro em vez de frameworks prontos pois sou mais ágil no estilo e também no controle total sobre o design', mesmo que demandasse mais tempo de implementação. 
  * Devido ao prazo, optei por utilizar alerts nativos para mensagens de erro e sucesso.

---

## 🛠️ Como Rodar

1. Clone o repositório.
2. Na raiz do projeto, rode:

```bash
docker compose up -d --build
```

3. Acesse no navegador:

* **Frontend:** [http://localhost:8080](http://localhost:8080)
* **API (Docs/JSON):** [http://localhost:3333/patients](http://localhost:3333/patients)

---

## ⚙️ Configurações (.env)

Os `.env` já estão configurados dentro dos containers.

**Backend:**

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/mini_crm"
```

*Obs: Dentro do Docker, o host do banco é 'db'*

**Frontend:**

```env
VITE_API_URL=http://localhost:3333
```

---

## 🧪 Testes

* **Backend:** Testes unitários focados na lógica e regras de negócio.

```bash
docker compose exec backend npx vitest run
```

* **Frontend:** Testes manuais nos fluxos de navegação e usabilidade.

---

## 📂 Organização de Pastas

```plaintext
├── backend/           # API, Prisma Schema e Domínios
├── frontend/          # React App, Assets e Componentes, Utils
├── docker-compose.yml # serviços do docker
```
