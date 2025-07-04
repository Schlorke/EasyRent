"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../services/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Listar todos os modelos
router.get('/', async (req, res) => {
    try {
        const modelos = await prisma_1.default.modelo.findMany({
            include: {
                marca: true,
                carros: true
            },
            orderBy: {
                descricao: 'asc'
            }
        });
        res.json(modelos);
    }
    catch (error) {
        console.error('Erro ao listar modelos:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
// Listar modelos por marca
router.get('/marca/:marcaId', async (req, res) => {
    try {
        const { marcaId } = req.params;
        const modelos = await prisma_1.default.modelo.findMany({
            where: { marcaId },
            include: {
                marca: true,
                carros: true
            },
            orderBy: {
                descricao: 'asc'
            }
        });
        res.json(modelos);
    }
    catch (error) {
        console.error('Erro ao listar modelos por marca:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
// Obter modelo por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const modelo = await prisma_1.default.modelo.findUnique({
            where: { id },
            include: {
                marca: true,
                carros: true
            }
        });
        if (!modelo) {
            res.status(404).json({ message: 'Modelo não encontrado' });
            return;
        }
        res.json(modelo);
    }
    catch (error) {
        console.error('Erro ao buscar modelo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
// Criar novo modelo
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { codigo, descricao, marcaId } = req.body;
        if (!codigo || !descricao || !marcaId) {
            res.status(400).json({
                message: 'Código, descrição e marca são obrigatórios'
            });
            return;
        }
        // Verificar se a marca existe
        const marca = await prisma_1.default.marca.findUnique({
            where: { id: marcaId }
        });
        if (!marca) {
            res.status(404).json({ message: 'Marca não encontrada' });
            return;
        }
        // Verificar se o código já existe
        const modeloExistente = await prisma_1.default.modelo.findUnique({
            where: { codigo }
        });
        if (modeloExistente) {
            res.status(409).json({ message: 'Código do modelo já cadastrado' });
            return;
        }
        const modelo = await prisma_1.default.modelo.create({
            data: {
                codigo,
                descricao,
                marcaId
            },
            include: {
                marca: true
            }
        });
        res.status(201).json(modelo);
    }
    catch (error) {
        console.error('Erro ao criar modelo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
// Atualizar modelo
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { codigo, descricao, marcaId } = req.body;
        if (!codigo || !descricao || !marcaId) {
            res.status(400).json({
                message: 'Código, descrição e marca são obrigatórios'
            });
            return;
        }
        // Verificar se o modelo existe
        const modeloExistente = await prisma_1.default.modelo.findUnique({
            where: { id }
        });
        if (!modeloExistente) {
            res.status(404).json({ message: 'Modelo não encontrado' });
            return;
        }
        // Verificar se a marca existe
        const marca = await prisma_1.default.marca.findUnique({
            where: { id: marcaId }
        });
        if (!marca) {
            res.status(404).json({ message: 'Marca não encontrada' });
            return;
        }
        // Verificar se o código já está em uso por outro modelo
        const modeloComMesmoCodigo = await prisma_1.default.modelo.findFirst({
            where: {
                codigo,
                NOT: { id }
            }
        });
        if (modeloComMesmoCodigo) {
            res.status(409).json({ message: 'Código do modelo já está em uso' });
            return;
        }
        const modelo = await prisma_1.default.modelo.update({
            where: { id },
            data: {
                codigo,
                descricao,
                marcaId
            },
            include: {
                marca: true
            }
        });
        res.json(modelo);
    }
    catch (error) {
        console.error('Erro ao atualizar modelo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
// Deletar modelo
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        // Verificar se o modelo existe e se tem carros associados
        const modelo = await prisma_1.default.modelo.findUnique({
            where: { id },
            include: {
                carros: true
            }
        });
        if (!modelo) {
            res.status(404).json({ message: 'Modelo não encontrado' });
            return;
        }
        // Verificar se existem carros associados
        if (modelo.carros.length > 0) {
            res.status(400).json({
                message: 'Não é possível excluir o modelo pois existem carros associados'
            });
            return;
        }
        await prisma_1.default.modelo.delete({
            where: { id }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar modelo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
exports.default = router;
//# sourceMappingURL=modelo.js.map