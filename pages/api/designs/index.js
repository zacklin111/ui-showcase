import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const designs = await prisma.design.findMany({
        include: {
          category: true,
          tags: true,
        },
      });
      res.status(200).json(designs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch designs' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, figma_link, preview_image_url, category_id, tags } = req.body;
      
      const design = await prisma.design.create({
        data: {
          title,
          description,
          figma_link,
          preview_image_url,
          category: {
            connect: { id: category_id },
          },
          tags: {
            connect: tags.map(tag_id => ({ id: tag_id })),
          },
        },
      });
      
      res.status(201).json(design);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create design' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 