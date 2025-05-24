import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Se requiere un prompt' },
        { status: 400 }
      );
    }

    // Inicializar Replicate con el token de API del servidor
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN || '',
    });

    // Usar la sintaxis correcta del ejemplo de Replicate
    const input = {
      prompt: prompt
    };

    const output = await replicate.run("black-forest-labs/flux-schnell", { input });

    // Obtener la URL usando la sintaxis correcta del ejemplo
    const imageUrl = Array.isArray(output) && output.length > 0 ? output[0].url() : null;

    if (!imageUrl) {
      throw new Error("No se generó ninguna imagen");
    }
    
    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error("Error al generar imagen:", error);
    return NextResponse.json(
      { error: error.message || "Error al generar imagen" },
      { status: 500 }
    );
  }
} 