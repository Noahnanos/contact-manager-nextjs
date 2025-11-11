import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validación para actualizar contactos
const contactUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email format').max(255),
  phone: z.string().max(20).optional().nullable(),
  address: z.string().optional().nullable(),
})

// GET /api/contacts/[id] - Obtener un contacto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params
    const id = parseInt(idString)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid contact ID' },
        { status: 400 }
      )
    }
    
    const contact = await prisma.contact.findUnique({
      where: { id },
    })
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

// PUT /api/contacts/[id] - Actualizar un contacto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params
    const id = parseInt(idString)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid contact ID' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    const validatedData = contactUpdateSchema.parse(body)
    
    // Verificar si el contacto existe
    const existingContact = await prisma.contact.findUnique({
      where: { id },
    })
    
    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }
    
    // Verificar que el email no esté siendo usado por otro contacto
    const emailConflict = await prisma.contact.findUnique({
      where: { email: validatedData.email },
    })
    
    if (emailConflict && emailConflict.id !== id) {
      return NextResponse.json(
        { error: 'Ya existe un contacto con este correo electrónico' },
        { status: 400 }
      )
    }
    
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: validatedData,
    })
    
    return NextResponse.json(updatedContact)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

// DELETE /api/contacts/[id] - Eliminar un contacto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params
    const id = parseInt(idString)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid contact ID' },
        { status: 400 }
      )
    }
    
    // Verificar si el contacto existe
    const existingContact = await prisma.contact.findUnique({
      where: { id },
    })
    
    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }
    
    await prisma.contact.delete({
      where: { id },
    })
    
    return NextResponse.json(
      { message: 'Contact deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}