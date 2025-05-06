# 🏥 API para Gestão de Clínicas Médicas

Esta é uma API RESTful criada com foco em sistemas de agendamento e gerenciamento de clínicas médicas. Com ela, é possível cadastrar clínicas, médicos, clientes, agendar consultas e definir períodos de indisponibilidade como férias e folgas.

## 🚀 Funcionalidades

- CRUD de Clínicas, Médicos, Clientes e Telefones
- Agendamento de Consultas com as seguintes validações:
  - Horário já ocupado por outro cliente
  - Médicos em férias ou folga
  - Domingos e feriados nacionais
- Listagem de médicos por especialidade e clínica
- Atualização de senha de clínicas
- Relacionamentos entre entidades usando Sequelize
- Autenticação com JWT
- Paginação e ordenação nas listagens

## 🧰 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [MySQL](https://www.mysql.com/)
- [JWT (JSON Web Tokens)](https://jwt.io/)
- [Postman](https://www.postman.com/) para testes


