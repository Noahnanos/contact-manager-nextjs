'use client'

import { Contact } from '@/types/contact'
// import { Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react'

interface ContactCardProps {
  contact: Contact
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
}

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {contact.firstName} {contact.lastName}
          </h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(contact)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
            title="Editar contacto"
          >
            <span className="text-sm">✏️</span>
          </button>
          <button
            onClick={() => onDelete(contact)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
            title="Eliminar contacto"
          >
            <span className="text-sm">🗑️</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-gray-600">
          <span className="text-sm">📧</span>
          <span className="text-sm">{contact.email}</span>
        </div>
        
        {contact.phone && (
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="text-sm">📞</span>
            <span className="text-sm">{contact.phone}</span>
          </div>
        )}
        
        {contact.address && (
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="text-sm">📍</span>
            <span className="text-sm">{contact.address}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        Creado: {new Date(contact.createdAt).toLocaleDateString()}
      </div>
    </div>
  )
}