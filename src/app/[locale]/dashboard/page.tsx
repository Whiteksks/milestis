'use client'

import { SidebarProvider } from '@/components/ui/sidebar'
import { Card, CardContent } from '@/components/ui/card'

import SidebarApp from '@/components/layout/dashboard/dashboard-sidebar'
import HeaderApp from '@/components/layout/dashboard/dashboard-header'

const ApplicationShell = () => {
  return (
    <div className='flex min-h-dvh w-full bg-muted/30'>
      <SidebarProvider>
        <SidebarApp />
        <div className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <HeaderApp withSidebarTrigger={true} />

          {/* Floating Main Content */}
          <main className='mx-3 sm:mx-4 flex-1 mb-4'>
            <Card className='h-full rounded-2xl shadow-sm'>
              <CardContent className='h-full'>
                <div className='h-full rounded-md border bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_1px,var(--card)_2px,var(--card)_15px)]' />
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default ApplicationShell
