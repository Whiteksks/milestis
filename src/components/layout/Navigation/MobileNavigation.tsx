// ...existing code...
"use client"

import { useState } from "react"
import { LayoutGrid, Plus } from "lucide-react"
import HomeIcon from '@/components/icons/HomeIcon.svg'  
import ProfileIcon from '@/components/icons/UserIcon.svg' 
import FolderIcon from '@/components/icons/Milestis.svg'  

import AuthDialogController from "../Dialog/DialogOptions/AuthDialogController"


const MobileNavigation = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 
                      bg-sidebar text-sidebar-foreground shadow-xl 
                      rounded-2xl flex justify-around items-center 
                      w-[90%] max-w-md h-16 z-50 md:hidden
                      backdrop-blur-md border border-border">
        
        {/* Главная */}
        <button type="button" className="flex flex-col items-center">
          <HomeIcon className="w-5 h-5" />
          <span className="text-[11px]">Главная</span>
        </button>

        {/* Проекты */}
        <button type="button" className="flex flex-col items-center">
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[11px]">Проекты</span>
        </button>

        {/* Центральная кнопка */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2">
          <button
            type="button"
            className="w-14 h-14 rounded-full shadow-2xl 
                       bg-primary text-primary-foreground 
                       hover:bg-primary/90 flex items-center justify-center"
            aria-label="Создать"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Шаблоны */}
        <button type="button" className="flex flex-col items-center">
          <FolderIcon className="w-5 h-5" />
          <span className="text-[11px]">Шаблоны</span>
        </button>

        {/* Профиль */}
        <button
          type="button"
          className="flex flex-col items-center"
          onClick={() => setShowAuthDialog(true)}
        >
          <ProfileIcon className="w-5 h-5" />
          <span className="text-[11px]">Профиль</span>
        </button>
      </div>

      {showAuthDialog && (
        <AuthDialogController open={showAuthDialog} setOpen={setShowAuthDialog} />
      )}
    </>
  )
}

export default MobileNavigation
// ...existing code...