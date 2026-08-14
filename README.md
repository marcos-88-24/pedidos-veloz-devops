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


CI/CD
Este projeto utiliza GitHub Actions para automatizar o ciclo de entrega contínua.
O pipeline está definido em .github/workflows/ci.yml e executa as seguintes etapas:

Build das imagens

Cada push na branch main dispara o workflow.

As imagens Docker dos serviços (pedidos, pagamentos, estoque) são construídas usando os respectivos Dockerfile.

Testes automatizados

Durante o build, são executados testes básicos para validar o funcionamento dos serviços.

Isso garante que apenas versões estáveis sejam publicadas.

Publicação no Docker Hub

Após o build e testes, as imagens são publicadas automaticamente no repositório Docker Hub (marcos001001).

O pipeline utiliza GitHub Secrets para armazenar credenciais de forma segura.

Deploy no Kubernetes (opcional)

O pipeline pode ser estendido para aplicar os manifests diretamente no cluster Kubernetes.

Isso garante que cada alteração no código seja refletida em produção com segurança.

Exemplo de fluxo
Desenvolvedor faz commit/push → GitHub Actions inicia pipeline.

Imagens são construídas e testadas.

Imagens são publicadas no Docker Hub.

Kubernetes consome as novas imagens e atualiza os pods via kubectl rollout restart.

Observabilidade
Para garantir confiabilidade e rastreabilidade entre os microsserviços, este projeto adota práticas de observabilidade:

Métricas

Cada serviço expõe métricas básicas de saúde via endpoints (/health).

É possível integrar Prometheus para coletar métricas de uso de CPU, memória e requisições.

Logs

Os serviços utilizam console.log para registrar eventos.

Em produção, recomenda-se integrar com uma stack de logs (ELK ou Loki) para centralizar e analisar os registros.

Tracing distribuído

A arquitetura pode ser estendida com OpenTelemetry ou Jaeger para rastrear requisições entre os serviços.

Isso facilita identificar gargalos e falhas em chamadas distribuídas.

Probes no Kubernetes

Os manifests incluem livenessProbe e readinessProbe para monitorar a saúde dos pods.

Isso garante que o Kubernetes reinicie automaticamente serviços que falhem.


Escalabilidade e Estratégia de Deploy
Estratégia de Deploy

O projeto utiliza Rolling Update, que é a estratégia padrão do Kubernetes.

Essa abordagem substitui gradualmente os pods antigos pelos novos, reduzindo o risco de indisponibilidade durante o deploy.

Alternativas como Blue/Green ou Canary podem ser aplicadas em cenários de maior criticidade, mas para este MVP o Rolling Update atende bem.

Escalabilidade Automática (HPA)

O Kubernetes permite escalar automaticamente os pods com base em métricas de uso (CPU/Memória).

Foi configurado um Horizontal Pod Autoscaler (HPA) para o serviço de Pedidos, garantindo que o sistema consiga atender picos de tráfego durante campanhas promocionais.

Exemplo de configuração:

yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: pedidos-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: pedidos-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70


## Metrics Server
Para habilitar a escalabilidade automática (HPA), foi instalado o Metrics Server no cluster Kubernetes:

kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

Em seguida, foram adicionados os argumentos:
--kubelet-insecure-tls
--kubelet-preferred-address-types=InternalIP,Hostname

Isso permite que o HPA colete métricas de CPU/memória e escale os pods dos serviços 


## Demonstração de Escalabilidade
Após gerar carga no serviço de Pedidos, o HPA aumentou o número de réplicas:

kubectl get hpa
pedidos-hpa   Deployment/pedidos-deployment   cpu: 75%/70%   2   10   4   5m

kubectl get pods
pedidos-deployment-abc123   Running
pedidos-deployment-def456   Running
pedidos-deployment-ghi789   Running
pedidos-deployment-jkl012   Running
