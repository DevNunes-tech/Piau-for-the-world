# Piauí para o Mundo

Aplicação web demonstrável para valorização turística, cultural, ambiental e econômica do Piauí. O projeto apresenta territórios, biomas, cidades, pontos turísticos, economia criativa, roteiros e uma área de inovação com assistente virtual e gamificação.

## Problema Abordado

O Piauí possui grande diversidade natural, histórica, cultural e produtiva, mas essas informações costumam ficar dispersas em várias fontes. Isso dificulta que visitantes, estudantes, empreendedores e moradores descubram rotas, cidades, experiências e oportunidades ligadas ao estado de forma simples, visual e interativa.

## Solução Desenvolvida

O **Piauí para o Mundo** reúne essas informações em uma PWA com navegação por temas:

- **Início:** destaque para o Piauí, busca, filtros por interesse, biomas, cidades e territórios.
- **Mapa:** visualização territorial e pontos de interesse com Leaflet.
- **Roteiro:** seleção de interesses e locais para montar experiências de visita.
- **Economia criativa:** apresentação de elementos culturais, gastronômicos e produtivos.
- **Investe Piauí & Cultura:** vitrine de eventos, editais e oportunidades culturais.
- **Inovação:** assistente virtual, quiz e recursos de gamificação para interação durante a demonstração.

A solução tem execução mínima funcional para apresentação em evento: é possível abrir a aplicação localmente, navegar pelas seções, explorar conteúdos, montar roteiro, consultar o mapa e interagir com os recursos de inovação.

## Eixo Temático

O projeto mantém coerência com o eixo de **turismo, cultura, educação, inovação e desenvolvimento regional**, usando tecnologia para promover o Piauí, fortalecer sua identidade e aproximar o público de oportunidades ligadas ao território.

## Tecnologias Utilizadas

- React 19
- TypeScript
- Vite
- Vite PWA
- Leaflet e React Leaflet
- i18next e react-i18next
- LocalStorage para dados locais de gamificação e contribuições
- API Google Gemini opcional para respostas do assistente virtual

## Como Executar

Pré-requisitos:

- Node.js instalado
- npm instalado

Instale as dependências:

```bash
npm install
```

Execute em modo de desenvolvimento:

```bash
npm run dev
```

Abra no navegador o endereço exibido pelo Vite, normalmente:

```bash
http://localhost:5173
```

Para gerar uma versão de produção:

```bash
npm run build
```

Para pré-visualizar a versão gerada:

```bash
npm run preview
```

## Configuração Opcional de IA

O assistente virtual funciona com respostas locais mesmo sem chave externa. Para ativar respostas via Google Gemini, crie um arquivo `.env.local` na raiz do projeto com:

```bash
VITE_GEMINI_API_KEY=sua_chave_aqui
```

Não compartilhe nem versionar chaves de API.

## Estrutura Principal

- `src/App.tsx`: estrutura principal de navegação.
- `src/components/TerritoryExplorer.tsx`: página inicial com busca, interesses, biomas, cidades e territórios.
- `src/components/MapView.tsx`: mapa interativo.
- `src/components/ItineraryBuilder.tsx`: construtor de roteiro.
- `src/components/VirtualPiauiAssistant.tsx`: interface do assistente virtual.
- `src/data/`: dados de cidades, regiões, eventos, cultura e interesses.
- `public/data/municipios_piaui.json`: base territorial usada no mapa.
- `assets/`: imagens utilizadas na interface.
