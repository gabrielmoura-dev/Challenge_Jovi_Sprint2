# JOVI Vision — Protótipo navegável

Protótipo de alta fidelidade do aplicativo **JOVI Vision** (câmera e galeria com IA),
desenvolvido para o Challenge — Sprint 2. É um site estático (HTML, CSS e JavaScript
puros, com Bootstrap 5), sem etapa de build: 35 telas ligadas entre si que simulam a
jornada do app.

- **Demonstração online (GitHub Pages):** https://gabrielmoura-dev.github.io/Challenge_Jovi_Sprint2/
- **Repositório:** https://github.com/gabrielmoura-dev/Challenge_Jovi_Sprint2

## Como visualizar

O protótipo é responsivo em dois modos:

| Viewport | Comportamento |
|---|---|
| Acima de 420 px (desktop, tablet) | O app aparece dentro de um "celular" 360×800 centralizado, para apresentação. |
| Até 420 px (celular real) | O app ocupa a tela inteira, sem moldura, como um app nativo. |

Para ver como no celular no computador, abra as DevTools do navegador e ative o modo
de dispositivo móvel (por exemplo 360×800).

### Rodando localmente

Requisitos: Node.js 18 ou superior.

```bash
npm install
npm start          # abre http://localhost:8080/telas/tela-01-onboarding.html
```

Também funciona abrindo `index.html` direto no navegador, mas alguns recursos (como as
transições entre telas) exigem um servidor HTTP.

## Fluxos e telas

| Fluxo | Telas |
|---|---|
| Onboarding | 01 Comece por aqui · 02 Nome · 03 Preferências de fotografia · 04 Preferências de foto |
| Início e galeria | 05 Início · 06 Galeria · 15 Visualizador de mídia · 17 Ajustes |
| Câmera | 07 Modo Esporte · 08 Câmera de estudo · 09 Seleção de fotos IA · 12 Câmera · 13 Câmera · 14 Viewfinder · 16 Configuração de tradução · 35 Guia de pose |
| Assistente IA | 10 Assistente · 11 Assistente de Estudo |
| Modo Blindagem | 18 Blindagem · 34 Blindagem (câmera) |
| Modo Farol | 19 e 32 Configurar · 20 e 31 Ativação · 21 e 33 Alerta recebido |
| Modo Estudo (gamificação) | 22 Estudo · 23 Álbum · 24 Tentativa · 25 Roleta · 26 Quiz · 27 Caça ao erro · 28 Completar expressão · 29 Quadro fragmentado · 30 Resultado |

Os arquivos ficam em `telas/tela-NN-nome.html`. A tela de entrada é a 01
(`index.html` redireciona para ela).

## Estrutura do repositório

```
.
├── index.html            # redireciona para a tela 01
├── telas/                # as 35 telas (uma página HTML por tela)
├── assets/
│   ├── css/
│   │   ├── tokens.css              # design tokens (cores, tipografia, espaçamentos) e regra mobile fullscreen
│   │   ├── jovi-transitions.css    # transições entre telas
│   │   ├── *-componentes.css       # componentes compartilhados (veja abaixo)
│   │   ├── camera-shared.css       # estilos comuns às telas de câmera
│   │   ├── larii/                  # CSS do conjunto de componentes "larii"
│   │   └── telas/                  # CSS específico de cada tela
│   ├── js/               # comportamento das telas (câmera, jogos de estudo, tema, transições)
│   ├── img/              # ícones, fotos e ilustrações
│   ├── fonts/            # família JOVI Sans (ver "Licenças")
│   └── vendor/           # Bootstrap 5 (local, sem CDN)
├── tests/                # testes automatizados (Playwright) e scripts de auditoria
└── docs/                 # documentação, referências do Figma e evidências de verificação
```

### Sobre os CSS de componentes

As telas foram desenvolvidas em paralelo por integrantes diferentes, e cada um manteve
seu conjunto de componentes (as pastas e prefixos acima). Todos compartilham os mesmos tokens de `tokens.css`:

| Arquivo | Frame | Telas |
|---|---|---|
| `lacar-componentes.css` | `.lacar-phone-frame` | 22 telas: 05, 08, 09, 11, 16, 17, 19–34 |
| `larii/Larii-componentes.css` | `.app-frame` | 01, 06, 07, 10, 12, 14, 18 |
| `jullia-componentes.css` | `.phone-frame` | 04, 13, 15, 35 |
| `style.css` (legado) | `.onboarding-screen` | 02 |

A tela 03 tem CSS próprio (`telas/tela-03.css`, frame `.tela03-screen`). Todos os frames
seguem a mesma regra de tela cheia em celular, definida no fim de `tokens.css`.

## Testes

```bash
npx playwright install chromium   # uma vez, para baixar o navegador
npm test                          # sobe o servidor na porta 4173 e roda a suíte
npm run audit                     # valida sintaxe JS/HTML e referências locais
```

Para usar outro navegador, defina `JOVI_BROWSER` com o caminho do executável. Detalhes
e capturas em [`docs/implementation-verification.md`](docs/implementation-verification.md)
e [`docs/evidence/`](docs/evidence/).

## Equipe

Contribuições por integrante (consulte `git log` para o histórico completo): Gabriel Moura,
Larissa Carvalho, Lunnary e jullia-xsx.

## Licenças e créditos

- **JOVI Sans** (`assets/fonts/`): fonte da identidade visual do projeto, incluída apenas
  para fins acadêmicos. Não redistribua fora deste contexto.
- **Bootstrap 5** (`assets/vendor/`): licença MIT.
- **Inter** (Google Fonts): licença SIL Open Font License.
- Fotos e ilustrações: material de demonstração do protótipo.
