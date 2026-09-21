# Verificação da implementação — protótipo JOVI Argos

Registro das correções aprovadas (8 requisitos) e das execuções reais de
verificação. Nada foi commitado; todas as mudanças estão no working tree.

## Como rodar

```bash
npm install                # @playwright/test + http-server (devDependencies)
npx playwright test        # sobe http-server em :4173 e roda os 21 testes
node tests/static-audit.cjs   # sintaxe JS/inline + referências locais de assets
node tests/audit-browser.cjs  # abre as 35 telas em 1280px e 320px, grava docs/evidence/browser-audit.json
node tests/screenshots.cjs    # regenera docs/evidence/*.png (precisa do servidor em :4173)
```

Navegador: Edge local (`C:/Program Files (x86)/Microsoft/EdgeCore/153.0.4234.32/msedge.exe`);
sobrescreva com `JOVI_BROWSER=<caminho>` se necessário. O download de browsers
do Playwright está bloqueado nesta rede.

## Resultado final (execução real)

| Comando | Resultado |
|---|---|
| `npx playwright test` | **20 passed** (≈1.2 min) |
| `node tests/static-audit.cjs` | `{ errors: [] }` |
| `node tests/audit-browser.cjs` | 70 observações (35 telas × 2 larguras): 0 overflow horizontal, 0 nós de apresentação, 0 erros de página, 0 requisições locais falhando, 0 requisições a CDN (Bootstrap agora é local em `assets/vendor/`) |

## Cobertura por requisito

| # | Requisito | Onde | Teste |
|---|---|---|---|
| 1 | Nav da Galeria: Estudo → tela 22, Configurações (engrenagem) → tela 17 | `telas/tela-06-galeria.html`, `assets/js/tela7.js` | `gallery-navigation.spec.js` |
| 2 | "Criar álbum" contido no celular (scrim, animação, foco, validação, persistência) | `tela-06`, `tela7.js`, `Larii-componentes.css` | `gallery-dialog.spec.js`, `camera-regression.spec.js`, `prototype-audit.spec.js` (bounds durante a transição) |
| 3 | Modos navegam de verdade; ativo correto em cada tela | `assets/js/camera-modes.js` (runtime único) | `camera-modes.spec.js` — cada opção de cada tela abre o destino certo |
| 4/5 | Barra inferior sólida e botões iguais em todos os modos | `assets/css/camera-shared.css` (`[data-camera-bar]`, `[data-camera-side]`) | `camera-modes.spec.js` "barras inferiores… opacos e iguais" (computed style: sem blur, mesma cor em 8 telas) |
| 6 | Estudo: Chat → Palestra → Exercício com ação própria | telas 08/09/14 + `camera-modes.js` (`[data-study-intent]`) | `camera-modes.spec.js` "modo Estudo oferece…" (persistência, rótulo do obturador, destino por intenção) |
| 7 | Ordem fixa Blindagem → Estudo → Esporte → Foto → Retrato → Vídeo, rolagem por toque/arraste/roda/teclado, ativo visível, sem rótulo espremido | `camera-shared.css` + `camera-modes.js` | `camera-modes.spec.js` (ordem, visibilidade do ativo, `scrollWidth<=clientWidth` por botão, End/wheel/drag) |
| 8 | Nada fora do frame; história/toggle/links removidos do código, não escondidos | 35 telas, `index.html`, `theme.js`, `tela03.js`; `jovi-story.js/.css` e `tela15.js` apagados | `no-external-ui.spec.js` (35 telas: 0 controles visíveis fora do frame, 0 nós de apresentação, 0 CDN) |

## Decisões de mapeamento

- **Destinos dos modos globais**: Blindagem → `tela-34`, Estudo → `tela-08`, Esporte → `tela-07`, Foto → `tela-12`, Retrato → `tela-13`, Vídeo → `tela-12?modo=video` (mesma câmera, obturador vermelho de gravação, toast "Gravando…/Vídeo salvo"). Clicar no modo já ativo não recarrega.
- **Intenções do Estudo**: Chat → `tela-09` (seleção de fotos para o Chat), Palestra → `tela-14` (viewfinder com gravação), Exercício → `tela-24` (tentativa). A escolha fica em `sessionStorage`. Telas 09 e 14 são "fixas" à sua intenção: escolher outra volta para a câmera de estudo (tela 08).
- **"Show"** na tela 12 continua como rótulo de cena (vira "Show · Vídeo" no modo vídeo), não como modo.
- **Blindagem (tela 34)** ganhou a faixa global de modos acima das abas Boleto/Pix/Anúncio/QR Code (painel 44px mais alto). Tela 18 (Blindagem legada) mantém suas próprias abas de alvo e não faz parte da faixa global.
- **Entrada**: `index.html` redireciona para `telas/tela-01-onboarding.html`. O catálogo antigo virou `docs/catalogo-dev.html` (uso interno).
- **Bootstrap** passou a ser servido de `assets/vendor/` (5.3.3 oficial) — o protótipo funciona offline.

## Evidências visuais (`docs/evidence/`)

`gallery.png`, `gallery-sheet.png`, `camera-sport.png`, `camera-study.png`, `camera-12.png`,
`camera-12-video.png`, `camera-13.png`, `camera-14.png`, `camera-09.png`, `blindagem-34.png`
(390×900, Edge headless). Inspecionadas: sheet e scrim dentro do frame; barras sólidas
idênticas; faixa de modos na mesma ordem com ativo visível; linha de intenções no Estudo;
nenhum controle fora do celular.

## Complemento — botão discreto de "voltar" (requisito adicional)

Adicionada uma seta discreta no topo esquerdo em toda tela que não a tinha,
para o protótipo ficar 100% navegável sem depender do catálogo externo.

### Infraestrutura

- `assets/js/jovi-transicao.js`: nova `window.joviVoltar(destinoDeReserva, event)`.
  Usa `window.history.back()` quando a tela anterior é do próprio app (evita
  pular telas intermediárias em fluxos com múltiplas entradas, como as
  câmeras); só usa o destino de reserva quando a tela foi aberta direto.
- `assets/css/tokens.css`: `.jovi-back` (dentro de um cabeçalho existente,
  herda cor do tema) e `.jovi-back--overlay` (flutua sobre foto/câmera,
  sempre branco sobre fundo escuro translúcido). Duplicado localmente em
  `assets/css/telas/tela-02.css` e `tela-03.css` para as duas telas que não
  carregam `tokens.css`.
- `tests/back-button-coverage.spec.js`: audita as 34 telas (exceto a
  primeira do onboarding, que não tem "anterior") e falha listando qual
  tela não tem a seta visível no topo esquerdo.

### Telas corrigidas (16)

tela-02, tela-03 (+ variante dark), tela-04, tela-05, tela-07, tela-08,
tela-09, tela-10, tela-11, tela-12, tela-13, tela-14, tela-20, tela-22,
tela-30, tela-31.

### Resultado

```
npx playwright test tests/back-button-coverage.spec.js  → 1 passed
npx playwright test                                      → 21 passed (suíte completa)
node tests/static-audit.cjs                               → { errors: [] }
```

Nenhuma das 20 verificações anteriores (câmeras, galeria, UI externa,
toasts) regrediu.


- Verificação em Edge headless (Chromium). Não houve teste em Safari/Firefox nem em dispositivo físico; o toque real foi coberto por `touch-action: pan-x` + overflow nativo, e o arraste por mouse foi testado.
- Google Fonts (Inter) ainda é referenciado por `<link>` em algumas telas; sem rede o fallback do sistema é usado. As fontes JOVI Sans são locais.
- Câmera, gravação, IA e verificação de golpe são simulações (toasts/estados), como antes.
