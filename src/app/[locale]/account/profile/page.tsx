'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Pencil } from "lucide-react"
import { ThemeCards } from "@/components/theme/change-theme-cards"
import { LanguageSwitcher } from "@/components/ui/custom/LangSwitch"

export default function ProfilePage() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 mb-8 md:mb-0">
      <h2 className="text-3xl font-bold text-center">Профиль</h2>

      {/* Основная информация */}
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Левая часть: поля */}
          <div className="flex flex-col gap-6 w-full">
            {/* Имя */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor="fullname">Полное имя</Label>
                <Input id="fullname" defaultValue="Jane Doe" disabled />
              </div>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </div>

            {/* Почта */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor="email">Электронная почта</Label>
                <Input id="email" defaultValue="example@mail.com" disabled />
              </div>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </div>

            {/* Username */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input id="username" defaultValue="@username" disabled />
              </div>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Правая часть: аватар */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-32 h-32">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Изменить фото</Button>
          </div>
        </CardContent>
      </Card>

      {/* Персонализация */}
      <Card>
        <CardHeader>
          <CardTitle>Персонализация</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          {/* Тема */}
          <div>
            <p className="font-medium mb-3">Тема</p>
            <ThemeCards />
          </div>

          <Separator />

          {/* Язык */}
          <div>
            <p className="font-medium mb-3">Язык</p>
            <LanguageSwitcher />
          </div>
        </CardContent>
      </Card>

      {/* Подписка */}
      <Card>
        <CardHeader>
          <CardTitle>Подписка</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="font-medium">Текущий план</p>
            <p className="text-sm text-muted-foreground">Бесплатный</p>
          </div>
          <Button size="sm">Обновить</Button>
        </CardContent>
      </Card>
    </div>
  )
}
