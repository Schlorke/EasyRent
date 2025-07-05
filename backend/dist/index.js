"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
// Importar rotas
const usuario_1 = __importDefault(require("./routes/usuario"));
const marca_1 = __importDefault(require("./routes/marca"));
const modelo_1 = __importDefault(require("./routes/modelo"));
const carro_1 = __importDefault(require("./routes/carro"));
const auth_1 = __importDefault(require("./routes/auth"));
const upload_1 = __importDefault(require("./routes/upload"));
const locacao_1 = __importDefault(require("./routes/locacao"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 4000;
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    ],
    credentials: true,
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Rotas
app.use('/auth', auth_1.default);
app.use('/usuarios', usuario_1.default);
app.use('/marcas', marca_1.default);
app.use('/modelos', modelo_1.default);
app.use('/carros', carro_1.default);
app.use('/upload', upload_1.default);
app.use('/locacoes', locacao_1.default);
// Rota de healthcheck
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Middleware de erro global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
});
// Rota 404
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌐 API disponível em: http://localhost:${PORT}`);
});
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🔴 Finalizando servidor...');
    await prisma.$disconnect();
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=index.js.map