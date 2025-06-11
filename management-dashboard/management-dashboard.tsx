"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Calculator,
  PenTool,
  Plus,
  Trash2,
  LogOut,
  Check,
  X,
  User,
  Shield,
  Bell,
  Sun,
  Moon,
  Briefcase,
  FileText,
  BarChart3,
  CalendarDays,
  Clock,
  Award,
} from "lucide-react"
import { LoginForm } from "./components/login-form"
import { AIAssistant } from "./components/ai-assistant"

interface DashboardUser {
  email: string
  name: string
  role: "empleado" | "supervisor"
}

interface VacationRequest {
  id: number
  startDate: string
  endDate: string
  days: number
  status: "aprobado" | "pendiente" | "rechazado"
  reason: string
  employeeName: string
  employeeEmail: string
}

interface CommissionRecord {
  id: number
  month: string
  sales: number
  commission: number
  rate: number
}

interface SignatureTemplate {
  id: number
  name: string
  style: string
}

interface Document {
  id: number
  name: string
  date: string
  status: "firmado" | "pendiente"
  employeeEmail: string
}

export default function Component() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")

  // Estados para vacaciones - inicializados vacíos
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([])

  const [newVacationRequest, setNewVacationRequest] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  })

  // Balance de vacaciones por usuario
  const [vacationBalances, setVacationBalances] = useState({
    "admin@empresa.com": { available: 25, used: 0, total: 25 },
    "empleado@empresa.com": { available: 25, used: 0, total: 25 },
  })

  // Estados para comisiones - inicializados vacíos
  const [commissionData, setCommissionData] = useState({
    salesAmount: "",
    commissionRate: "",
    bonusAmount: "",
  })

  const [commissionHistory, setCommissionHistory] = useState<CommissionRecord[]>([])

  // Estados para firmas - inicializados vacíos
  const [signatureTemplates, setSignatureTemplates] = useState<SignatureTemplate[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [typedSignature, setTypedSignature] = useState("")

  // Efecto para notificaciones
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showNotification])

  // Función para mostrar notificaciones
  const showNotify = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
  }

  // Funciones de autenticación
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setTimeout(() => {
      if (email === "admin@empresa.com" && password === "admin123") {
        setUser({ email, name: "Juan Pérez", role: "supervisor" })
        setIsAuthenticated(true)
        showNotify("¡Bienvenido a TicaShop, Juan! Has iniciado sesión como supervisor.")
      } else if (email === "empleado@empresa.com" && password === "empleado123") {
        setUser({ email, name: "María García", role: "empleado" })
        setIsAuthenticated(true)
        showNotify("¡Bienvenida a TicaShop, María! Has iniciado sesión como empleada.")
      } else {
        showNotify("Credenciales incorrectas. Inténtalo de nuevo.")
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  // Funciones para vacaciones
  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const getCurrentUserBalance = () => {
    return user
      ? vacationBalances[user.email] || { available: 25, used: 0, total: 25 }
      : { available: 0, used: 0, total: 0 }
  }

  const getCurrentUserRequests = () => {
    return user ? vacationRequests.filter((request) => request.employeeEmail === user.email) : []
  }

  const getCurrentUserDocuments = () => {
    return user ? documents.filter((doc) => doc.employeeEmail === user.email) : []
  }

  const handleSubmitVacationRequest = () => {
    if (!newVacationRequest.startDate || !newVacationRequest.endDate || !newVacationRequest.reason || !user) {
      showNotify("Por favor completa todos los campos")
      return
    }

    const days = calculateDays(newVacationRequest.startDate, newVacationRequest.endDate)
    const currentBalance = getCurrentUserBalance()

    if (days > currentBalance.available) {
      showNotify(
        `No tienes suficientes días disponibles. Días solicitados: ${days}, Disponibles: ${currentBalance.available}`,
      )
      return
    }

    const newRequest: VacationRequest = {
      id: vacationRequests.length + 1,
      startDate: newVacationRequest.startDate,
      endDate: newVacationRequest.endDate,
      days: days,
      status: "pendiente",
      reason: newVacationRequest.reason,
      employeeName: user.name,
      employeeEmail: user.email,
    }

    setVacationRequests([...vacationRequests, newRequest])
    setNewVacationRequest({ startDate: "", endDate: "", reason: "" })
    showNotify("Solicitud de vacaciones enviada exitosamente")
  }

  const handleDeleteVacationRequest = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta solicitud?")) {
      setVacationRequests(vacationRequests.filter((request) => request.id !== id))
      showNotify("Solicitud eliminada exitosamente")
    }
  }

  const handleApproveVacationRequest = (id: number, approved: boolean, comment?: string) => {
    const request = vacationRequests.find((r) => r.id === id)

    setVacationRequests(
      vacationRequests.map((request) => {
        if (request.id === id) {
          const updatedRequest = {
            ...request,
            status: approved ? ("aprobado" as const) : ("rechazado" as const),
          }

          // Si se aprueba, actualizar el balance de vacaciones del empleado correspondiente
          if (approved) {
            setVacationBalances((prev) => ({
              ...prev,
              [request.employeeEmail]: {
                ...prev[request.employeeEmail],
                available: prev[request.employeeEmail].available - request.days,
                used: prev[request.employeeEmail].used + request.days,
              },
            }))
          }

          return updatedRequest
        }
        return request
      }),
    )

    const action = approved ? "aprobada" : "rechazada"
    const employeeName = request?.employeeName || ""
    showNotify(`Solicitud de ${employeeName} ${action} exitosamente${comment ? ` con comentario` : ""}`)
  }

  // Funciones para comisiones
  const calculateCommission = () => {
    const sales = Number.parseFloat(commissionData.salesAmount) || 0
    const rate = Number.parseFloat(commissionData.commissionRate) || 0
    const bonus = Number.parseFloat(commissionData.bonusAmount) || 0
    return (sales * rate) / 100 + bonus
  }

  const handleSaveCommissionCalculation = () => {
    if (!commissionData.salesAmount || !commissionData.commissionRate) {
      showNotify("Por favor ingresa el monto de ventas y la tasa de comisión")
      return
    }

    const newRecord: CommissionRecord = {
      id: commissionHistory.length + 1,
      month: new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" }),
      sales: Number.parseFloat(commissionData.salesAmount),
      commission: calculateCommission(),
      rate: Number.parseFloat(commissionData.commissionRate),
    }

    setCommissionHistory([newRecord, ...commissionHistory])
    setCommissionData({ salesAmount: "", commissionRate: "", bonusAmount: "" })
    showNotify("Cálculo de comisión guardado exitosamente")
  }

  // Funciones para firmas
  const handleSaveTypedSignature = () => {
    if (!typedSignature.trim()) {
      showNotify("Por favor ingresa tu firma")
      return
    }

    const newTemplate: SignatureTemplate = {
      id: signatureTemplates.length + 1,
      name: typedSignature,
      style: "Firma escrita",
    }

    setSignatureTemplates([...signatureTemplates, newTemplate])
    setTypedSignature("")
    showNotify("Firma guardada exitosamente")
  }

  const handleDeleteSignatureTemplate = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta plantilla de firma?")) {
      setSignatureTemplates(signatureTemplates.filter((template) => template.id !== id))
      showNotify("Plantilla eliminada exitosamente")
    }
  }

  const handleCreateDocument = () => {
    if (!user) return

    const documentName = prompt("Ingrese el nombre del documento:")
    if (!documentName) return

    const newDocument: Document = {
      id: documents.length + 1,
      name: documentName,
      date: new Date().toISOString().split("T")[0],
      status: "pendiente",
      employeeEmail: user.email,
    }

    setDocuments([...documents, newDocument])
    showNotify("Documento creado exitosamente")
  }

  const handleSignDocument = (id: number) => {
    setDocuments(documents.map((doc) => (doc.id === id ? { ...doc, status: "firmado" as const } : doc)))
    showNotify("Documento firmado exitosamente")
  }

  const handleDownloadDocument = (documentName: string) => {
    showNotify(`Descargando documento: ${documentName}`)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} isLoading={isLoading} />
  }

  const currentBalance = getCurrentUserBalance()
  const userRequests = getCurrentUserRequests()
  const userDocuments = getCurrentUserDocuments()
  const pendingRequests = vacationRequests.filter((request) => request.status === "pendiente")
  const approvedRequests = vacationRequests.filter((request) => request.status === "aprobado")
  const rejectedRequests = vacationRequests.filter((request) => request.status === "rechazado")
  const processedRequests = vacationRequests.filter((request) => request.status !== "pendiente")

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Notificación */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-green-500 p-4 flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{notificationMessage}</p>
            <button
              onClick={() => setShowNotification(false)}
              className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">TicaShop - Panel de Gestión</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sistema integral de recursos humanos</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
              {user?.role === "supervisor" ? (
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <User className="h-4 w-4 text-green-600 dark:text-green-400" />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name}</span>
              <Badge
                variant={user?.role === "supervisor" ? "default" : "secondary"}
                className="ml-1 text-xs capitalize"
              >
                {user?.role}
              </Badge>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Bienvenido, {user?.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{pendingRequests.length} notificaciones</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Días Disponibles</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{currentBalance.available}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">de {currentBalance.total} días</p>
                </div>
                <div className="h-14 w-14 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center">
                  <CalendarDays className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Días Usados</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{currentBalance.used}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">este año</p>
                </div>
                <div className="h-14 w-14 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center">
                  <Clock className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Solicitudes</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{userRequests.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">totales</p>
                </div>
                <div className="h-14 w-14 bg-amber-100 dark:bg-amber-800/30 rounded-full flex items-center justify-center">
                  <FileText className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Comisiones</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">
                    ${commissionHistory.reduce((sum, record) => sum + record.commission, 0).toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">acumuladas</p>
                </div>
                <div className="h-14 w-14 bg-purple-100 dark:bg-purple-800/30 rounded-full flex items-center justify-center">
                  <Award className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="vacations" className="space-y-6">
          <TabsList
            className={`grid w-full ${
              user?.role === "supervisor" ? "grid-cols-4" : "grid-cols-3"
            } bg-gray-100 dark:bg-gray-800 p-1 rounded-xl`}
          >
            <TabsTrigger
              value="vacations"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg"
            >
              <Calendar className="h-4 w-4" />
              Vacaciones
            </TabsTrigger>
            {user?.role === "supervisor" && (
              <TabsTrigger
                value="approvals"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg"
              >
                <Check className="h-4 w-4" />
                Aprobaciones
              </TabsTrigger>
            )}
            <TabsTrigger
              value="commissions"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg"
            >
              <Calculator className="h-4 w-4" />
              Comisiones
            </TabsTrigger>
            <TabsTrigger
              value="signatures"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg"
            >
              <PenTool className="h-4 w-4" />
              Firmas Digitales
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vacations" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Balance de Vacaciones
                  </CardTitle>
                  <CardDescription>Tu balance actual de días de vacaciones</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {currentBalance.available} días
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Días de vacaciones disponibles</p>
                    </div>
                    <div className="h-20 w-20 rounded-full border-8 border-blue-100 dark:border-blue-900/30 flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {Math.round((currentBalance.available / currentBalance.total) * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">Usados este año:</span>
                        <span className="font-medium text-gray-800 dark:text-white">{currentBalance.used} días</span>
                      </div>
                      <Progress value={(currentBalance.used / currentBalance.total) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">Disponibles:</span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {currentBalance.available} días
                        </span>
                      </div>
                      <Progress value={(currentBalance.available / currentBalance.total) * 100} className="h-2" />
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Asignación total:</span>
                        <span className="font-medium text-gray-800 dark:text-white">{currentBalance.total} días</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                    <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
                    Solicitar Nuevas Vacaciones
                  </CardTitle>
                  <CardDescription>Envía una nueva solicitud de vacaciones</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date" className="text-gray-700 dark:text-gray-300">
                        Fecha de Inicio
                      </Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={newVacationRequest.startDate}
                        onChange={(e) => setNewVacationRequest({ ...newVacationRequest, startDate: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date" className="text-gray-700 dark:text-gray-300">
                        Fecha de Fin
                      </Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={newVacationRequest.endDate}
                        onChange={(e) => setNewVacationRequest({ ...newVacationRequest, endDate: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  {newVacationRequest.startDate && newVacationRequest.endDate && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-3 rounded-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm">
                        Días solicitados: {calculateDays(newVacationRequest.startDate, newVacationRequest.endDate)}
                      </span>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="reason" className="text-gray-700 dark:text-gray-300">
                      Motivo
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Motivo de la solicitud de vacaciones"
                      value={newVacationRequest.reason}
                      onChange={(e) => setNewVacationRequest({ ...newVacationRequest, reason: e.target.value })}
                      className="mt-1 resize-none"
                    />
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    onClick={handleSubmitVacationRequest}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Enviar Solicitud
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/40 dark:to-slate-900/40 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                      <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      Mis Solicitudes de Vacaciones
                    </CardTitle>
                    <CardDescription>Ver y gestionar tus solicitudes de vacaciones</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {userRequests.length} solicitudes
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {userRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No hay solicitudes</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-2">
                      No tienes solicitudes de vacaciones. Crea una nueva solicitud para comenzar.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                          <TableHead className="text-gray-600 dark:text-gray-300">Fecha de Inicio</TableHead>
                          <TableHead className="text-gray-600 dark:text-gray-300">Fecha de Fin</TableHead>
                          <TableHead className="text-gray-600 dark:text-gray-300">Días</TableHead>
                          <TableHead className="text-gray-600 dark:text-gray-300">Estado</TableHead>
                          <TableHead className="text-gray-600 dark:text-gray-300">Motivo</TableHead>
                          <TableHead className="text-gray-600 dark:text-gray-300">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userRequests.map((request) => (
                          <TableRow
                            key={request.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <TableCell className="font-medium text-gray-700 dark:text-gray-300">
                              {new Date(request.startDate).toLocaleDateString("es-ES")}
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">
                              {new Date(request.endDate).toLocaleDateString("es-ES")}
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">{request.days}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  request.status === "aprobado"
                                    ? "default"
                                    : request.status === "pendiente"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className="capitalize"
                              >
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate text-gray-700 dark:text-gray-300">
                              {request.reason}
                            </TableCell>
                            <TableCell>
                              {request.status === "pendiente" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteVacationRequest(request.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {user?.role === "supervisor" && (
            <TabsContent value="approvals" className="space-y-6">
              <div className="grid gap-6">
                <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                          <Check className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          Solicitudes Pendientes de Aprobación
                        </CardTitle>
                        <CardDescription>Revisa y aprueba las solicitudes de vacaciones del equipo</CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800"
                      >
                        {pendingRequests.length} pendientes
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {pendingRequests.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="bg-amber-50 dark:bg-amber-900/20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="h-10 w-10 text-amber-500 dark:text-amber-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">¡Todo al día!</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2">
                          No hay solicitudes pendientes de aprobación en este momento.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {pendingRequests.map((request) => (
                          <Card
                            key={request.id}
                            className="border-l-4 border-l-amber-500 dark:border-l-amber-600 overflow-hidden"
                          >
                            <CardContent className="p-0">
                              <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 p-4 border-b border-amber-200 dark:border-amber-800/30">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-white dark:bg-gray-800">
                                      Solicitud #{request.id}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800"
                                    >
                                      {request.days} días
                                    </Badge>
                                  </div>
                                  <Badge variant="secondary" className="capitalize">
                                    {request.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="p-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Empleado</h4>
                                      <p className="text-base font-medium text-gray-800 dark:text-white flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        {request.employeeName}
                                      </p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {request.employeeEmail}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Fechas solicitadas
                                      </h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-1 rounded">
                                          {new Date(request.startDate).toLocaleDateString("es-ES")}
                                        </div>
                                        <span className="text-gray-400">hasta</span>
                                        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-1 rounded">
                                          {new Date(request.endDate).toLocaleDateString("es-ES")}
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Motivo</h4>
                                      <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mt-1 border border-gray-100 dark:border-gray-700">
                                        {request.reason}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <Label
                                        htmlFor={`comment-${request.id}`}
                                        className="text-gray-700 dark:text-gray-300"
                                      >
                                        Comentario (opcional)
                                      </Label>
                                      <Textarea
                                        id={`comment-${request.id}`}
                                        placeholder="Agregar comentario sobre la decisión..."
                                        className="mt-1 resize-none h-32"
                                      />
                                    </div>
                                    <div className="flex gap-3">
                                      <Button
                                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                        onClick={() => {
                                          const comment = (
                                            document.getElementById(`comment-${request.id}`) as HTMLTextAreaElement
                                          )?.value
                                          handleApproveVacationRequest(request.id, true, comment)
                                        }}
                                      >
                                        <Check className="h-4 w-4 mr-2" />
                                        Aprobar
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                                        onClick={() => {
                                          const comment = (
                                            document.getElementById(`comment-${request.id}`) as HTMLTextAreaElement
                                          )?.value
                                          handleApproveVacationRequest(request.id, false, comment)
                                        }}
                                      >
                                        <X className="h-4 w-4 mr-2" />
                                        Rechazar
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/40 dark:to-slate-900/40 border-b border-gray-200 dark:border-gray-700">
                    <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                      <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      Historial de Aprobaciones
                    </CardTitle>
                    <CardDescription>Solicitudes procesadas recientemente</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {processedRequests.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Sin historial</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-2">
                          No hay solicitudes procesadas. Cuando apruebes o rechaces solicitudes, aparecerán aquí.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                              <TableHead className="text-gray-600 dark:text-gray-300">Solicitud</TableHead>
                              <TableHead className="text-gray-600 dark:text-gray-300">Empleado</TableHead>
                              <TableHead className="text-gray-600 dark:text-gray-300">Fechas</TableHead>
                              <TableHead className="text-gray-600 dark:text-gray-300">Días</TableHead>
                              <TableHead className="text-gray-600 dark:text-gray-300">Estado</TableHead>
                              <TableHead className="text-gray-600 dark:text-gray-300">Fecha de Decisión</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {processedRequests.map((request) => (
                              <TableRow
                                key={request.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                              >
                                <TableCell className="font-medium text-gray-700 dark:text-gray-300">
                                  #{request.id}
                                </TableCell>
                                <TableCell className="text-gray-700 dark:text-gray-300">
                                  {request.employeeName}
                                </TableCell>
                                <TableCell className="text-gray-700 dark:text-gray-300">
                                  {new Date(request.startDate).toLocaleDateString("es-ES")} -{" "}
                                  {new Date(request.endDate).toLocaleDateString("es-ES")}
                                </TableCell>
                                <TableCell className="text-gray-700 dark:text-gray-300">{request.days}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={request.status === "aprobado" ? "default" : "destructive"}
                                    className="capitalize"
                                  >
                                    {request.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-gray-700 dark:text-gray-300">
                                  {new Date().toLocaleDateString("es-ES")}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border-b border-gray-200 dark:border-gray-700 pb-2">
                      <CardTitle className="text-lg text-gray-800 dark:text-white">Pendientes</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {pendingRequests.length}
                        </div>
                        <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <Progress
                        value={
                          vacationRequests.length > 0 ? (pendingRequests.length / vacationRequests.length) * 100 : 0
                        }
                        className="h-1.5 mt-4"
                      />
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border-b border-gray-200 dark:border-gray-700 pb-2">
                      <CardTitle className="text-lg text-gray-800 dark:text-white">Aprobadas</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {approvedRequests.length}
                        </div>
                        <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <Progress
                        value={
                          vacationRequests.length > 0 ? (approvedRequests.length / vacationRequests.length) * 100 : 0
                        }
                        className="h-1.5 mt-4 bg-gray-100 dark:bg-gray-700"
                      />
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
                    <CardHeader className="bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 border-b border-gray-200 dark:border-gray-700 pb-2">
                      <CardTitle className="text-lg text-gray-800 dark:text-white">Rechazadas</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                          {rejectedRequests.length}
                        </div>
                        <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                          <X className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                      <Progress
                        value={
                          vacationRequests.length > 0 ? (rejectedRequests.length / vacationRequests.length) * 100 : 0
                        }
                        className="h-1.5 mt-4 bg-gray-100 dark:bg-gray-700"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}

          <TabsContent value="commissions" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                    <Calculator className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Calculadora de Comisiones
                  </CardTitle>
                  <CardDescription>Calcula tu comisión basada en el rendimiento de ventas</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="sales-amount" className="text-gray-700 dark:text-gray-300">
                      Monto de Ventas ($)
                    </Label>
                    <Input
                      id="sales-amount"
                      type="number"
                      placeholder="Ingresa el monto total de ventas"
                      value={commissionData.salesAmount}
                      onChange={(e) => setCommissionData({ ...commissionData, salesAmount: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="commission-rate" className="text-gray-700 dark:text-gray-300">
                      Tasa de Comisión (%)
                    </Label>
                    <Input
                      id="commission-rate"
                      type="number"
                      placeholder="Ingresa la tasa de comisión"
                      value={commissionData.commissionRate}
                      onChange={(e) => setCommissionData({ ...commissionData, commissionRate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bonus-amount" className="text-gray-700 dark:text-gray-300">
                      Monto de Bonificación ($)
                    </Label>
                    <Input
                      id="bonus-amount"
                      type="number"
                      placeholder="Ingresa el monto de bonificación"
                      value={commissionData.bonusAmount}
                      onChange={(e) => setCommissionData({ ...commissionData, bonusAmount: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      ${calculateCommission().toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Comisión Total</p>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                    onClick={handleSaveCommissionCalculation}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Guardar Cálculo
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                        <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        Historial de Comisiones
                      </CardTitle>
                      <CardDescription>Tus ganancias por comisiones a lo largo del tiempo</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800"
                    >
                      {commissionHistory.length} registros
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {commissionHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                      <Calculator className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Sin historial</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-2">
                        No hay registros de comisiones. Usa la calculadora para calcular y guardar tus comisiones.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {commissionHistory.map((record) => (
                        <div
                          key={record.id}
                          className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">{record.month}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                              >
                                Ventas: ${record.sales.toLocaleString()}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                              >
                                Tasa: {record.rate}%
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                              ${record.commission.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Comisión</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="signatures" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                    <PenTool className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    Crear Firma Digital
                  </CardTitle>
                  <CardDescription>Dibuja o escribe tu firma para documentos</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-800/50">
                    <PenTool className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Dibuja tu firma aquí</p>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Borrar
                      </Button>
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                        Guardar Firma
                      </Button>
                    </div>
                  </div>
                  <Separator className="my-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2">O</span>
                  </Separator>
                  <div className="space-y-2">
                    <Label htmlFor="typed-signature" className="text-gray-700 dark:text-gray-300">
                      Escribe tu firma
                    </Label>
                    <Input
                      id="typed-signature"
                      placeholder="Escribe tu nombre completo"
                      className="font-script text-lg"
                      value={typedSignature}
                      onChange={(e) => setTypedSignature(e.target.value)}
                    />
                    <Button
                      className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
                      onClick={handleSaveTypedSignature}
                    >
                      Guardar Firma Escrita
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                        <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        Mis Documentos Firmados
                      </CardTitle>
                      <CardDescription>Gestiona tus documentos y firmas digitales</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCreateDocument}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Documento
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {userDocuments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Sin documentos</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-2">
                        No tienes documentos. Crea uno nuevo para comenzar.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                            <TableHead className="text-gray-600 dark:text-gray-300">Nombre</TableHead>
                            <TableHead className="text-gray-600 dark:text-gray-300">Fecha</TableHead>
                            <TableHead className="text-gray-600 dark:text-gray-300">Estado</TableHead>
                            <TableHead className="text-gray-600 dark:text-gray-300">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userDocuments.map((doc) => (
                            <TableRow
                              key={doc.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              <TableCell className="font-medium text-gray-700 dark:text-gray-300">{doc.name}</TableCell>
                              <TableCell className="text-gray-700 dark:text-gray-300">
                                {new Date(doc.date).toLocaleDateString("es-ES")}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={doc.status === "firmado" ? "default" : "secondary"}
                                  className="capitalize"
                                >
                                  {doc.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  {doc.status === "pendiente" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleSignDocument(doc.id)}
                                      className="text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                    >
                                      <PenTool className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDownloadDocument(doc.name)}
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Assistant - disponible para todos los usuarios */}
      <AIAssistant />
    </div>
  )
}
