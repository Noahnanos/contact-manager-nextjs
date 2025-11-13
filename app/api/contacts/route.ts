import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validación para contactos
const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.email('Invalid email format').max(255),
  phone: z.string().max(20).optional().nullable(),
  address: z.string().optional().nullable(),
})

// GET /api/contacts - Obtener todos los contactos
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

// POST /api/contacts - Crear nuevo contacto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos
    const validatedData = contactSchema.parse(body)
    
    // Verificar que el email no exista
    const existingContact = await prisma.contact.findUnique({
      where: { email: validatedData.email },
    })
    
    if (existingContact) {
      return NextResponse.json(
        { error: 'Ya existe un contacto con este correo electrónico' },
        { status: 400 }
      )
    }
    
    const contact = await prisma.contact.create({
      data: validatedData,
    })
    
    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}