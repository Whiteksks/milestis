'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputPasswordStrength from '@/components/ui/custom/inputPassword'
import { Mail, Fingerprint, LogOut, Trash2, Lock } from 'lucide-react'

export default function AccountSettingsPage() {
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 mb-8 md:mb-0">
      <h2 className="text-2xl font-bold mb-2 text-center">Учётная запись</h2>

      {/* Методы входа */}
      <Card>
        <CardHeader>
          <CardTitle>Методы входа</CardTitle>
          <CardDescription>Управляйте способами входа в аккаунт.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y">
          {/* Email */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">1 подтверждённый email</p>
              </div>
            </div>
            <Button variant="outline">Управлять</Button>
          </div>

          {/* Password */}
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Пароль</p>
                  <p className="text-sm text-muted-foreground">Установлен</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowPasswordForm((prev) => !prev)}
              >
                {showPasswordForm ? 'Отмена' : 'Сменить'}
              </Button>
            </div>

            {/* Форма смены пароля */}
            {showPasswordForm && (
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <Label htmlFor="current-password">Текущий пароль</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">Новый пароль</Label>
                  <InputPasswordStrength />
                </div>
                <div>
                  <Button variant="secondary">Изменить пароль</Button>
                </div>
              </div>
            )}
          </div>

          {/* Passkeys */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Fingerprint className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Passkeys</p>
                <p className="text-sm text-muted-foreground">
                  Вход по ключам или биометрии
                </p>
              </div>
            </div>
            <Button variant="outline">Добавить</Button>
          </div>

          {/* Google */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <img src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/google-icon.png?width=20&height=20&format=auto" alt="Google" className="h-5 w-5" />
              <div>
                <p className="font-medium">Google</p>
                <p className="text-sm text-muted-foreground">
                  Вход с Google аккаунтом
                </p>
              </div>
            </div>
            <Button variant="outline">Привязать</Button>
          </div>
        </CardContent>
      </Card>

      {/* Опасные действия */}
      <Card className="border-red-500/40">
        <CardHeader>
          <CardTitle className="text-red-500">Опасные действия</CardTitle>
          <CardDescription>
            Будьте осторожны, эти действия необратимы.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y">
          {/* Logout all */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Выйти из всех устройств</p>
                <p className="text-sm text-muted-foreground">
                  Завершите все активные сессии
                </p>
              </div>
            </div>
            <Button variant="destructive">Выйти</Button>
          </div>

          {/* Delete account */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Удалить аккаунт</p>
                <p className="text-sm text-muted-foreground">
                  Удалит все ваши данные безвозвратно
                </p>
              </div>
            </div>
            <Button variant="destructive">Удалить</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
