"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Order {
  id: string
  date: string
  type: "payment" | "spend"
  amount: number
  description: string
  balance: number
}

export default function OrdersPage() {
  const [orders] = useState<Order[]>([
    {
      id: "1",
      date: "2025-09-20 14:32",
      type: "payment",
      amount: 20,
      description: "Пополнение через карту Visa •••• 1234",
      balance: 20,
    },
    {
      id: "2",
      date: "2025-09-21 10:15",
      type: "spend",
      amount: -14,
      description: "Создание фотокниги «Свадьба»",
      balance: 6,
    },
    {
      id: "3",
      date: "2025-09-23 09:00",
      type: "payment",
      amount: 10,
      description: "Пополнение через карту Visa •••• 1234",
      balance: 16,
    },
  ])

  const [filter, setFilter] = useState("all")

  const filteredOrders = orders.filter((order) => {
    if (filter === "payment") return order.type === "payment"
    if (filter === "spend") return order.type === "spend"
    return true
  })

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 mb-12 px-4">
      <h2 className="text-3xl font-semibold text-center text-foreground">
        История операций
      </h2>

      {/* Фильтры */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Select defaultValue="all" onValueChange={(v) => setFilter(v)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Фильтр по типу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все операции</SelectItem>
            <SelectItem value="payment">Пополнения</SelectItem>
            <SelectItem value="spend">Списания</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="30">
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Срок" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">За 30 дней</SelectItem>
            <SelectItem value="90">За 90 дней</SelectItem>
            <SelectItem value="365">За год</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-none shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Все списания и пополнения
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Для десктопа таблица */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b text-muted-foreground">
                  <th className="py-3 px-2">Дата</th>
                  <th className="py-3 px-2">Операция</th>
                  <th className="py-3 px-2">Сумма</th>
                  <th className="py-3 px-2">Описание</th>
                  <th className="py-3 px-2 text-right">Баланс</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition"
                  >
                    <td className="py-3 px-2 whitespace-nowrap">{order.date}</td>
                    <td className="py-3 px-2 flex items-center gap-2">
                      {order.type === "payment" ? (
                        <ArrowUpCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownCircle className="w-4 h-4 text-red-500" />
                      )}
                      {order.type === "payment" ? "Пополнение" : "Списание"}
                    </td>
                    <td
                      className={`py-3 px-2 font-medium ${
                        order.type === "payment"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.amount > 0 ? `+${order.amount}` : order.amount}
                    </td>
                    <td className="py-3 px-2">{order.description}</td>
                    <td className="py-3 px-2 text-right font-semibold">
                      {order.balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Для мобилки карточки */}
          <div className="flex flex-col gap-4 sm:hidden">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border p-4 shadow-sm bg-card"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground">
                    {order.date}
                  </span>
                  {order.type === "payment" ? (
                    <ArrowUpCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="font-medium">
                  {order.type === "payment" ? "Пополнение" : "Списание"}
                </div>
                <div
                  className={`font-bold ${
                    order.type === "payment"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.amount > 0 ? `+${order.amount}` : order.amount}
                </div>
                <div className="text-sm mt-1">{order.description}</div>
                <div className="text-right text-sm font-semibold mt-2">
                  Баланс: {order.balance}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
