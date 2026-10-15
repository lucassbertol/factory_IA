# Instalação do ambiente do trabalho --- Windows e Linux

Este guia reúne os passos do documento original para configurar Python,
ambiente virtual, Ollama, o modelo Qwen e CrewAI. Os comandos estão
separados por sistema operacional.

## Requisitos

-   Python **3.10 a 3.13**; recomenda-se Python 3.12 ou 3.13 de 64 bits.
-   Ollama instalado.
-   Modelo `qwen2.5:3b` (aproximadamente 2 GB). Se o computador tiver 16
    GB de RAM, o documento sugere considerar `qwen2.5:7b`.
-   Conexão com a internet para instalar os componentes e baixar o
    modelo. Depois de baixado, o modelo pode rodar localmente/offline.

> **Observação:** o documento original alerta que versões muito recentes
> do Python podem não funcionar com o CrewAI. Por isso, prefira Python
> 3.12 ou 3.13, em vez de instalar automaticamente a versão mais nova.

------------------------------------------------------------------------

# Windows (PowerShell)

## 1. Verificar o Python

Abra o PowerShell e execute:

``` powershell
python --version
```

Se aparecer uma versão entre `Python 3.10.x` e `Python 3.13.x`, prossiga
para a próxima etapa.

Se o comando não for reconhecido ou abrir a Microsoft Store:

1.  Baixe Python 3.12 ou 3.13 de 64 bits em
    <https://www.python.org/downloads/>.
2.  Durante a instalação, marque **Add Python to PATH**, se essa opção
    for apresentada.
3.  Feche e abra novamente o PowerShell.
4.  Verifique novamente:

``` powershell
python --version
```

## 2. Criar o projeto e o ambiente virtual

``` powershell
mkdir meu_agente
cd meu_agente
python -m venv .venv
```

Ative o ambiente virtual:

``` powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\.venv\Scripts\Activate.ps1
```

O prompt deve passar a mostrar algo semelhante a
`(.venv) PS C:\...\meu_agente>`.

**Alternativa:** se não quiser alterar a política de execução do
PowerShell, use o Prompt de Comando (`cmd.exe`):

``` bat
cd meu_agente
.venv\Scripts\activate.bat
```

## 3. Instalar o Ollama e baixar o modelo

No PowerShell, execute o instalador oficial:

``` powershell
irm https://ollama.com/install.ps1 | iex
```

Depois, abra um novo terminal e baixe o modelo:

``` powershell
ollama pull qwen2.5:3b
```

Se o computador tiver 16 GB de RAM e você quiser usar o modelo maior
indicado no documento:

``` powershell
ollama pull qwen2.5:7b
```

## 4. Testar o Ollama

``` powershell
ollama run qwen2.5:3b "diga oi em uma frase"
curl http://localhost:11434
```

A chamada HTTP deve indicar que o Ollama está em execução, normalmente
com a mensagem `Ollama is running`.

Se não responder, confira se o Ollama está aberto. Se necessário, tente
iniciar o serviço em um terminal:

``` powershell
ollama serve
```

Se o serviço já estiver rodando, esse comando pode informar que a porta
já está em uso; nesse caso, não é necessário iniciar uma segunda
instância.

## 5. Instalar o CrewAI

No terminal em que for trabalhar, entre na pasta do projeto e **ative
novamente o ambiente virtual** caso tenha aberto um terminal novo:

``` powershell
cd meu_agente
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install "crewai[litellm]"
```

Verifique a instalação:

``` powershell
python -c "import crewai; print(crewai.__version__)"
```

## 6. Fazer o teste final

Com o Ollama em execução e o ambiente virtual ativado, execute:

``` powershell
python -c "from crewai import LLM; llm = LLM(model='ollama/qwen2.5:3b', base_url='http://localhost:11434'); print(llm.call('Diga oi em uma frase'))"
```

Se estiver usando o modelo `qwen2.5:7b`, substitua `qwen2.5:3b` por
`qwen2.5:7b` no comando.

------------------------------------------------------------------------

# Linux (Ubuntu, Linux Mint, Lubuntu e derivados)

Os comandos abaixo usam o terminal e `python3`. Em outras distribuições,
o gerenciador de pacotes pode mudar.

## 1. Verificar o Python

``` bash
python3 --version
```

Se a versão estiver entre Python 3.10 e 3.13, em princípio pode
prosseguir. Se não houver Python ou a versão não for adequada, instale
uma versão compatível pelos repositórios da distribuição ou pelo método
oficial para sua distribuição. Prefira Python 3.12 ou 3.13, pois o
documento original alerta para possíveis incompatibilidades do CrewAI
com versões muito recentes.

Em Ubuntu, Linux Mint ou Lubuntu, instale as ferramentas básicas:

``` bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip curl
```

Confira novamente:

``` bash
python3 --version
```

> Se a distribuição fornecer uma versão de Python fora do intervalo
> recomendado, não substitua o Python do sistema manualmente. Use uma
> instalação paralela de uma versão compatível.

## 2. Criar o projeto e o ambiente virtual

``` bash
mkdir meu_agente
cd meu_agente
python3 -m venv .venv
source .venv/bin/activate
```

Quando ativado, o terminal normalmente mostra `(.venv)` no início da
linha. Para sair do ambiente virtual, use `deactivate`. Se abrir um
terminal novo, entre novamente na pasta e ative o ambiente:

``` bash
cd meu_agente
source .venv/bin/activate
```

## 3. Instalar o Ollama e baixar o modelo

O instalador oficial do Ollama para Linux pode ser executado assim:

``` bash
curl -fsSL https://ollama.com/install.sh | sh
```

Depois, confira se foi instalado:

``` bash
ollama --version
```

Em instalações com serviço `systemd`, verifique o serviço:

``` bash
systemctl status ollama
```

Se o serviço não estiver ativo e sua instalação usar `systemd`, tente:

``` bash
sudo systemctl start ollama
```

Em seguida, baixe o modelo:

``` bash
ollama pull qwen2.5:3b
```

Para o modelo maior sugerido para computadores com 16 GB de RAM:

``` bash
ollama pull qwen2.5:7b
```

## 4. Testar o Ollama

``` bash
ollama run qwen2.5:3b "diga oi em uma frase"
curl http://localhost:11434
```

A resposta HTTP deve indicar que o Ollama está em execução, normalmente
com `Ollama is running`.

Se o Ollama não estiver rodando, tente iniciar o serviço:

``` bash
sudo systemctl start ollama
```

Em uma instalação sem serviço de sistema, você pode iniciar o servidor
manualmente:

``` bash
ollama serve
```

Mantenha esse terminal aberto enquanto o servidor estiver sendo
executado. Se a porta já estiver em uso, provavelmente o servidor já
está ativo.

## 5. Instalar o CrewAI

Na pasta do projeto, ative o ambiente virtual se ainda não estiver
ativo:

``` bash
cd meu_agente
source .venv/bin/activate
python -m pip install --upgrade pip
pip install "crewai[litellm]"
```

Verifique a instalação:

``` bash
python -c "import crewai; print(crewai.__version__)"
```

## 6. Fazer o teste final

Com o Ollama em execução e o ambiente virtual ativado, execute:

``` bash
python -c "from crewai import LLM; llm = LLM(model='ollama/qwen2.5:3b', base_url='http://localhost:11434'); print(llm.call('Diga oi em uma frase'))"
```

Se estiver usando `qwen2.5:7b`, troque o nome do modelo no comando.

------------------------------------------------------------------------

# Problemas comuns

-   **`python` não é reconhecido no Windows:** reabra o terminal e
    confira se o Python foi adicionado ao `PATH`. No Linux, use
    `python3`.
-   **Não é possível ativar o ambiente virtual no PowerShell:** use a
    alternativa com `cmd.exe` descrita na seção Windows ou ajuste a
    política de execução conforme as instruções.
-   **`pip` instala no Python errado:** primeiro ative `.venv` e use
    `python -m pip` (no Linux, com o ambiente ativo, `python -m pip`
    também funciona).
-   **CrewAI não encontra o Ollama:** confirme que o Ollama está em
    execução e que `curl http://localhost:11434` responde.
-   **Modelo não encontrado:** confira se o modelo foi baixado com
    `ollama pull qwen2.5:3b` e se o nome usado no código é exatamente o
    mesmo.
-   **Erro de memória:** tente o modelo `qwen2.5:3b` antes de usar o
    `qwen2.5:7b`.

## Checklist final

-   [ ] Python compatível instalado.
-   [ ] Pasta `meu_agente` criada.
-   [ ] Ambiente virtual `.venv` criado e ativado.
-   [ ] Ollama instalado e em execução.
-   [ ] Modelo `qwen2.5:3b` baixado.
-   [ ] Pacote `crewai[litellm]` instalado dentro do ambiente virtual.
-   [ ] Comando de teste final executado sem erros.
