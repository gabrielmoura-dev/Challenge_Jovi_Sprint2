# Plano de correções do protótipo — JOVI Vision

Objetivo geral: deixar o protótipo **100% fiel a uma câmera de celular real**,
sem nenhum elemento fora do frame de 360x800, com a barra de modos idêntica e
navegável em todas as telas de câmera.

Ordem de execução pensada para reduzir retrabalho: primeiro a **infraestrutura
compartilhada** (fases 1 e 2), depois as telas.

---

## Fase 1 — Limpar tudo que vive fora do frame (item 8)

Alvo: nenhum nó de UI fora de `.app-frame` / `.lacar-phone-frame` / frame equivalente.

| O que remover | Onde | Como |
|---|---|---|
| Botão `🌙 Dark` (`.theme-toggle[data-theme-toggle]`) | 28 telas | remover o `<button>`; manter `theme.js` + script inline do `<head>` (o controle continua existindo **dentro** do frame, na Tela 17) |
| Link `← Telas` (`a.theme-toggle` → `../index.html`) | 28 telas | remover o `<a>` |
| Trilho do Modo História (`jovi-story.js` + `jovi-story.css`) | 35 telas | remover as duas tags `<link>`/`<script>` de todas as telas; **manter os arquivos** no repo (documentam a ordem narrativa) ou movê-los para `docs/` |
| Toast global (`toast.js`) | todas | o container hoje é `position:fixed` no rodapé da **janela** → passar a ser inserido dentro do frame, com `position:absolute` |
| CSS órfão | `Larii-componentes.css`, `lacar-componentes.css` etc. | remover as regras `.theme-toggle` que ficarem sem uso |

Consequências a assumir:

- A volta ao catálogo passa a ser só pelo **botão voltar do navegador**.
  O `index.html` continua como está (é o catálogo, não faz parte do protótipo).
- A ordem narrativa deixa de ser navegável por botão. A história continua
  possível pelos fluxos internos (nav inferior, obturador, chips), que já
  estão ligados.

Verificação: `grep -rn "theme-toggle\|jovi-story" telas/` deve voltar vazio.

---

## Fase 2 — Barra inferior da câmera: uma só implementação (itens 3, 4, 5, 6, 7)

### 2.1 Diagnóstico — hoje existem 3 barras diferentes

| Família | Telas | Fundo | Blur |
|---|---|---|---|
| A `.camera__veil--bottom` (`larii/tela15.css`) | 07, 12, 14, 18 | `rgba(0,0,0,.355)` | 24px |
| B `.camera-bottombar` (`telas/tela-10.css`) | 08 | `rgba(10,10,10,.4)` | nenhum |
| C `.camera-bottom` (`telas/tela-16.css`) | 13, 35 | `var(--jovi-overlay)` = `rgba(10,10,10,.4)` | nenhum |

As pills também têm 3 nomes (`.camera__mode`, `.mode-pill`, `.camera-mode-pill`)
e 2 JS diferentes (`tela15.js`, `jovi.js`) — e **nenhum dos dois navega**, só
troca a classe de ativo. É exatamente a causa do item 3.

### 2.2 Tokens da barra (itens 4 e 5)

Em `assets/css/tokens.css`:

```css
--camera-bar-bg: rgba(10, 10, 10, 0.55);
--camera-bar-blur: 24px;
--camera-bar-border: rgba(255, 255, 255, 0.12);
--camera-bar-radius: 24px;
```

As três classes passam a consumir só esses tokens. Resultado: mesma cor, mesma
opacidade e mesmo blur em **todos** os modos. Valor recomendado: 0.55 + blur
24px — lê como sólido sobre qualquer foto, sem perder o efeito de vidro.

### 2.3 Faixa de modos única, renderizada por JS (itens 6 e 7)

Novo arquivo `assets/js/camera-modes.js`, fonte única de verdade:

```js
var MODOS_GERAIS = [
  { id: "blindagem", label: "Blindagem", icone: "shield.svg",            tela: "tela-34-modo-blindagem.html" },
  { id: "estudo",    label: "Estudo",    icone: "cam-book.svg",          tela: "tela-08-camera-estudo.html" },
  { id: "esporte",   label: "Esporte",   icone: "cam-mode-sport.svg",    tela: "tela-07-modo-esporte.html" },
  { id: "foto",      label: "Foto",      icone: "cam-mode-photo.svg",    tela: "tela-13-camera.html" },
  { id: "retrato",   label: "Retrato",   icone: "cam-mode-portrait.svg", tela: "tela-35-guia-pose-silhueta.html" },
  { id: "video",     label: "Vídeo",     icone: "video.svg",             tela: "tela-12-camera.html" }
];

var MODOS_ESTUDO = [
  { id: "chat",      label: "Chat",      icone: "message-circle.svg",    tela: "tela-08-camera-estudo.html" },
  { id: "palestra",  label: "Palestra",  icone: "video.svg",             tela: "tela-14-camera-viewfinder.html" },
  { id: "exercicio", label: "Exercício", icone: "cam-book.svg",          tela: "tela-24-estudo-tentativa.html" }
];
```

Todos esses ícones já existem em `assets/img/`.

Cada tela de câmera troca a faixa escrita à mão por um marcador só:

```html
<div class="camera-modes" data-camera-modes="gerais" data-modo-ativo="video"></div>
```

O script:

1. renderiza as pills na ordem fixa (features novas primeiro: Blindagem, Estudo);
2. marca a ativa pelo `data-modo-ativo` (clicar nela não navega);
3. nas outras, navega com `joviNavegar(tela)`;
4. rola na horizontal com arrasto e roda do mouse — a lógica já existe em
   `tela7.js` (`chip-row`) e será **extraída para um helper reutilizável**,
   para os chips da Galeria e a faixa de modos usarem o mesmo código;
5. traz a pill ativa para o campo de visão no load (`scrollIntoView`).

Mapa por tela:

| Tela | Faixa | Modo ativo |
|---|---|---|
| 07 Modo Esporte | gerais | esporte |
| 12 Câmera (vídeo) | gerais | video |
| 13 Câmera (foto) | gerais | foto |
| 35 Guia de pose | gerais | retrato |
| 34 Modo Blindagem | gerais | blindagem |
| 08 Câmera Estudo | estudo | chat |
| 14 Viewfinder Estudo | estudo | palestra |

**Exclusão explícita:** a Tela 18 (Blindagem legada) usa `.camera__modes` com
outro significado (Boleto / Pix / Anúncio, dirigido por `tela22.js`). Ela **não**
entra na padronização.

Decisões que assumi (confirmar se discordar):

- **"Noturno" sai** de todas as faixas — não está na sua lista de 6.
- **Retrato → Tela 35** (guia de silhueta) é o destino mais próximo de um modo
  retrato; assim nenhuma pill fica morta.
- **Estudo** na faixa geral entra na câmera de estudo; a saída do contexto de
  estudo fica no chip de livro que já existe na barra superior da Tela 08.

---

## Fase 3 — Tela 06 (Galeria): itens 1 e 2

### 3.1 Nav inferior (item 1)

A Tela 06 é a única que usa `.bottom-nav` (ícones Álbuns/`#i-book-open` e
Perfil/`#i-user` — um só rola a página, o outro só mostra toast). Todas as outras
usam `.lacar-nav-bottom`, com **Diário → Tela 11** e **Ajustes (engrenagem) →
Tela 17**.

Correção: substituir a nav da Tela 06 pela `.lacar-nav-bottom` canônica (mesmos
5 itens, engrenagem correta, item "Galeria" marcado com `aria-current="page"`) e
remover do `tela7.js` os cases `albuns` / `perfil`.

Isso resolve de uma vez: ícone errado, "estudo" que não funciona e configuração
que não funciona.

### 3.2 Bottom sheet "Criar álbum" fora do frame (item 2)

Causa: `.sheet .modal-dialog` é `position:fixed; bottom:0` → ancora no rodapé da
**janela**, não do cartão. E o trilho da história tem `z-index:1090`, acima do
modal (1055) — daí a sobreposição.

Correção:

1. mover o markup `#sheet-criar-album` para **dentro** do `.app-frame`;
2. `.sheet .modal-dialog` → `position:absolute` dentro do frame, `width:100%`,
   sem `translateX`;
3. trocar o backdrop do Bootstrap (`data-bs-backdrop="false"`) por um véu próprio
   dentro do frame, com a mesma cor de scrim (`#0F0F0F` a 60%);
4. revisar o `z-index` do sheet contra o da nav inferior.

A sobreposição da história desaparece junto na Fase 1, mas o sheet precisa ser
corrigido de todo modo — hoje ele aparece fora do celular mesmo sem o trilho.

---

## Fase 4 — Verificação

1. `grep -rn "theme-toggle\|jovi-story" telas/` → vazio.
2. Abrir as 7 telas de câmera: mesma barra, mesmas pills, mesma ordem, pill ativa
   correta, clique navegando, scroll horizontal funcionando.
3. Tela 06: os 5 itens da nav funcionam; sheet abre dentro do frame.
4. Percorrer as 35 telas atrás de qualquer pixel pintado fora do cartão
   (toast, modal, trilho, botão).
5. Tela 18 intacta (Boleto / Pix / Anúncio ainda funcionando).

---

## Cobertura dos pontos levantados

| # | Ponto | Onde é resolvido |
|---|---|---|
| 1 | Ícones de estudo/configuração da Tela 06 sem função + engrenagem errada | 3.1 |
| 2 | "Novo álbum" animando fora do frame + história sobrepondo | 3.2 (+ Fase 1) |
| 3 | Menus de modo da câmera não navegam (Tela 12 e outras) | 2.3 |
| 4 | Botões da Tela 13 transparentes demais | 2.2 |
| 5 | Barra da Tela 12 com blur diferente — padronizar cor/transparência | 2.1 + 2.2 |
| 6 | Modo Estudo não deve mostrar "Esporte"; usar Chat, Palestra, Exercício | 2.3 (`MODOS_ESTUDO`) |
| 7 | Labels padronizadas, ordem fixa, features novas primeiro, com scroll | 2.3 (`MODOS_GERAIS`) |
| 8 | Remover tudo fora do frame (tema, voltar, trilho da história) | Fase 1 |

---

# Execução — o que foi feito (e o que mudou em relação ao plano)

## Novos arquivos

| Arquivo | Papel |
|---|---|
| `assets/css/jovi-base.css` | tokens da barra da câmera, faixa `.jovi-modes/.jovi-mode`, toast e véu do sheet ancorados na moldura. Carregado nas 35 telas |
| `assets/js/jovi-ui.js` | `JoviUI.frame()` (a moldura canônica) + `JoviUI.rolagemHorizontal()`. Carregado nas 35 telas |
| `assets/js/camera-modes.js` | fonte única de rótulos, ordem, ícones e destinos dos modos de captura |
| `docs/modo-historia/` | trilho da história arquivado (com README explicando por quê) |

## Descobertas durante a execução

1. **Existiam QUATRO barras de câmera diferentes, não três.** A quarta é
   `.tentativa-painel` (telas 24 e 34), com `rgba(10,10,10,0.74)` e sem blur.
   Como a 34 e a 24 passaram a ser destinos da faixa de modos, também foram
   tokenizadas.
2. **A Tela 09 (Seleção de fotos IA) também tinha faixa de modos** — com
   Esporte/Chat/Palestra/Noturno, a mistura exata que o item 6 aponta. Entrou
   na padronização com a faixa de estudo.
3. **A Tela 34 (Blindagem) e a Tela 18 ficaram fora da faixa canônica.** As
   duas já têm uma faixa própria com outro significado (Boleto / Pix / Anúncio
   / QR Code — o que verificar, não como capturar). Empilhar duas faixas no
   mesmo painel seria pior que a inconsistência. A pilula "Blindagem" leva
   para a Tela 34 normalmente.
4. **A Tela 35 não tinha faixa nenhuma** — ganhou uma (Retrato ativo). O
   layout dela é todo absoluto, então os três offsets ancorados no rodapé
   subiram 44px (a altura da faixa), senão o carrossel de poses ficaria
   escondido atrás da barra.
5. **Voltar com duas origens.** Com a faixa navegável, Blindagem e Exercício
   passaram a ter duas portas de entrada, e um `voltar` fixo mandava a pessoa
   para uma tela onde ela nunca esteve. Entrou `window.joviVoltar(fallback)`
   em `jovi-transicao.js`: volta pelo histórico quando a tela anterior é do
   app, senão usa o destino declarado. A Galeria, que já tinha essa lógica
   duplicada, agora usa a mesma função.

## Duplicação removida

- a mecânica de arrastar-para-rolar dos chips da Galeria virou
  `JoviUI.rolagemHorizontal()`, usada também pela faixa de modos;
- `initCameraModes()` saiu do `jovi.js` (virou `initShutter()`);
- o botão de tema saiu do `theme.js`, do `tela03.js` e de 4 arquivos de CSS;
- as pílulas antigas (`.mode-pill`, `.camera-mode-pill`, `.camera-mode-strip`)
  saíram do `tela-10.css` e do `tela-16.css`.

## Verificações executadas

| Verificação | Resultado |
|---|---|
| `grep` por `theme-toggle`, `jovi-story`, `index.html` em `telas/` e `assets/` | nada encontrado |
| `grep` por faixas antigas (`mode-pill`, `data-camera-mode=`, `camera-mode-strip`) | nada, exceto a Tela 18 (excluída de propósito) |
| `node --check` em todos os JS | sem erros de sintaxe |
| Balanço de `<div>` das 35 telas comparado ao HEAD | preservado em todas |
| Render das 7 faixas simulado em Node (rótulos, ordem, modo ativo, ícones) | 7/7 corretas |
| Varredura de nós de primeiro nível fora da moldura | só os wrappers que centralizam o celular |
| Tela 18 (Boleto/Pix/Anúncio) | intacta |

Não deu para abrir as telas num navegador nesta máquina (não há Chrome/Edge
instalado), então a conferência visual final — abrir as 7 telas de câmera e a
Galeria — fica para você.
