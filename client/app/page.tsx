import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to EdTech Platform</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Learn with AI-powered video lessons and interactive voice labs
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-background rounded-lg p-8 shadow-lg border text-center">
            <h2 className="text-2xl font-semibold mb-4">Start Learning Today</h2>
            <p className="text-muted-foreground mb-6">
              Access video lessons, practice with AI voice labs, and join video chat sessions. Recharge tokens to unlock
              premium features.
            </p>
            <Link
              href="/login"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
