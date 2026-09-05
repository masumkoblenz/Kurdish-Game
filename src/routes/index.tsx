import { createFileRoute } from '@tanstack/react-router'
import KurdishQuiz from '../components/KurdishQuiz'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <KurdishQuiz />
}
