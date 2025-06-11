"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, X, MessageCircle, Minimize2 } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "¡Hola! Soy el asistente de IA de TicaShop. Puedo ayudarte con consultas sobre vacaciones, cálculos de comisiones, firmas digitales y más. ¿En qué puedo asistirte hoy?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simular respuesta del asistente IA
    setTimeout(() => {
      const assistantResponse = generateAIResponse(inputMessage)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantResponse,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("vacacion") || input.includes("dias libres")) {
      return "Veo que preguntas sobre vacaciones en TicaShop. Puedo ayudarte a:\n• Revisar tu balance de días disponibles\n• Calcular días para una solicitud\n• Explicar el proceso de aprobación\n• Consultar el estado de tus solicitudes\n\n¿Qué específicamente te gustaría saber?"
    }

    if (input.includes("comision") || input.includes("ventas")) {
      return "Para calcular tu comisión en TicaShop, puedo ayudarte con:\n• Cálculo automático basado en ventas\n• Explicar diferentes tipos de comisiones\n• Revisar tu historial de ganancias\n• Configurar tasas personalizadas\n\n¿Necesitas calcular una comisión específica?"
    }

    if (input.includes("firma") || input.includes("documento")) {
      return "Puedo ayudarte con firmas digitales en TicaShop:\n• Crear nuevas plantillas de firma\n• Firmar documentos pendientes\n• Explicar el proceso de firma digital\n• Gestionar tus documentos\n\n¿Qué necesitas hacer con las firmas?"
    }

    if (input.includes("supervisor") || input.includes("aprobar")) {
      return "Para funciones de supervisor en TicaShop, puedo ayudarte con:\n• Revisar solicitudes pendientes\n• Proceso de aprobación/rechazo\n• Gestión del equipo\n• Reportes y estadísticas\n\n¿Qué tarea de supervisión necesitas realizar?"
    }

    if (input.includes("empleado") || input.includes("solicitar")) {
      return "Como empleado de TicaShop, puedo ayudarte con:\n• Crear nuevas solicitudes de vacaciones\n• Revisar tu balance de días\n• Firmar documentos pendientes\n• Calcular comisiones\n\n¿En qué puedo asistirte específicamente?"
    }

    if (input.includes("hola") || input.includes("ayuda")) {
      return "¡Perfecto! Puedo ayudarte con:\n• 📅 Gestión de vacaciones y solicitudes\n• 💰 Cálculos de comisiones y bonificaciones\n• ✍️ Firmas digitales y documentos\n• 👥 Funciones de supervisión (si aplica)\n• 📊 Consultas sobre tu panel de administración\n\n¿Qué te gustaría hacer?"
    }

    if (input.includes("balance") || input.includes("disponible")) {
      return "Para consultar tu balance de vacaciones en TicaShop:\n• Ve a la pestaña 'Vacaciones'\n• Revisa la tarjeta 'Balance de Vacaciones'\n• Allí verás días disponibles, usados y totales\n\n¿Necesitas ayuda con algún cálculo específico?"
    }

    if (input.includes("como") || input.includes("proceso")) {
      return "Te puedo explicar cualquier proceso del sistema de TicaShop:\n• Cómo solicitar vacaciones\n• Cómo calcular comisiones\n• Cómo crear firmas digitales\n• Cómo aprobar solicitudes (supervisores)\n\n¿Qué proceso te gustaría que te explique paso a paso?"
    }

    return "Entiendo tu consulta. Como asistente especializado en gestión empresarial de TicaShop, puedo ayudarte con:\n\n📅 **Vacaciones**: Solicitudes, balances, aprobaciones\n💰 **Comisiones**: Cálculos, historiales, tasas\n✍️ **Firmas**: Documentos digitales, plantillas\n👥 **Gestión**: Supervisión y administración\n\n¿Podrías ser más específico sobre lo que necesitas?"
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-4 right-4 w-80 shadow-xl transition-all duration-300 border-blue-200 dark:border-blue-800 ${isMinimized ? "h-14" : "h-96"}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-sm text-gray-800 dark:text-white">Asistente IA</CardTitle>
          <Badge
            variant="secondary"
            className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
          >
            En línea
          </Badge>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="h-6 w-6 p-0">
            <Minimize2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-80">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 text-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex space-x-2">
              <Input
                placeholder="Escribe tu mensaje..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
