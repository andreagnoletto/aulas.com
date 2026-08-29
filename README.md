# aulas.com

Landing page estática para o domínio premium aulas.com.

## Deploy no Coolify

1. Crie uma nova **Application**.
2. Escolha **Dockerfile** como método de build.
3. Aponte para este repositório.
4. Configure a porta exposta como **80**.
5. Defina o domínio como **aulas.com**.

## Como configurar `window.AULAS_ENDPOINT`

O arquivo `index.html` expõe:

```html
<script>
  window.AULAS_ENDPOINT = "";
</script>
```

Substitua o valor vazio pela URL pública da Edge Function, por exemplo:

```html
<script>
  window.AULAS_ENDPOINT = "https://YOUR_PROJECT.supabase.co/functions/v1/offer";
</script>
```

Se permanecer vazio, o formulário exibirá sucesso sem enviar dados.

## Deploy da Edge Function

```bash
supabase functions deploy offer --no-verify-jwt
```

## Secrets do Supabase

Configure estes secrets para a função `offer`:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NOTIFY_EMAIL`
