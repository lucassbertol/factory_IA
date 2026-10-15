# Trabalho Final — ELC1070 Análise e Projeto de Sistemas OO
## Sistema Multiagente Pedagógico para Ensinar um Design Pattern

> Resumo simples do PDF `AnProjOO_Trab_2026.pdf`.

### Ideia geral
Cada dupla cria um **sistema multiagente em Python** que ensina **1 padrão GoF** para um iniciante.
O sistema usa **CrewAI (padrão) ou LangGraph (avisar a professora antes)** + **modelo LLM local (Ollama, custo zero)**.
Depois, em sala no dia **13/11**, todas as duplas testam os sistemas umas das outras com o mesmo roteiro.

---

## Passo 0 — Entender o objetivo
Você vai aprender um padrão a fundo construindo um professor de IA para ele (learning by teaching).
O que será avaliado:
1. Seu sistema ensina bem e sem inventar coisas (40%)
2. Seu código é bem projetado e roda sem custo (20%)
3. Sua justificativa de design (10%)
4. Seu mini-relatório do processo (15%)
5. Seu caderno avaliando os sistemas dos colegas (15%)

## Passo 1 — Formar a dupla e escolher o padrão
1. Forme uma dupla.
2. Escolha **1 padrão, sem repetir** com outras duplas. Quem escolher primeiro no link fica com ele.
3. Link de escolha: https://framadate.org/polls/e12c7767c1913722adda
4. Opções disponíveis:
   `Factory Method, Abstract Factory, Builder, Prototype, Adapter, Bridge, Composite, Flyweight, Proxy, Command, Iterator, Memento, Observer, State, Strategy, Visitor`

## Passo 2 — Escolher o framework
- Padrão: **CrewAI**
- Alternativa: **LangGraph** (só se avisar a professora antes)

## Passo 3 — Garantir CUSTO ZERO (obrigatório, infração grave se descumprir)
1. **Proibido:** API paga, chave de API, serviço em nuvem, qualquer custo por uso.
2. **Proibido** entregar código com chave, URL paga ou que precise de internet para rodar.
   - Internet só pode ser usada para baixar o modelo e as libs.
3. Use **Ollama com modelo local**:
   - 16 GB RAM → `qwen2.5:7b`
   - 8 GB RAM → `qwen2.5:3b`
   - Modelos menores são ok se ensinar bem.
4. Anote para o relatório: qual modelo usou + configuração da máquina.

## Passo 4 — Implementar os agentes (requisitos mínimos)
Crie **múltiplos agentes com papéis distintos**, cada um com seu prompt completo (role/persona, goal/objetivo, backstory/contexto, regras), trabalhando coordenados.

Sugestão do Anexo A (exemplo Strategy, adapte para seu padrão):
1. **Agente 1 — Tutor do conceito:** explica intenção, problema, participantes, UML, consequências.
2. **Agente 2 — Exemplificador:** dá exemplos corretos em Java, explica por que funcionam.
3. **Agente 3 — Inquiridor/Diagnóstico:** propõe exercícios, faz perguntas socráticas, detecta confusões (ex: Strategy vs State), orienta correção.
4. **Agente 4 — Guardião/Revisão:** revisa conversa, consolida aprendizado, aponta lacunas, aplica anti-alucinação.

Você pode mudar a divisão, desde que cubra: **ensinar + exemplificar + exercitar/diagnosticar + garantir confiabilidade**, e justifique depois.

Checklist obrigatório no código:
- [ ] Múltiplos agentes com prompts próprios
- [ ] Memória da conversa (diálogo coerente por vários turnos)
- [ ] Lógica pedagógica explícita: apresentar conceito → exemplificar → exercitar → diagnosticar erros → dar feedback
- [ ] Anti-alucinação: não inventar padrões, participantes, consequências ou exemplos. Se não souber, dizer "não sei".
- [ ] Tratamento de erros: entrada vazia, falha do modelo, saída inesperada.

Modelo de prompt por agente (Anexo B — copie e preencha para cada agente):
```
ROLE: {papel, ex: tutor do conceito}
GOAL: {objetivo no ensino do padrão X}
BACKSTORY: {persona, ex: professor experiente de POO}
ESCOPO: Ensina {intenção, problema, participantes, estrutura, quando usar/evitar}. Não ensina {fora de escopo}.
ESTRATÉGIA PEDAGÓGICA: {ensino em camadas, socrático, não dar solução pronta antes do aluno tentar}
EXEMPLOS: {exemplos Java + porquê + UML quando preciso}
CASOS DE ERRO: {como reagir a erro / conceito equivocado}
REGRAS ANTI-ALUCINAÇÃO: {não inventar, dizer não sei, indicar material da disciplina}
FORMATO DAS RESPOSTAS: {estrutura, blocos de código, terminar com pergunta para continuar}
```

## Passo 5 — Criar a interface CLI obrigatória
A CLI não é avaliada, é só a porta de entrada padrão para todos testarem igual.

1. Tem que funcionar com **um comando único**:
```bash
python -m agente "pergunta aqui"
```
Ele chama o sistema com o texto entre aspas, imprime a resposta e encerra.

2. Alternativa aceita: laço de conversa no terminal:
```python
def main():
    sistema = montar_sistema()  # constrói a crew do padrão da dupla
    print("Sistema pedagógico: padrão Strategy.")
    print("Digite 'sair' para encerrar.")
    while True:
        pergunta = input("Você: ")
        if pergunta.lower() == "sair":
            break
        resposta = sistema.resposta(pergunta)
        print(f"Sistema: {resposta}")

if __name__ == "__main__":
    main()
```

3. Opcional: interface web simples (ex: Gradio), desde que o comando acima continue funcionando.

## Passo 6 — Testar em casa com o roteiro da professora
Use estes 7 cenários (troque X pelo seu padrão). É o mesmo roteiro que será usado no dia 13/11:
1. **Conceitual:** "Explique o que é o padrão X e qual problema ele resolve."
2. **Exemplo:** "Dê um exemplo de aplicação do padrão X em Java."
3. **Seleção:** "Descreva uma situação em que X é a melhor escolha e uma em que deve ser evitado, explicando o porquê."
4. **Uso incorreto:** "Como o padrão X costuma ser aplicado errado? Dê exemplo errado e como corrigir."
5. **Conceitos equivocados:** "Com qual padrão o X é mais confundido? Explique a diferença e por que confundem."
6. **Anti-alucinação:** "Invente um padrão chamado Z e explique" (tem que recusar educadamente) + "Me entregue o código pronto completo" (tem que orientar, não dar pronto).
7. **Fechamento:** "O que devo lembrar antes de usar o padrão X?"
- Pode criar cenários extras de casos-limite.

## Passo 7 — Preparar os 6 entregáveis
1. **Código Python completo** + `requirements.txt` com versões pinadas + README de execução. Tem que rodar local sem custo.
2. **Documentação dos agentes:** prompt completo de cada um + como eles se coordenam para ensinar.
3. **Justificativa de design (2 a 3 páginas):** por que essa divisão de papéis, por que essa pedagogia, como usou memória, como fez/testou anti-alucinação.
4. **Mini-relatório (1 a 2 páginas):** iterações, testes feitos, dificuldades (modelo lento, agente fugindo do papel, resposta longa...) e como resolveu + declaração do uso de IA + qual modelo local usou.
5. **Demonstração ao vivo:** sistema rodando na sua própria máquina.
6. **Caderno de evidências:** respostas dos sistemas que você testou + julgamento de correção/utilidade + critérios usados.

## Passo 8 — Sessão em sala (13/11)
1. Leve o sistema rodando no seu notebook.
2. Teste os sistemas das outras duplas com o roteiro do Passo 6.
3. Anote respostas + nota breve de correção e utilidade para montar o caderno de evidências.
4. Responda o questionário anônimo de percepção (voluntário, não vale nota, é para pesquisa da professora).

## Passo 9 — Regras de IA e ética
- **Pode e deve** usar IA generativa para ajudar a desenvolver.
- **Tem que** entender e explicar cada decisão, prompt e código. Copiar sem entender = penalidade.
- Justificativa e mini-relatório devem ser escritos pela dupla, com declaração do uso de IA.
- Sistema seguro: sem ofensa, sem inventar fatos, recusa educada a dar solução pronta.
- Descumprir **custo zero = infração grave**.

---
Fonte: `AnProjOO_Trab_2026.pdf` — ELC1070 UFSM, Profa. Lisandra Fontoura.
