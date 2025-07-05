import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// Mapeamento de imagens pré-existentes
const preExistingImages: Record<string, string> = {
  'civic.jpg': '/assets/civic.jpg',
  'corolla.jpg': '/assets/corolla.jpg', 
  'golf.jpg': '/assets/golf.jpg',
  'hrv.jpg': '/assets/hrv.jpg',
  'jeep_compass.jpg': '/assets/jeep_compass.jpg',
  'mustang.jpg': '/assets/mustang.jpg',
  'ranger.jpg': '/assets/ranger.jpg',
  'sw4.jpg': '/assets/sw4.jpg'
};

async function migrateImages() {
  console.log('🔄 Iniciando migração de imagens para Base64...');

  try {
    // Buscar todos os carros
    const carros = await prisma.carro.findMany();
    console.log(`📊 Encontrados ${carros.length} carros`);

    let migrated = 0;
    let skipped = 0;

    for (const carro of carros) {
      if (!carro.imagem) {
        skipped++;
        continue;
      }

      // Se já é Base64, pular
      if (carro.imagem.startsWith('data:')) {
        console.log(`✅ Carro ${carro.codigo} já tem imagem Base64`);
        skipped++;
        continue;
      }

      // Se é uma imagem pré-existente, manter como URL
      const imageName = carro.imagem.replace('/images/carros/', '').replace('/assets/', '');
      if (preExistingImages[imageName]) {
        // Atualizar para usar o caminho correto de assets
        await prisma.carro.update({
          where: { id: carro.id },
          data: { imagem: preExistingImages[imageName] }
        });
        console.log(`📸 Carro ${carro.codigo}: atualizado para usar ${preExistingImages[imageName]}`);
        migrated++;
        continue;
      }

      // Para outras imagens, limpar o campo (serão re-enviadas pelos usuários)
      await prisma.carro.update({
        where: { id: carro.id },
        data: { imagem: null }
      });
      console.log(`🧹 Carro ${carro.codigo}: imagem removida (não é pré-existente)`);
      migrated++;
    }

    console.log(`\n✅ Migração concluída!`);
    console.log(`📊 Total: ${carros.length} carros`);
    console.log(`✅ Migrados: ${migrated}`);
    console.log(`⏭️  Pulados: ${skipped}`);

  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar migração
migrateImages(); 