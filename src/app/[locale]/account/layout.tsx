'use client'

import HeaderApp from '@/components/layout/dashboard/dashboard-header'
import { Card } from '@/components/ui/card'
import SettingsSidebar from '@/components/layout/dashboard/SettingsSidebar'

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <HeaderApp withSidebarTrigger={false} />
      <div className="w-full flex justify-center px-4 py-8">
        <div className="flex w-full max-w-7xl gap-8 flex-col md:flex-row">
          <SettingsSidebar />

          <div className="flex-1">
            <Card className="p-0 md:p-6 md:min-h-[400px] h-full border-0 md:border shadow-none md:shadow">
              {children}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsLayout
