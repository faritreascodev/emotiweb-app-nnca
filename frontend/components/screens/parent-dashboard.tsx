"use client"

import { useGame, EMOTIONS } from '@/lib/game-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Star, Target, Heart, RefreshCw } from 'lucide-react'

export function ParentDashboard() {
  const { progress, setCurrentScreen, resetProgress, playSound } = useGame()

  const handleBack = () => {
    playSound('click')
    setCurrentScreen('home')
  }

  const handleReset = () => {
    if (window.confirm('Seguro que deseas reiniciar el progreso? Esta accion no se puede deshacer.')) {
      resetProgress()
    }
  }

  const emotionsLearnedCount = progress.emotionsLearned.length
  const totalEmotions = EMOTIONS.length
  const progressPercent = totalEmotions > 0 ? Math.round((emotionsLearnedCount / totalEmotions) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 md:p-6 bg-card shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="w-12 h-12 rounded-full"
          aria-label="Volver"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">Panel para Padres</h1>
          <p className="text-sm text-muted-foreground">Seguimiento del progreso</p>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-4xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-accent" />
              <div className="text-3xl font-bold text-card-foreground">{progress.totalStars}</div>
              <div className="text-sm text-muted-foreground">Estrellas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold text-card-foreground">{progress.gamesPlayed}</div>
              <div className="text-sm text-muted-foreground">Juegos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-secondary" />
              <div className="text-3xl font-bold text-card-foreground">{progress.correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Aciertos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 text-2xl">🎯</div>
              <div className="text-3xl font-bold text-card-foreground">{progressPercent}%</div>
              <div className="text-sm text-muted-foreground">Progreso</div>
            </CardContent>
          </Card>
        </div>

        {/* Emotions Learned */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Emociones Aprendidas</CardTitle>
            <CardDescription>
              {emotionsLearnedCount} de {totalEmotions} emociones identificadas correctamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {EMOTIONS.map((emotion) => {
                const isLearned = progress.emotionsLearned.includes(emotion.id)
                return (
                  <div
                    key={emotion.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      isLearned
                        ? 'opacity-100'
                        : 'opacity-40 grayscale'
                    }`}
                    style={{ backgroundColor: emotion.color }}
                  >
                    <span className="text-2xl">{emotion.emoji}</span>
                    <span className="font-semibold text-card-foreground">{emotion.nameEs}</span>
                    {isLearned && <span className="text-green-700">✓</span>}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Educational Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Objetivos Pedagogicos</CardTitle>
            <CardDescription>
              Informacion para padres y educadores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-card-foreground">
            <div>
              <h4 className="font-semibold mb-2">Por que es importante la educacion emocional temprana?</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                El reconocimiento de emociones entre los 3-4 anos es fundamental para el desarrollo socioemocional. 
                Los ninos que aprenden a identificar emociones desarrollan mejor empatia, autorregulacion y 
                habilidades sociales que los acompanaran toda la vida.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Como usar esta aplicacion</h4>
              <ul className="text-muted-foreground text-sm space-y-1 list-disc list-inside">
                <li>Sesiones cortas de 10-15 minutos</li>
                <li>Acompane al nino durante el juego</li>
                <li>Dialogue sobre las emociones que aparecen</li>
                <li>Celebre los logros, sin presionar por errores</li>
                <li>Relacione los juegos con situaciones reales</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Las 5 emociones basicas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>😊</span>
                  <span><strong>Alegria:</strong> Sentirse contento y feliz</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>😢</span>
                  <span><strong>Tristeza:</strong> Sentirse triste o desanimado</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>😠</span>
                  <span><strong>Enojo:</strong> Sentirse molesto o frustrado</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>😨</span>
                  <span><strong>Miedo:</strong> Sentirse asustado o preocupado</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>😲</span>
                  <span><strong>Sorpresa:</strong> Sentirse asombrado por algo inesperado</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button onClick={handleBack} className="bg-primary text-primary-foreground">
              Volver a Jugar
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="text-destructive border-destructive hover:bg-destructive/10 bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reiniciar Progreso
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
