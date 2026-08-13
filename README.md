# Pedidos Veloz - Microsserviços

Projeto da disciplina de Cloud DevOps.  
A aplicação simula um sistema de e-commerce com três serviços principais:

- **Pedidos** (porta 3001)
- **Pagamentos** (porta 3002)
- **Estoque** (porta 3003)
- **Banco de Dados MySQL** (porta 3306)

---

## Pré-requisitos
- Docker
- Docker Compose
- Kubernetes (kubectl configurado)

---

## Executando com Docker Compose

Clone o repositório:

git clone <URL_DO_REPO>
cd pedidos-veloz-devops
Suba os serviços:


docker-compose up --build
Acesse:

http://localhost:3001/pedidos

http://localhost:3002/pagamentos

http://localhost:3003/estoque

Exemplos de requisições
Criar pedido:


curl -X POST http://localhost:3001/pedidos \
  -H "Content-Type: application/json" \
  -d '{"produto":"Notebook","status":"novo"}'
Listar pedidos:


curl http://localhost:3001/pedidos
Criar pagamento:


curl -X POST http://localhost:3002/pagamentos \
  -H "Content-Type: application/json" \
  -d '{"pedido_id":1,"valor":1500.00,"status":"pago"}'
Consultar estoque:


curl http://localhost:3003/estoque
Credenciais do banco MySQL
Usuário: marcos

Senha: 123456878

Banco: db_sistema

Porta: 3306

Executando no Kubernetes
Aplicar os manifests:


kubectl apply -f k8s/pedidos/
kubectl apply -f k8s/pagamentos/
kubectl apply -f k8s/estoque/
kubectl apply -f k8s/mysql/
Verifique os pods:


kubectl get pods
Acesse via NodePort:

http://localhost:30001/pedidos

http://localhost:30002/pagamentos

http://localhost:30003/estoque

