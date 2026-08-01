'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, GripVertical, CheckCircle2, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { LoadingSpinner } from '@/components/admin/LoadingSpinner'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { EmptyState } from '@/components/admin/EmptyState'
import { Button } from '@/components/ui/Button'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { MenuItemForm } from '@/components/admin/MenuItemForm'
import { MenuCategory, MenuItem } from '@/types'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function MenuManagerPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Selection
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  // Modals state
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  
  const [isItemFormOpen, setIsItemFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  // Delete Confirmations
  const [deleteData, setDeleteData] = useState<{ type: 'category' | 'item', id: string, name: string } | null>(null)

  const fetchData = async () => {
    try {
      const [catRes, itemRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/menu') // Wait, our menu API returns { categories, items }
      ])
      
      const menuJson = await itemRes.json()
      if (menuJson.success) {
        setCategories(menuJson.data.categories)
        setItems(menuJson.data.items)
        if (!selectedCategoryId && menuJson.data.categories.length > 0) {
          setSelectedCategoryId(menuJson.data.categories[0].id)
        }
      }
    } catch (error) {
      toast.error('Failed to load menu data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async () => {
    if (!deleteData) return

    try {
      const url = deleteData.type === 'category' 
        ? `/api/admin/categories/${deleteData.id}` 
        : `/api/admin/menu/${deleteData.id}`

      const res = await fetch(url, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')

      toast.success(`${deleteData.type === 'category' ? 'Category' : 'Item'} deleted`)
      if (deleteData.type === 'category' && selectedCategoryId === deleteData.id) {
        setSelectedCategoryId(null)
      }
      fetchData()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setDeleteData(null)
    }
  }

  const toggleItemAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch(`/api/admin/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !item.is_available })
      })
      if (!res.ok) throw new Error()
      fetchData()
      toast.success(`${item.name} is now ${!item.is_available ? 'available' : 'unavailable'}`)
    } catch {
      toast.error('Failed to toggle availability')
    }
  }

  if (isLoading) return <LoadingSpinner />

  const filteredItems = selectedCategoryId 
    ? items.filter(i => i.category_id === selectedCategoryId)
    : items

  return (
    <div className="space-y-6 pb-12 h-[calc(100vh-120px)] flex flex-col">
      <PageHeader 
        title="Menu Manager" 
        description="Manage your categories and menu items."
        action={
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => { setEditingCategory(null); setIsCategoryFormOpen(true) }}
            >
              <Plus className="h-4 w-4 mr-2" /> Category
            </Button>
            <Button 
              onClick={() => { setEditingItem(null); setIsItemFormOpen(true) }}
            >
              <Plus className="h-4 w-4 mr-2" /> Menu Item
            </Button>
          </div>
        }
      />

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        {/* Categories Sidebar */}
        <div className="w-full md:w-64 flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shrink-0">
          <div className="p-4 border-b border-zinc-800 bg-zinc-800/30 font-semibold text-zinc-200">
            Categories
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                  selectedCategoryId === cat.id 
                    ? 'bg-brand-primary text-white' 
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <GripVertical className="h-4 w-4 opacity-30" />
                  <span className="truncate font-medium">{cat.name}</span>
                </div>
                <div className={`flex items-center gap-1 transition-opacity ${selectedCategoryId === cat.id ? 'text-white' : 'text-zinc-400 opacity-50 group-hover:opacity-100'}`}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditingCategory(cat); setIsCategoryFormOpen(true) }}
                    className="p-1 rounded hover:bg-black/20"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setDeleteData({ type: 'category', id: cat.id, name: cat.name })
                    }}
                    className="p-1 rounded hover:bg-black/20 text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="p-4 text-center text-sm text-zinc-500">
                No categories yet
              </div>
            )}
          </div>
        </div>

        {/* Items Area */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col min-h-0">
          <div className="p-4 border-b border-zinc-800 bg-zinc-800/30 flex items-center justify-between">
            <span className="font-semibold text-zinc-200">
              {categories.find(c => c.id === selectedCategoryId)?.name || 'All Items'}
            </span>
            <span className="text-sm text-zinc-500">{filteredItems.length} items</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredItems.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 border border-zinc-800 rounded-xl bg-zinc-950/50 hover:border-zinc-700 transition-colors">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No img</div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-zinc-100 truncate">{item.name}</h4>
                          <span className="font-semibold text-brand-primary shrink-0">{formatCurrency(item.price)}</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-2">
                          {item.is_vegetarian ? (
                            <span className="inline-flex items-center justify-center w-4 h-4 border border-green-500 rounded-sm">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-4 h-4 border border-red-500 rounded-sm">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            </span>
                          )}
                          <button 
                            onClick={() => toggleItemAvailability(item)}
                            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-colors ${
                              item.is_available 
                                ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' 
                                : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                            }`}
                          >
                            {item.is_available ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {item.is_available ? 'Available' : 'Out of stock'}
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => { setEditingItem(item); setIsItemFormOpen(true) }}
                            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setDeleteData({ type: 'item', id: item.id, name: item.name })}
                            className="p-1.5 rounded-md hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No items found"
                description={categories.length > 0 ? "Add an item to this category to see it here." : "Please create a category first."}
                action={
                  <Button 
                    onClick={() => { setEditingItem(null); setIsItemFormOpen(true) }}
                    disabled={categories.length === 0}
                  >
                    Add Menu Item
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>

      <CategoryForm 
        isOpen={isCategoryFormOpen} 
        onClose={() => setIsCategoryFormOpen(false)} 
        onSuccess={fetchData} 
        category={editingCategory} 
      />

      <MenuItemForm 
        isOpen={isItemFormOpen} 
        onClose={() => setIsItemFormOpen(false)} 
        onSuccess={fetchData} 
        item={editingItem}
        categories={categories}
      />

      <ConfirmDialog 
        isOpen={!!deleteData}
        title={`Delete ${deleteData?.type}`}
        message={`Are you sure you want to delete "${deleteData?.name}"? This action cannot be undone.`}
        isDestructive
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteData(null)}
      />
    </div>
  )
}
