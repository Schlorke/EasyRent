"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../services/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Criar usuário
router.post('/', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
            return;
        }
        // Verificar se o email já existe
        const usuarioExistente = await prisma_1.default.usuario.findUnique({
            where: { email }
        });
        if (usuarioExistente) {
            res.status(409).json({ message: 'Email já cadastrado' });
            return;
        }
        // Criptografar senha
        const senhaHash = await bcryptjs_1.default.hash(senha, 10);
        // Criar usuário
        const usuario = await prisma_1.default.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash
            },
            select: {
                id: true,
                nome: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.status(201).json(usuario);
    }
    catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
// Obter perfil do usuário autenticado
router.get('/profile', auth_1.authenticateToken, async (req, res) => {
    try {
        const usuario = await prisma_1.default.usuario.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                nome: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!usuario) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.json(usuario);
    }
    catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
// Listar todos os usuários (protegido)
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const usuarios = await prisma_1.default.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json(usuarios);
    }
    catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
exports.default = router;
//# sourceMappingURL=usuario.js.map