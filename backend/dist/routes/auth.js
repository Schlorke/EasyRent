"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../services/prisma"));
const router = (0, express_1.Router)();
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            res.status(400).json({ message: 'Email e senha são obrigatórios' });
            return;
        }
        // Buscar usuário
        const usuario = await prisma_1.default.usuario.findUnique({
            where: { email }
        });
        if (!usuario) {
            res.status(401).json({ message: 'Credenciais inválidas' });
            return;
        }
        // Verificar senha
        const senhaValida = await bcryptjs_1.default.compare(senha, usuario.senha);
        if (!senhaValida) {
            res.status(401).json({ message: 'Credenciais inválidas' });
            return;
        }
        // Gerar JWT
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            res.status(500).json({ message: 'Configuração JWT inválida' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: usuario.id }, JWT_SECRET, { expiresIn: '24h' });
        // Retornar dados sem a senha
        const { senha: _, ...usuarioSemSenha } = usuario;
        res.json({
            token,
            usuario: usuarioSemSenha
        });
    }
    catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map