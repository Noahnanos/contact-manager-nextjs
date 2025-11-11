'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Contact, ContactFormData } from '@/types/contact'
import { ContactCard } from '@/components/ContactCard'
import { ContactForm } from '@/components/ContactForm'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EmptyState, LoadingState } from '@/components/UIStates'
// import { UserPlus, Search } from 'lucide-react'

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isFormLoading, setIsFormLoading] = useState(false)
  
  // Delete state
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Load contacts
  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/contacts')
      if (!response.ok) {
        throw new Error('Failed to fetch contacts')
      }
      const data = await response.json()
      setContacts(data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast.error('Error al cargar los contactos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddContact = () => {
    setSelectedContact(null)
    setIsFormOpen(true)
  }

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact)
    setIsFormOpen(true)
  }

  const handleDeleteContact = (contact: Contact) => {
    setDeleteContact(contact)
  }

  const handleSaveContact = async (contactData: ContactFormData) => {
    try {
      setIsFormLoading(true)
      
      if (selectedContact) {
        // Update existing contact
        const response = await fetch(`/api/contacts/${selectedContact.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactData),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update contact')
        }
        
        const updatedContact = await response.json()
        setContacts(prev => 
          prev.map(c => c.id === selectedContact.id ? updatedContact : c)
        )
        toast.success('Contacto actualizado exitosamente')
      } else {
        // Create new contact
        const response = await fetch('/api/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactData),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create contact')
        }
        
        const newContact = await response.json()
        setContacts(prev => [newContact, ...prev])
        toast.success('Contacto creado exitosamente')
      }
      
      setIsFormOpen(false)
      setSelectedContact(null)
    } catch (error) {
      console.error('Error saving contact:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el contacto'
      toast.error(errorMessage)
    } finally {
      setIsFormLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteContact) return
    
    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/contacts/${deleteContact.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete contact')
      }
      
      setContacts(prev => prev.filter(c => c.id !== deleteContact.id))
      toast.success(`Contacto ${deleteContact.firstName} ${deleteContact.lastName} eliminado exitosamente`)
      setDeleteContact(null)
    } catch (error) {
      console.error('Error deleting contact:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el contacto'
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase()
    return (
      contact.firstName.toLowerCase().includes(searchLower) ||
      contact.lastName.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      (contact.phone && contact.phone.includes(searchTerm))
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestor de Contactos</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona tus contactos de manera eficiente
              </p>
            </div>
            <button
              onClick={handleAddContact}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <span className="mr-2">+</span>
              Agregar Contacto
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="h-5 w-5 text-gray-400 flex items-center justify-center">🔍</span>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar contactos por nombre, email o teléfono..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Contacts Grid */}
        {isLoading ? (
          <LoadingState message="Cargando contactos..." />
        ) : filteredContacts.length === 0 ? (
          <EmptyState
            title={searchTerm ? 'No se encontraron contactos' : 'Aún no hay contactos'}
            description={
              searchTerm 
                ? 'Intenta ajustar los términos de búsqueda o limpia la búsqueda para ver todos los contactos.'
                : 'Agrega tu primer contacto al sistema.'
            }
            actionLabel={searchTerm ? undefined : "Agregar Tu Primer Contacto"}
            onAction={searchTerm ? undefined : handleAddContact}
          />
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Mostrando {filteredContacts.length} de {contacts.length} contactos
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Contact Form Modal */}
      <ContactForm
        contact={selectedContact}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedContact(null)
        }}
        onSave={handleSaveContact}
        isLoading={isFormLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteContact}
        title="Eliminar Contacto"
        message={
          deleteContact 
            ? `¿Estás seguro de que deseas eliminar a ${deleteContact.firstName} ${deleteContact.lastName}? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteContact(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  )
}
