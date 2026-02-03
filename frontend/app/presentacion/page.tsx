"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Home,
  BookOpen,
  Code2,
  Users,
  Lightbulb,
  CheckCircle,
  Monitor,
  Heart,
  Brain,
  Gamepad2,
  Shield,
  Sparkles,
  Database,
} from "lucide-react";
import Link from "next/link";

const slides = [
  {
    id: "intro",
    title: "Introduccion",
    icon: BookOpen,
  },
  {
    id: "proposito",
    title: "Proposito y Enfoque",
    icon: Heart,
  },
  {
    id: "tecnologias",
    title: "Tecnologias",
    icon: Code2,
  },
  {
    id: "publico",
    title: "Publico Objetivo",
    icon: Users,
  },
  {
    id: "justificacion",
    title: "Justificacion",
    icon: Lightbulb,
  },
  {
    id: "conclusiones",
    title: "Conclusiones",
    icon: CheckCircle,
  },
  {
    id: "demo",
    title: "Demo",
    icon: Monitor,
  },
];

function IntroSlide() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight text-balance">
          Desarrollo de una Plataforma Web Interactiva Basada en Minijuegos para
          la Exploracion y Reconocimiento Emocional Temprano
        </h1>
        <p className="text-xl text-muted-foreground">
          Ninos de 3 a 5 anos
        </p>
        <div className="inline-block px-6 py-2 bg-[#4ECDC4] text-white rounded-full text-2xl font-bold mt-4">
          EmotiWeb
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card className="bg-[#FFE5B4]/50 border-[#FFD6A5]">
          <CardContent className="pt-6 text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-[#FFD93D] rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-foreground" />
            </div>
            <h3 className="font-bold text-lg">Educacion Emocional</h3>
            <p className="text-sm text-muted-foreground">
              Reconocimiento de emociones basicas desde temprana edad
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#E8F8F5]/50 border-[#4ECDC4]/30">
          <CardContent className="pt-6 text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-[#4ECDC4] rounded-full flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg">Aprendizaje Ludico</h3>
            <p className="text-sm text-muted-foreground">
              Minijuegos disenados para el desarrollo cognitivo infantil
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#FFE5E5]/50 border-[#FF6B6B]/30">
          <CardContent className="pt-6 text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-[#FF6B6B] rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg">Entorno Seguro</h3>
            <p className="text-sm text-muted-foreground">
              Sin publicidad, accesible y adaptado a la edad
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8 p-6 bg-muted/50 rounded-2xl">
        <p className="text-lg font-medium">
          Una propuesta creativa, funcional y educativa alineada con principios
          de aprendizaje ludico y desarrollo infantil temprano
        </p>
      </div>
    </div>
  );
}

function PropositoSlide() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center">Proposito y Enfoque</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-l-4 border-l-[#4ECDC4]">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#4ECDC4]" />
                Que es EmotiWeb?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Crearemos una plataforma web interactiva pensada para los mas pequenos, 
                de <strong>3 a 5 anos</strong>. A traves de juegos sencillos y visuales, 
                les ayudamos a reconocer y explorar emociones basicas como la alegria, 
                la tristeza, el enojo y el miedo.
              </p>
              <p className="text-lg font-semibold text-[#4ECDC4] mt-4">
                Queremos que aprendan jugando.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#FF6B6B] bg-[#FF6B6B]/5">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#FF6B6B]" />
                Importante Aclarar
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Es fundamental entender que <strong>EmotiWeb no es una herramienta 
                terapeutica ni evaluativa</strong>. Nuestro fin es apoyar el desarrollo 
                emocional temprano de forma ludica, segura y comprensible.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#FFD93D]">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-3">Emociones que Exploramos</h3>
              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  { name: "Alegria", color: "#FFD93D" },
                  { name: "Tristeza", color: "#6B9FFF" },
                  { name: "Enojo", color: "#FF6B6B" },
                  { name: "Miedo", color: "#A78BFA" },
                ].map((emotion) => (
                  <span
                    key={emotion.name}
                    className="px-4 py-2 rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: `${emotion.color}30`,
                      color: emotion.color,
                      border: `2px solid ${emotion.color}`,
                    }}
                  >
                    {emotion.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#E8F8F5] to-[#4ECDC4]/20 border-[#4ECDC4]/30">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-4 text-center">Nuestra Mision</h3>
              <p className="text-center text-lg leading-relaxed">
                Facilitamos el aprendizaje emocional desde las primeras etapas de la vida, 
                <strong className="text-[#4ECDC4]"> sentando bases solidas para su bienestar</strong>.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#4ECDC4]">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-3">Objetivos Pedagogicos</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#4ECDC4] mt-0.5 shrink-0" />
                  Desarrollar inteligencia emocional desde edades tempranas
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#4ECDC4] mt-0.5 shrink-0" />
                  Fomentar la empatia y comprension de emociones propias y ajenas
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#4ECDC4] mt-0.5 shrink-0" />
                  Asociar expresiones faciales con estados emocionales
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#4ECDC4] mt-0.5 shrink-0" />
                  Vincular emociones con situaciones cotidianas
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#FFE5B4] to-[#FFD6A5] border-none">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-3">Enfoque Gamificado</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <Sparkles className="w-6 h-6 text-[#FFD93D]" />
                  <span>Personajes amigables y coloridos</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <Sparkles className="w-6 h-6 text-[#FF6B6B]" />
                  <span>Animaciones suaves y llamativas</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <Sparkles className="w-6 h-6 text-[#4ECDC4]" />
                  <span>Retroalimentacion positiva constante</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <Sparkles className="w-6 h-6 text-[#A78BFA]" />
                  <span>Recompensas visuales (estrellas, stickers)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TecnologiasSlide() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center">
        Tecnologias de Desarrollo
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Code2 className="w-6 h-6 text-[#4ECDC4]" />
            Stack Tecnologico Frontend
          </h3>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#61DAFB]/10 rounded-lg border border-[#61DAFB]/30">
                <div className="w-12 h-12 bg-[#61DAFB] rounded-lg flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <h4 className="font-bold">React / Next.js</h4>
                  <p className="text-sm text-muted-foreground">
                    Componentes interactivos y reutilizables
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#38BDF8]/10 rounded-lg border border-[#38BDF8]/30">
                <div className="w-12 h-12 bg-[#38BDF8] rounded-lg flex items-center justify-center text-white font-bold">
                  T
                </div>
                <div>
                  <h4 className="font-bold">Tailwind CSS</h4>
                  <p className="text-sm text-muted-foreground">
                    Diseno responsivo y estilizado moderno
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#3178C6]/10 rounded-lg border border-[#3178C6]/30">
                <div className="w-12 h-12 bg-[#3178C6] rounded-lg flex items-center justify-center text-white font-bold">
                  TS
                </div>
                <div>
                  <h4 className="font-bold">TypeScript</h4>
                  <p className="text-sm text-muted-foreground">
                    Codigo tipado y mantenible
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#FF6B6B]/10 rounded-lg border border-[#FF6B6B]/30">
                <div className="w-12 h-12 bg-[#FF6B6B] rounded-lg flex items-center justify-center text-white font-bold">
                  WA
                </div>
                <div>
                  <h4 className="font-bold">Web Audio API</h4>
                  <p className="text-sm text-muted-foreground">
                    Sonidos y retroalimentacion auditiva
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6 text-[#00758F]" />
            Stack Tecnologico Backend
          </h3>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#00758F]/10 rounded-lg border border-[#00758F]/30">
                <div className="w-12 h-12 bg-[#00758F] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                  MySQL
                </div>
                <div>
                  <h4 className="font-bold">MySQL</h4>
                  <p className="text-sm text-muted-foreground">
                    Base de datos relacional para almacenar progreso, usuarios y metricas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#68A063]/10 rounded-lg border border-[#68A063]/30">
                <div className="w-12 h-12 bg-[#68A063] rounded-lg flex items-center justify-center text-white font-bold">
                  N
                </div>
                <div>
                  <h4 className="font-bold">Node.js (API Routes)</h4>
                  <p className="text-sm text-muted-foreground">
                    Endpoints para gestion de datos y autenticacion
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#FFD93D]" />
            Caracteristicas Tecnicas
          </h3>

          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#4ECDC4] mt-1 shrink-0" />
                  <div>
                    <span className="font-medium">Componentes Reutilizables</span>
                    <p className="text-sm text-muted-foreground">
                      Arquitectura modular para facil mantenimiento
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#4ECDC4] mt-1 shrink-0" />
                  <div>
                    <span className="font-medium">Diseno Responsivo</span>
                    <p className="text-sm text-muted-foreground">
                      Adaptable a tablets y computadoras
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#4ECDC4] mt-1 shrink-0" />
                  <div>
                    <span className="font-medium">Persistencia con MySQL</span>
                    <p className="text-sm text-muted-foreground">
                      Almacenamiento seguro de progreso y estadisticas
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}

function PublicoSlide() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center" style={{ fontFamily: "'Comic Sans MS', cursive" }}>
        PUBLICO OBJETIVO
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Usuarios Finales */}
        <Card className="overflow-hidden border-2 border-[#FFD6A5]">
          <CardContent className="pt-6">
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-[#F5F5F5] flex items-center justify-center">
              <div className="w-32 h-32 bg-[#FF9F43]/20 rounded-full flex items-center justify-center">
                <Users className="w-16 h-16 text-[#FF9F43]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-[#FF9F43] mb-3">
              Usuarios Finales
            </h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              Los ninos pequenos son nuestros usuarios principales. Padres y educadores 
              infantiles son acompanantes, utilizando la plataforma como una herramienta 
              educativa complementaria en casa y en el aula.
            </p>
          </CardContent>
        </Card>

        {/* Educadores */}
        <Card className="overflow-hidden border-2 border-[#4ECDC4]/50">
          <CardContent className="pt-6">
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-[#F5F5F5] flex items-center justify-center">
              <div className="w-32 h-32 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center">
                <Users className="w-16 h-16 text-[#4ECDC4]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-[#4ECDC4] mb-3">
              Educadores de Infantil
            </h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              Para ellos, EmotiWeb es un recurso valioso para integrar la educacion 
              emocional en su curriculo diario, de forma sencilla y atractiva.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-bold text-lg mb-4 text-center">
            Adaptaciones para el Publico Objetivo
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-card rounded-xl">
              <div className="w-12 h-12 mx-auto bg-[#FF6B6B] rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-xs font-bold">64px</span>
              </div>
              <p className="text-sm font-medium">Botones grandes</p>
              <p className="text-xs text-muted-foreground">Facil de tocar</p>
            </div>
            <div className="text-center p-4 bg-card rounded-xl">
              <div className="w-12 h-12 mx-auto bg-[#FFD93D] rounded-full flex items-center justify-center mb-2">
                <span className="text-foreground text-lg">Aa</span>
              </div>
              <p className="text-sm font-medium">Texto simple</p>
              <p className="text-xs text-muted-foreground">Instrucciones claras</p>
            </div>
            <div className="text-center p-4 bg-card rounded-xl">
              <div className="w-12 h-12 mx-auto bg-[#4ECDC4] rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-lg">5m</span>
              </div>
              <p className="text-sm font-medium">Juegos cortos</p>
              <p className="text-xs text-muted-foreground">Atencion limitada</p>
            </div>
            <div className="text-center p-4 bg-card rounded-xl">
              <div className="w-12 h-12 mx-auto bg-[#A78BFA] rounded-full flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium">Recompensas</p>
              <p className="text-xs text-muted-foreground">Motivacion visual</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function JustificacionSlide() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center">Justificacion</h2>

      {/* Central Diagram - Sembrando Emociones */}
      <div className="relative max-w-4xl mx-auto">
        {/* Center */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#FFE5B4] rounded-2xl p-6 text-center max-w-xs shadow-lg border-2 border-[#FFD6A5]">
            <h3 className="text-xl md:text-2xl font-extrabold text-foreground leading-tight">
              SEMBRANDO EMOCIONES, COSECHANDO FUTURO
            </h3>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Fomenta Educacion Emocional */}
          <Card className="bg-[#FFD93D]/20 border-[#FFD93D] border-2">
            <CardContent className="pt-4">
              <h4 className="font-bold text-[#B8860B] mb-2">
                Fomenta la Educacion Emocional Temprana
              </h4>
              <p className="text-sm text-muted-foreground">
                Ayudamos a construir una base solida para el bienestar emocional desde pequenos.
              </p>
            </CardContent>
          </Card>

          {/* Potencia Desarrollo Cognitivo */}
          <Card className="bg-[#FFDAB9]/30 border-[#FF9F43] border-2">
            <CardContent className="pt-4">
              <h4 className="font-bold text-[#FF9F43] mb-2">
                Potencia el Desarrollo Cognitivo
              </h4>
              <p className="text-sm text-muted-foreground">
                El juego interactivo estimula la mente y la creatividad.
              </p>
            </CardContent>
          </Card>

          {/* Crea Espacio Seguro */}
          <Card className="bg-[#4ECDC4]/15 border-[#4ECDC4] border-2">
            <CardContent className="pt-4">
              <h4 className="font-bold text-[#4ECDC4] mb-2">
                Crea un Espacio Seguro y Ludico
              </h4>
              <p className="text-sm text-muted-foreground">
                Donde los ninos pueden explorar sus sentimientos sin juicios.
              </p>
            </CardContent>
          </Card>

          {/* Mejora Interaccion */}
          <Card className="bg-[#6B9FFF]/15 border-[#6B9FFF] border-2">
            <CardContent className="pt-4">
              <h4 className="font-bold text-[#6B9FFF] mb-2">
                Mejora la Interaccion Nino-Adulto
              </h4>
              <p className="text-sm text-muted-foreground">
                Crea momentos de conexion y dialogo sobre los sentimientos.
              </p>
            </CardContent>
          </Card>

          {/* Inspira Innovacion */}
          <Card className="bg-[#A78BFA]/15 border-[#A78BFA] border-2">
            <CardContent className="pt-4">
              <h4 className="font-bold text-[#A78BFA] mb-2">
                Inspira Innovacion Educativa
              </h4>
              <p className="text-sm text-muted-foreground">
                El juego interactivo estimula la mente y la creatividad.
              </p>
            </CardContent>
          </Card>

          {/* Accesibilidad */}
          <Card className="bg-[#FF6B6B]/15 border-[#FF6B6B] border-2">
            <CardContent className="pt-4">
              <h4 className="font-bold text-[#FF6B6B] mb-2">
                Accesible y Sin Barreras
              </h4>
              <p className="text-sm text-muted-foreground">
                Disenado para ser usado facilmente por ninos y adultos sin conocimientos tecnicos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-[#4ECDC4]/20 to-[#FFD93D]/20 border-none">
        <CardContent className="pt-6">
          <p className="text-center text-lg font-medium">
            EmotiWeb responde a la necesidad de herramientas educativas digitales que 
            apoyen el desarrollo emocional desde las primeras etapas de la vida, 
            <strong className="text-[#4ECDC4]"> sentando bases solidas para el bienestar futuro</strong>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ConclusionesSlide() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center">Conclusiones</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-l-4 border-l-[#4ECDC4]">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-3">Logros del Proyecto</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#4ECDC4] mt-0.5 shrink-0" />
                  <span>
                    Plataforma funcional con 4 minijuegos educativos interactivos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#4ECDC4] mt-0.5 shrink-0" />
                  <span>
                    Interfaz intuitiva adaptada a ninos de 3-5 anos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#4ECDC4] mt-0.5 shrink-0" />
                  <span>
                    Sistema de recompensas y seguimiento de progreso con MySQL
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#4ECDC4] mt-0.5 shrink-0" />
                  <span>
                    Panel para padres/educadores con metricas detalladas
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#FFD93D]">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-3">Valor Educativo</h3>
              <p className="text-muted-foreground mb-4">
                EmotiWeb demuestra que la tecnologia puede ser una aliada en el 
                desarrollo emocional infantil, ofreciendo:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFD93D] mt-1 shrink-0" />
                  Aprendizaje ludico sin presion evaluativa
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFD93D] mt-1 shrink-0" />
                  Entorno seguro y controlado para explorar emociones
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFD93D] mt-1 shrink-0" />
                  Herramienta complementaria para padres y educadores
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-l-4 border-l-[#A78BFA]">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-3">Trabajo Futuro</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#A78BFA]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#A78BFA] font-bold text-sm">1</span>
                  </div>
                  <span>Expansion de minijuegos con nuevas mecanicas</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#A78BFA]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#A78BFA] font-bold text-sm">2</span>
                  </div>
                  <span>Inclusion de mas emociones complejas</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#A78BFA]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#A78BFA] font-bold text-sm">3</span>
                  </div>
                  <span>Validacion con expertos en psicologia infantil</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#A78BFA]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#A78BFA] font-bold text-sm">4</span>
                  </div>
                  <span>Soporte multilingue para mayor alcance</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#4ECDC4] to-[#45B7AA] text-white">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-3">Mensaje Final</h3>
              <p className="leading-relaxed">
                EmotiWeb representa un paso adelante en la educacion emocional digital 
                para la primera infancia. Al combinar tecnologia moderna con principios 
                pedagogicos solidos, creamos una herramienta que{" "}
                <strong>siembra emociones hoy para cosechar bienestar manana</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DemoSlide() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center">Demostracion</h2>

      <div className="text-center space-y-6">
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-[#FFE5B4] to-[#FFD6A5] border-none">
          <CardContent className="pt-8 pb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-12 h-12 text-[#FF6B6B]" />
            </div>
            <h3 className="text-2xl font-bold mb-4">EmotiWeb en Accion</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Explora la plataforma interactiva y descubre como los ninos aprenden 
              a reconocer emociones a traves de minijuegos divertidos.
            </p>
            <Link href="/">
              <Button 
                size="lg" 
                className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white text-lg px-8 py-6 rounded-2xl shadow-lg"
              >
                <Play className="w-6 h-6 mr-2" />
                Iniciar Demo
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Card className="bg-[#FFD93D]/20 border-[#FFD93D]">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl mb-2">1</div>
              <h4 className="font-bold text-sm">Caras y Emociones</h4>
              <p className="text-xs text-muted-foreground">Asocia expresiones</p>
            </CardContent>
          </Card>
          <Card className="bg-[#6B9FFF]/20 border-[#6B9FFF]">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl mb-2">2</div>
              <h4 className="font-bold text-sm">Como me siento?</h4>
              <p className="text-xs text-muted-foreground">Situaciones cotidianas</p>
            </CardContent>
          </Card>
          <Card className="bg-[#4ECDC4]/20 border-[#4ECDC4]">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl mb-2">3</div>
              <h4 className="font-bold text-sm">Arrastra y Suelta</h4>
              <p className="text-xs text-muted-foreground">Emparejamiento tactil</p>
            </CardContent>
          </Card>
          <Card className="bg-[#A78BFA]/20 border-[#A78BFA]">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl mb-2">4</div>
              <h4 className="font-bold text-sm">Cuentos Magicos</h4>
              <p className="text-xs text-muted-foreground">Historia interactiva</p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <h4 className="font-bold mb-4">Caracteristicas de la Demo</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#4ECDC4]" />
                <span>4 minijuegos funcionales</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#4ECDC4]" />
                <span>Sistema de estrellas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#4ECDC4]" />
                <span>Sonidos interactivos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#4ECDC4]" />
                <span>Panel de padres</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#4ECDC4]" />
                <span>Animaciones suaves</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#4ECDC4]" />
                <span>100% responsivo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PresentacionPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const renderSlide = () => {
    switch (slides[currentSlide].id) {
      case "intro":
        return <IntroSlide />;
      case "proposito":
        return <PropositoSlide />;
      case "tecnologias":
        return <TecnologiasSlide />;
      case "publico":
        return <PublicoSlide />;
      case "justificacion":
        return <JustificacionSlide />;
      case "conclusiones":
        return <ConclusionesSlide />;
      case "demo":
        return <DemoSlide />;
      default:
        return <IntroSlide />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Ir a EmotiWeb</span>
              </Button>
            </Link>

            <div className="flex items-center gap-1 overflow-x-auto">
              {slides.map((slide, index) => {
                const Icon = slide.icon;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(index)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      currentSlide === index
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{slide.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                {currentSlide + 1} / {slides.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-in fade-in duration-300" key={currentSlide}>
          {renderSlide()}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="gap-2 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex gap-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                aria-label={`Ir a diapositiva ${index + 1}`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </footer>

      {/* Bottom padding for footer */}
      <div className="h-20" />
    </div>
  );
}
