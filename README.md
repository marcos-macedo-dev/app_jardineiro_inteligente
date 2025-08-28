# Aplicativo Jardineiro

Este README fornece as instruções necessárias para configurar e executar o projeto do Aplicativo Jardineiro em um ambiente de desenvolvimento.

## Pré-requisitos

Antes de começar, garanta que você tenha o seguinte instalado:

- [Node.js](https://nodejs.org/) (versão LTS é recomendada)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js) ou [yarn](https://yarnpkg.com/)
- O aplicativo [Expo Go](https://expo.dev/go) instalado no seu smartphone (iOS ou Android) para testar o projeto em um dispositivo físico.

## Instalação

1.  **Navegue até a pasta do projeto:**
    Se você clonou o repositório, certifique-se de estar no diretório `app` que contém o `package.json`.

    ```bash
    cd /caminho/para/o/projeto/aplicativo_jardineiro/app
    ```

2.  **Instale as dependências:**
    Execute o comando abaixo para instalar todas as dependências listadas no `package.json`.

    ```bash
    npm install
    ```
    *(ou `yarn install` se você utilizar o Yarn)*

## Executando o Projeto

Com as dependências instaladas, você pode iniciar o servidor de desenvolvimento do Expo.

```bash
npx expo start
```

Este comando iniciará o Metro Bundler, que é o bundler para projetos React Native. Ele também abrirá o Expo Dev Tools no seu navegador e exibirá um **QR code** no terminal.

### Opções para Abrir o Aplicativo

-   **Em um dispositivo físico (Android/iOS):**
    1.  Abra o aplicativo **Expo Go** no seu celular.
    2.  Selecione a opção "Scan QR code" e aponte a câmera para o QR code no seu terminal.

-   **Em um Emulador Android:**
    1.  Inicie seu emulador Android.
    2.  Com o processo do `npm start` rodando, pressione a tecla `a` no terminal.

-   **Em um Simulador iOS (apenas macOS):**
    1.  Inicie seu simulador iOS.
    2.  Com o processo do `npm start` rodando, pressione a tecla `i` no terminal.

-   **Em um Navegador Web:**
    1.  Com o processo do `npm start` rodando, pressione a tecla `w` no terminal.

Você também pode usar os scripts diretos para cada plataforma:

-   `npm run android`
-   `npm run ios`
-   `npm run web`

## Verificação de Código (Linting)

Para verificar a qualidade e o estilo do código, você pode executar o linter:

```bash
npm run lint
```