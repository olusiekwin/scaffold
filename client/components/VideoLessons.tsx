"use client"

import { useState } from "react"

interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
  category: string
}

const sampleLessons: Lesson[] = [
  {
    id: "1",
    title: "Introduction to Mathematics",
    description: "Learn the fundamentals of mathematics with interactive examples",
    duration: "15 min",
    thumbnail: "/mathematics-lesson.jpg",
    category: "Mathematics",
  },
  {
    id: "2",
    title: "English Grammar Basics",
    description: "Master the essential rules of English grammar",
    duration: "20 min",
    thumbnail: "/english-grammar-lesson.jpg",
    category: "English",
  },
  {
    id: "3",
    title: "Science Experiments",
    description: "Explore fascinating science concepts through experiments",
    duration: "25 min",
    thumbnail: "/science-experiment-lesson.jpg",
    category: "Science",
  },
  {
    id: "4",
    title: "History of Ancient Civilizations",
    description: "Journey through time to learn about ancient cultures",
    duration: "30 min",
    thumbnail: "/ancient-history-lesson.jpg",
    category: "History",
  },
]

export default function VideoLessons() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setIsPlaying(true)
  }

  const handleClosePlayer = () => {
    setSelectedLesson(null)
    setIsPlaying(false)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Video Lessons</h2>
        <p className="text-muted-foreground">Access our comprehensive library of educational videos</p>
      </div>

      {/* Video Player Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">{selectedLesson.title}</h3>
              <button
                onClick={handleClosePlayer}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video bg-black flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                </div>
                <p className="text-lg font-medium">Video Player Placeholder</p>
                <p className="text-sm opacity-80 mt-2">Duration: {selectedLesson.duration}</p>
              </div>
            </div>

            <div className="p-4">
              <p className="text-muted-foreground">{selectedLesson.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Lessons Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={lesson.thumbnail || "/placeholder.svg"}
                alt={lesson.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handlePlayLesson(lesson)}
                  className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <div className="w-0 h-0 border-l-[8px] border-l-black border-y-[6px] border-y-transparent ml-1"></div>
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                {lesson.category}
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {lesson.duration}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-card-foreground mb-2">{lesson.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>
              <button
                onClick={() => handlePlayLesson(lesson)}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Watch Lesson
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
