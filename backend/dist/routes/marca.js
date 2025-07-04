"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../services/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Listar todas as marcas
router.get('/', async (req, res) => {
    try {
        const marcas = await prisma_1.default.marca.findMany({
            include: {
                modelos: {
                    include: {
                        carros: true
                    }
                }
            },
            orderBy: {
                nome: 'asc'
            }
        });
        res.json(marcas);
    }
    catch (error) {
        console.error('Erro ao listar marcas:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
// Obter marca por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const marca = await prisma_1.default.marca.findUnique({
            where: { id },
            include: {
                modelos: {
                    include: {
                        carros: true
                    }
                }
            }
        });
        if (!marca) {
            res.status(404).json({ message: 'Marca não encontrada' });
            return;
        }
        res.json(marca);
    }
    catch (error) {
        console.error('Erro ao buscar marca:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
// Criar nova marca
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome) {
            res.status(400).json({ message: 'Nome da marca é obrigatório' });
            return;
        }
        // Verificar se a marca já existe
        const marcaExistente = await prisma_1.default.marca.findUnique({
            where: { nome }
        });
        if (marcaExistente) {
            res.status(409).json({ message: 'Marca já cadastrada' });
            return;
        }
        const marca = await prisma_1.default.marca.create({
            data: { nome }
        });
        res.status(201).json(marca);
    }
    catch (error) {
        console.error('Erro ao criar marca:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
// Atualizar marca
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;
        if (!nome) {
            res.status(400).json({ message: 'Nome da marca é obrigatório' });
            return;
        }
        // Verificar se a marca existe
        const marcaExistente = await prisma_1.default.marca.findUnique({
            where: { id }
        });
        if (!marcaExistente) {
            res.status(404).json({ message: 'Marca não encontrada' });
            return;
        }
        // Verificar se o novo nome já está em uso por outra marca
        const marcaComMesmoNome = await prisma_1.default.marca.findFirst({
            where: {
                nome,
                NOT: { id }
            }
        });
        if (marcaComMesmoNome) {
            res.status(409).json({ message: 'Nome da marca já está em uso' });
            return;
        }
        const marca = await prisma_1.default.marca.update({
            where: { id },
            data: { nome }
        });
        res.json(marca);
    }
    catch (error) {
        console.error('Erro ao atualizar marca:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
// Deletar marca
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        // Verificar se a marca existe
        const marca = await prisma_1.default.marca.findUnique({
            where: { id },
            include: {
                modelos: {
                    include: {
                        carros: true
                    }
                }
            }
        });
        if (!marca) {
            res.status(404).json({ message: 'Marca não encontrada' });
            return;
        }
        // Verificar se existem carros associados
        const temCarros = marca.modelos.some((modelo) => modelo.carros.length > 0);
        if (temCarros) {
            res.status(400).json({
                message: 'Não é possível excluir a marca pois existem carros associados'
            });
            return;
        }
        await prisma_1.default.marca.delete({
            where: { id }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar marca:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
exports.default = router;
//# sourceMappingURL=marca.js.map