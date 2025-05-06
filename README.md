#  API para Gestão de Clínicas Médicas

Esta é uma API RESTful criada com foco em sistemas de agendamento e gerenciamento de clínicas médicas. Com ela, é possível cadastrar clínicas, médicos, clientes, agendar consultas e definir períodos de indisponibilidade como férias e folgas.

##  Funcionalidades

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

##  Tecnologias Utilizadas

- Node.js
- Express.js
- Sequelize
- MySQL
- JWT (JSON Web Tokens)
- Postman
- MySQL Workbench

 
##  Testando a API
Use o Postman ou outro cliente HTTP para testar os endpoints da API.

Alguns exemplos de rotas:

- POST /clinics
- POST /login
- POST /doctors
- POST /appointments
- GET /appointments?doctorId=1
- POST /unavailable-dates

## Sobre o Desenvolvedor
Sou estudante de Ciência da Computação na UFJF (2021–2025), com formação técnica em Informática (IFSEMG - 2018/2020) e curso de Desenvolvedor Web Front-End pela Codi Academy (2022/2023).

Tenho conhecimento em:

- Node.js
- JavaScript
- C#
- C++
- SQL

Atualmente estou em busca da minha primeira oportunidade como desenvolvedor, com foco em back-end.

## 📫 Contato: [Linkedin](www.linkedin.com/in/rafael-debussi)


