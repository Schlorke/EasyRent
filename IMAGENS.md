# Sistema de Imagens dos Carros - EasyRent

## 📁 Estrutura de Pastas

```
frontend/
├── public/
    ├── images/
        ├── car-placeholder.svg      # Imagem padrão (SVG)
        └── carros/                  # Pasta para imagens dos carros
            ├── civic.jpg
            ├── corolla.jpg
            ├── golf.jpg
            ├── hrv.jpg
            ├── jeep_compass.jpg
            ├── mustang.jpg
            ├── ranger.jpg
            └── sw4.jpg
```

## 🚗 Como Cadastrar Carros com Imagens

### 1. Adicionar Imagem na Pasta
1. Coloque a imagem do carro na pasta `frontend/public/images/carros/`
2. Use nomes descritivos (ex: `civic_2024.jpg`, `corolla_branco.jpg`)
3. Formatos suportados: `.jpg`, `.jpeg`, `.png`, `.webp`

### 2. Cadastrar no Admin
1. Acesse a página **Admin** → aba **Carros**
2. Preencha todos os campos obrigatórios
3. No campo **"Imagem do Veículo"**, digite apenas o nome do arquivo
   - ✅ Correto: `civic.jpg`
   - ❌ Incorreto: `/images/carros/civic.jpg`
4. Clique em **"Salvar Carro"**

### 3. Visualizar na Locação
- Carros **com imagem**: Mostra a foto real do veículo
- Carros **sem imagem**: Mostra um SVG genérico de carro

## 🎨 Imagem Padrão (SVG)

O sistema possui uma imagem SVG genérica que é exibida quando:
- O carro não tem imagem cadastrada
- A imagem cadastrada não foi encontrada
- Ocorre erro ao carregar a imagem

## 📋 Exemplos de Uso

### Exemplo 1: Carro com Imagem
```
Código: 001
Modelo: Honda Civic
Ano: 2024
Cor: Branco
Imagem: civic.jpg          ← Nome do arquivo
```

### Exemplo 2: Carro sem Imagem
```
Código: 002
Modelo: Toyota Corolla
Ano: 2023
Cor: Prata
Imagem: [deixar vazio]     ← Mostrará SVG genérico
```

## 🔧 Resolução de Problemas

### Imagem não aparece?
1. **Verifique o nome do arquivo**
   - Certifique-se que o nome está correto (case-sensitive)
   - Exemplo: `Civic.jpg` ≠ `civic.jpg`

2. **Verifique se a imagem existe**
   - Confirme que o arquivo está em `frontend/public/images/carros/`

3. **Verifique o formato**
   - Use formatos web: `.jpg`, `.jpeg`, `.png`, `.webp`

4. **Limpe o cache do navegador**
   - Pressione `Ctrl + F5` (Windows/Linux) ou `Cmd + Shift + R` (Mac)

## 🎯 Dicas de Boas Práticas

1. **Nomeação de Arquivos**
   - Use nomes descritivos: `civic_2024_branco.jpg`
   - Evite espaços: `jeep compass.jpg` → `jeep_compass.jpg`
   - Use apenas letras minúsculas e underscores

2. **Tamanho das Imagens**
   - Recomendado: 800x600px ou proporção 4:3
   - Tamanho máximo: 2MB por imagem

3. **Qualidade**
   - Use imagens nítidas e bem iluminadas
   - Prefira fotos com fundo neutro
   - Mostre o carro de perfil ou 3/4

## 🚀 Funcionalidades Implementadas

- ✅ Upload de imagens via pasta pública
- ✅ Fallback para imagem SVG genérica
- ✅ Campo de imagem no formulário Admin
- ✅ Exibição nas páginas de Locação
- ✅ Tratamento de erros de carregamento
- ✅ Validação de arquivos

## 📝 Próximas Melhorias

- 🔄 Upload direto de imagens via interface
- 🔄 Redimensionamento automático
- 🔄 Múltiplas imagens por carro
- 🔄 Galeria de imagens
- 🔄 Compressão automática 