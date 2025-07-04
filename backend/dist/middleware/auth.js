"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../services/prisma"));
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token de acesso requerido' });
            return;
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            res.status(500).json({ message: 'Configuração JWT inválida' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Buscar o usuário no banco
        const user = await prisma_1.default.usuario.findUnique({
            where: { id: decoded.userId },
            select: { id: true, nome: true, email: true }
        });
        if (!user) {
            res.status(401).json({ message: 'Usuário não encontrado' });
            return;
        }
        req.userId = decoded.userId;
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Erro na autenticação:', error);
        res.status(403).json({ message: 'Token inválido' });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map