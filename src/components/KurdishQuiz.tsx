import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import {
  ArrowLeft,
  Award,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coins,
  Flame,
  Heart,
  Home,
  LibraryBig,
  LockKeyhole,
  RotateCcw,
  Sparkles,
  Trash2,
  Trophy,
  UserRound,
  X,
  Zap,
} from 'lucide-react'
import { categories, getCategory, questions, type CategoryId, type QuizQuestion } from '@/data/questions'
import {
  achievements,
  createPlayer,
  getLevel,
  getNextLevelXp,
  loadPlayer,
  savePlayer,
  unlockAchievements,
  type Achievement,
  type PlayerData,
} from '@/lib/player'

type View = 'home' | 'quiz' | 'result' | 'profile' | 'achievements' | 'saved-words'
type SavedWordsFilter = 'all' | 'open' | 'learned'
type PlayQuestion = QuizQuestion & { options: string[] }
type Result = { score: number; correct: number; wrong: number; coins: number; xp: number; newHighscore: boolean; category: CategoryId }
type RoundStats = { score: number; correct: number; wrong: number; earnedCoins: number; earnedXp: number; bestCombo: number; fastestMark: number }

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)

function buildRound(categoryId: CategoryId, unlocked: CategoryId[]) {
  const allowedCategories = categoryId === 'hemu' ? unlocked.filter((id) => id !== 'hemu') : [categoryId]
  const pool = questions.filter((question) => allowedCategories.includes(question.category))
  const selected: QuizQuestion[] = []
  while (selected.length < 10) selected.push(...shuffle(pool))

  return selected.slice(0, 10).map((question) => {
    const wrongAnswers = shuffle(questions.filter((item) => item.word !== question.word).map((item) => item.word)).slice(0, 3)
    return { ...question, options: shuffle([question.correctAnswer, ...wrongAnswers]) }
  })
}

export default function KurdishQuiz() {
  const [player, setPlayer] = useState<PlayerData | null>(null)
  const [view, setView] = useState<View>('home')
  const [round, setRound] = useState<PlayQuestion[]>([])
  const [categoryId, setCategoryId] = useState<CategoryId>('xwarin')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [seconds, setSeconds] = useState(15)
  const [lives, setLives] = useState(3)
  const [combo, setCombo] = useState(0)
  const [bestRoundCombo, setBestRoundCombo] = useState(0)
  const [score, setScore] = useState(0)
  const [earnedCoins, setEarnedCoins] = useState(0)
  const [earnedXp, setEarnedXp] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [fastestMark, setFastestMark] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answerWasCorrect, setAnswerWasCorrect] = useState<boolean | null>(null)
  const [hiddenAnswers, setHiddenAnswers] = useState<string[]>([])
  const [result, setResult] = useState<Result | null>(null)
  const [toast, setToast] = useState('')
  const [achievementPopup, setAchievementPopup] = useState<Achievement[]>([])
  const [showReset, setShowReset] = useState(false)

  useEffect(() => {
    const loaded = loadPlayer()
    savePlayer(loaded)
    setPlayer(loaded)
  }, [])

  const updatePlayer = useCallback((updater: (current: PlayerData) => PlayerData) => {
    setPlayer((current) => {
      if (!current) return current
      const updated = updater(current)
      savePlayer(updated)
      return updated
    })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const finishGame = useCallback((finalLives = lives, finalStats?: RoundStats) => {
    if (!player) return
    const stats = finalStats ?? { score, correct, wrong, earnedCoins, earnedXp, bestCombo: bestRoundCombo, fastestMark }
    const completionBonus = questionIndex >= 9 && finalLives > 0 ? 5 : 0
    const totalCoins = stats.earnedCoins + completionBonus
    const newHighscore = stats.score > player.bestScore
    const summary = { score: stats.score, correct: stats.correct, wrong: stats.wrong, bestCombo: stats.bestCombo, maxTimeAnswer: stats.fastestMark }
    const basePlayer: PlayerData = {
      ...player,
      coins: player.coins + totalCoins,
      xp: player.xp + stats.earnedXp,
      bestScore: Math.max(player.bestScore, stats.score),
      gamesPlayed: player.gamesPlayed + 1,
      correctAnswers: player.correctAnswers + stats.correct,
      wrongAnswers: player.wrongAnswers + stats.wrong,
      bestCombo: Math.max(player.bestCombo, stats.bestCombo),
    }
    const checked = unlockAchievements(basePlayer, summary)
    savePlayer(checked.player)
    setPlayer(checked.player)
    setAchievementPopup(checked.newlyUnlocked)
    setResult({ score: stats.score, correct: stats.correct, wrong: stats.wrong, coins: totalCoins, xp: stats.earnedXp, newHighscore, category: categoryId })
    setView('result')
  }, [bestRoundCombo, categoryId, correct, earnedCoins, earnedXp, fastestMark, lives, player, questionIndex, score, wrong])

  const answerQuestion = useCallback((answer: string | null) => {
    const question = round[questionIndex]
    if (!question || answerWasCorrect !== null) return
    const isCorrect = answer === question.correctAnswer
    setSelectedAnswer(answer)
    setAnswerWasCorrect(isCorrect)

    let nextLives = lives
    let nextScore = score
    let nextCorrect = correct
    let nextWrong = wrong
    let nextEarnedCoins = earnedCoins
    let nextEarnedXp = earnedXp
    let nextBestCombo = bestRoundCombo
    let nextFastestMark = fastestMark
    if (isCorrect) {
      const nextCombo = combo + 1
      const pointGain = 10 + Math.min(nextCombo * 2, 20) + Math.floor(seconds / 3)
      const coinGain = 2 + Math.floor(nextCombo / 2) + (seconds >= 10 ? 1 : 0)
      const xpGain = 15 + Math.min(nextCombo, 10)
      setCombo(nextCombo)
      setBestRoundCombo((value) => Math.max(value, nextCombo))
      setScore((value) => value + pointGain)
      setEarnedCoins((value) => value + coinGain)
      setEarnedXp((value) => value + xpGain)
      setCorrect((value) => value + 1)
      setFastestMark((value) => Math.max(value, seconds))
      nextScore += pointGain
      nextCorrect += 1
      nextEarnedCoins += coinGain
      nextEarnedXp += xpGain
      nextBestCombo = Math.max(nextBestCombo, nextCombo)
      nextFastestMark = Math.max(nextFastestMark, seconds)
    } else {
      nextLives -= 1
      setLives(nextLives)
      setCombo(0)
      setWrong((value) => value + 1)
      nextWrong += 1
    }
    const finalStats = { score: nextScore, correct: nextCorrect, wrong: nextWrong, earnedCoins: nextEarnedCoins, earnedXp: nextEarnedXp, bestCombo: nextBestCombo, fastestMark: nextFastestMark }
    window.setTimeout(() => {
      if (nextLives <= 0 || questionIndex >= 9) {
        finishGame(nextLives, finalStats)
        return
      }
      setQuestionIndex((value) => value + 1)
      setSeconds(15)
      setSelectedAnswer(null)
      setAnswerWasCorrect(null)
      setHiddenAnswers([])
    }, 850)
  }, [answerWasCorrect, bestRoundCombo, combo, correct, earnedCoins, earnedXp, fastestMark, finishGame, lives, questionIndex, round, score, seconds, wrong])

  useEffect(() => {
    if (view !== 'quiz' || answerWasCorrect !== null) return
    if (seconds <= 0) {
      answerQuestion(null)
      return
    }
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [answerQuestion, answerWasCorrect, seconds, view])

  const startGame = (nextCategory: CategoryId) => {
    if (!player) return
    setCategoryId(nextCategory)
    setRound(buildRound(nextCategory, player.unlockedCategories))
    setQuestionIndex(0)
    setSeconds(15)
    setLives(3)
    setCombo(0)
    setBestRoundCombo(0)
    setScore(0)
    setEarnedCoins(0)
    setEarnedXp(0)
    setCorrect(0)
    setWrong(0)
    setFastestMark(0)
    setSelectedAnswer(null)
    setAnswerWasCorrect(null)
    setHiddenAnswers([])
    setResult(null)
    setView('quiz')
  }

  const unlockCategory = (id: CategoryId, price: number) => {
    if (!player) return
    if (player.coins < price) {
      setToast('Tu Coinên têr nînin.')
      return
    }
    const updated = { ...player, coins: player.coins - price, unlockedCategories: [...player.unlockedCategories, id] }
    const checked = unlockAchievements(updated)
    savePlayer(checked.player)
    setPlayer(checked.player)
    setAchievementPopup(checked.newlyUnlocked)
    setToast('Kategorî hat vekirin!')
  }

  const useFiftyFifty = () => {
    if (!player || answerWasCorrect !== null || hiddenAnswers.length > 0) return
    if (player.coins < 10) return setToast('Tu Coinên têr nînin.')
    const question = round[questionIndex]
    setHiddenAnswers(shuffle(question.options.filter((option) => option !== question.correctAnswer)).slice(0, 2))
    updatePlayer((current) => ({ ...current, coins: current.coins - 10 }))
  }

  const addTime = () => {
    if (!player || answerWasCorrect !== null) return
    if (player.coins < 10) return setToast('Tu Coinên têr nînin.')
    setSeconds((value) => value + 5)
    updatePlayer((current) => ({ ...current, coins: current.coins - 10 }))
  }

  const toggleSavedWord = (questionId: string) => {
    const isSaved = Boolean(player?.savedWords[questionId])
    updatePlayer((current) => {
      const savedWords = { ...current.savedWords }
      if (savedWords[questionId]) delete savedWords[questionId]
      else savedWords[questionId] = { learned: false }
      return { ...current, savedWords }
    })
    setToast(isSaved ? 'Peyv ji lîsteyê hat rakirin.' : 'Peyv hat tomarkirin.')
  }

  const toggleLearnedWord = (questionId: string) => {
    updatePlayer((current) => ({
      ...current,
      savedWords: {
        ...current.savedWords,
        [questionId]: { learned: !current.savedWords[questionId]?.learned },
      },
    }))
  }

  const resetPlayer = () => {
    const freshPlayer = createPlayer()
    savePlayer(freshPlayer)
    setPlayer(freshPlayer)
    setShowReset(false)
    setView('home')
    setToast('Profîla nû amade ye.')
  }

  if (!player) return <LoadingScreen />

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      {view === 'home' && <HomeView player={player} onPlay={startGame} onUnlock={unlockCategory} onNavigate={setView} />}
      {view === 'quiz' && round[questionIndex] && (
        <QuizView
          player={player}
          question={round[questionIndex]}
          questionIndex={questionIndex}
          categoryId={categoryId}
          seconds={seconds}
          lives={lives}
          combo={combo}
          score={score}
          selectedAnswer={selectedAnswer}
          answerWasCorrect={answerWasCorrect}
          hiddenAnswers={hiddenAnswers}
          isSaved={Boolean(player.savedWords[round[questionIndex].id])}
          onAnswer={answerQuestion}
          onFifty={useFiftyFifty}
          onTime={addTime}
          onToggleSaved={() => toggleSavedWord(round[questionIndex].id)}
          onExit={() => setView('home')}
        />
      )}
      {view === 'result' && result && (
        <ResultView result={result} onAgain={() => startGame(result.category)} onHome={() => setView('home')} />
      )}
      {view === 'profile' && <ProfileView player={player} onBack={() => setView('home')} onReset={() => setShowReset(true)} />}
      {view === 'achievements' && <AchievementsView player={player} onBack={() => setView('home')} />}
      {view === 'saved-words' && (
        <SavedWordsView
          player={player}
          onBack={() => setView('home')}
          onRemove={toggleSavedWord}
          onToggleLearned={toggleLearnedWord}
        />
      )}

      {toast && <div className="toast"><Sparkles size={18} />{toast}</div>}
      {achievementPopup.length > 0 && (
        <div className="modal-backdrop" role="presentation" onClick={() => setAchievementPopup([])}>
          <div className="achievement-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="achievement-burst"><Award size={34} /></div>
            <p className="overline">Serkeftina nû</p>
            <h2>{achievementPopup.map((item) => item.title).join(' · ')}</h2>
            <p>Te xelatên nû stendin: +{achievementPopup.reduce((sum, item) => sum + item.reward, 0)} Coin</p>
            <button className="primary-button" onClick={() => setAchievementPopup([])}>Pir baş!</button>
          </div>
        </div>
      )}
      {showReset && (
        <div className="modal-backdrop">
          <div className="achievement-modal" role="alertdialog" aria-modal="true">
            <div className="achievement-burst danger"><RotateCcw size={32} /></div>
            <p className="overline">Ji nû ve dest pê bike?</p>
            <h2>Hemû pêşketin dê were jêbirin.</h2>
            <p>Coin, XP, serkeftin û kategoriyên vekirî nayên vegerandin.</p>
            <div className="modal-actions">
              <button className="secondary-button" onClick={() => setShowReset(false)}>Na, vegere</button>
              <button className="danger-button" onClick={resetPlayer}>Erê, jê bibe</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function LoadingScreen() {
  return <main className="loading-screen"><div className="loading-mark">KQ</div><div className="loading-line" /></main>
}

function HomeView({ player, onPlay, onUnlock, onNavigate }: { player: PlayerData; onPlay: (id: CategoryId) => void; onUnlock: (id: CategoryId, price: number) => void; onNavigate: (view: View) => void }) {
  const level = getLevel(player.xp)
  const nextXp = getNextLevelXp(player.xp)
  const progress = ((player.xp % 100) / 100) * 100
  return (
    <div className="page home-page">
      <header className="topbar">
        <div className="brand-lockup"><span className="brand-mark">KQ</span><div><p>Fêr bibe · Bilîze</p><h1>Kurdish Quiz</h1></div></div>
        <button className="coin-pill" onClick={() => onNavigate('profile')}><Coins size={18} /><strong>{player.coins}</strong></button>
      </header>

      <section className="hero-card">
        <div className="hero-copy">
          <p className="overline">Silav, lîstikvan!</p>
          <h2>Îro çend peyvên nû fêr dibî?</h2>
          <div className="player-id"><span>ID</span>{player.id}</div>
        </div>
        <div className="level-orbit"><span>Asta</span><strong>{level}</strong><small>{player.xp} / {nextXp} XP</small></div>
        <div className="hero-progress"><span style={{ width: `${progress}%` }} /></div>
      </section>

      <section className="quick-stats">
        <div><Trophy size={19} /><span>Highscore</span><strong>{player.bestScore}</strong></div>
        <button onClick={() => onNavigate('achievements')}><Award size={19} /><span>Serkeftin</span><strong>{player.achievements.length}/{achievements.length}</strong></button>
        <button onClick={() => onNavigate('saved-words')}><Bookmark size={19} /><span>Meine Wörter</span><strong>{Object.keys(player.savedWords).length}</strong></button>
        <button onClick={() => onNavigate('profile')}><UserRound size={19} /><span>Profîl</span><ChevronRight size={19} /></button>
      </section>

      <section className="category-section">
        <div className="section-heading"><div><p className="overline">Rêya xwe hilbijêre</p><h2>Kategorî</h2></div><span>{player.unlockedCategories.length}/{categories.length} vekirî</span></div>
        <div className="category-grid">
          {categories.map((category, index) => {
            const unlocked = player.unlockedCategories.includes(category.id)
            return (
              <article className={`category-card ${category.color} ${unlocked ? '' : 'locked'}`} key={category.id} style={{ '--delay': `${index * 45}ms` } as CSSProperties}>
                <div className="category-top"><span className="category-emoji">{category.emoji}</span>{unlocked ? <span className="open-dot"><Check size={13} /></span> : <LockKeyhole size={18} />}</div>
                <div><p>{category.eyebrow}</p><h3>{category.name}</h3></div>
                {unlocked ? (
                  <button onClick={() => onPlay(category.id)}>Bilîze <ChevronRight size={18} /></button>
                ) : (
                  <button onClick={() => onUnlock(category.id, category.price)}>Veke · {category.price} Coin</button>
                )}
              </article>
            )
          })}
        </div>
      </section>
      <nav className="mobile-nav"><button className="active"><Home size={20} /><span>Mal</span></button><button onClick={() => onNavigate('saved-words')}><Bookmark size={20} /><span>Wörter</span></button><button onClick={() => onNavigate('achievements')}><Award size={20} /><span>Serkeftin</span></button><button onClick={() => onNavigate('profile')}><UserRound size={20} /><span>Profîl</span></button></nav>
    </div>
  )
}

function QuizView({ player, question, questionIndex, categoryId, seconds, lives, combo, score, selectedAnswer, answerWasCorrect, hiddenAnswers, isSaved, onAnswer, onFifty, onTime, onToggleSaved, onExit }: { player: PlayerData; question: PlayQuestion; questionIndex: number; categoryId: CategoryId; seconds: number; lives: number; combo: number; score: number; selectedAnswer: string | null; answerWasCorrect: boolean | null; hiddenAnswers: string[]; isSaved: boolean; onAnswer: (answer: string) => void; onFifty: () => void; onTime: () => void; onToggleSaved: () => void; onExit: () => void }) {
  const category = getCategory(categoryId)
  return (
    <div className="page quiz-page">
      <header className="quiz-header">
        <button className="icon-button" onClick={onExit} aria-label="Vegere"><ArrowLeft size={22} /></button>
        <div className="quiz-title"><span>{category.emoji}</span><div><p>{category.name}</p><strong>{questionIndex + 1} / 10</strong></div></div>
        <div className="quiz-score"><span>Xal</span><strong>{score}</strong></div>
      </header>
      <div className="question-progress"><span style={{ width: `${(questionIndex + 1) * 10}%` }} /></div>

      <div className="status-row">
        <div className={`timer-pill ${seconds <= 5 ? 'urgent' : ''}`}><Clock3 size={18} /><strong>{seconds}</strong></div>
        <div className="lives" aria-label={`${lives} jiyan`}>{[0, 1, 2].map((life) => <Heart key={life} size={21} className={life < lives ? 'alive' : ''} fill={life < lives ? 'currentColor' : 'none'} />)}</div>
        <div className={`combo-pill ${combo >= 2 ? 'hot' : ''}`}><Flame size={18} /><span>Combo</span><strong>x{combo}</strong></div>
      </div>

      <section className="question-card">
        <button className={`bookmark-button ${isSaved ? 'saved' : ''}`} onClick={onToggleSaved} aria-label={isSaved ? 'Peyv ji lîsteyê rake' : 'Peyv tomar bike'} aria-pressed={isSaved}>
          {isSaved ? <BookmarkCheck size={23} /> : <Bookmark size={23} />}
        </button>
        <p className="overline">Peyva rast hilbijêre</p>
        <QuestionArtwork question={question} className="question-visual" />
        <h2>Ev çi ye?</h2>
        <div className="answer-grid">
          {question.options.map((option, index) => {
            const hidden = hiddenAnswers.includes(option)
            const isCorrect = option === question.correctAnswer
            const isSelected = selectedAnswer === option
            const state = answerWasCorrect !== null && isCorrect ? 'correct' : isSelected && answerWasCorrect === false ? 'wrong' : ''
            return <button key={option} disabled={hidden || answerWasCorrect !== null} className={`answer-button ${state} ${hidden ? 'hidden-answer' : ''}`} onClick={() => onAnswer(option)}><span>{String.fromCharCode(65 + index)}</span>{option}{state === 'correct' && <Check size={20} />}{state === 'wrong' && <X size={20} />}</button>
          })}
        </div>
      </section>

      <div className="joker-bar">
        <button disabled={player.coins < 10 || hiddenAnswers.length > 0 || answerWasCorrect !== null} onClick={onFifty}><span className="joker-icon">½</span><span><strong>50 / 50</strong><small>10 Coin</small></span></button>
        <button disabled={player.coins < 10 || answerWasCorrect !== null} onClick={onTime}><span className="joker-icon"><Zap size={19} /></span><span><strong>Dem +5</strong><small>10 Coin</small></span></button>
        <div className="quiz-coins"><Coins size={18} /><strong>{player.coins}</strong></div>
      </div>
      {answerWasCorrect !== null && <div className={`feedback ${answerWasCorrect ? 'right' : 'false'}`}>{answerWasCorrect ? 'Rast e!' : 'Çewt e!'}</div>}
    </div>
  )
}

function ResultView({ result, onAgain, onHome }: { result: Result; onAgain: () => void; onHome: () => void }) {
  return (
    <div className="page result-page">
      <section className="result-card">
        <div className="result-crown"><Trophy size={42} /></div>
        <p className="overline">Lîstik qediya</p>
        <h1>Encam</h1>
        {result.newHighscore && <div className="new-highscore"><Sparkles size={18} /> Nû Highscore!</div>}
        <div className="score-circle"><span>Xalên te</span><strong>{result.score}</strong></div>
        <div className="result-grid"><div className="success"><Check size={20} /><span>Rast</span><strong>{result.correct}</strong></div><div className="error"><X size={20} /><span>Çewt</span><strong>{result.wrong}</strong></div><div><Coins size={20} /><span>Coin</span><strong>+{result.coins}</strong></div><div><Zap size={20} /><span>XP</span><strong>+{result.xp}</strong></div></div>
        <div className="result-actions"><button className="primary-button" onClick={onAgain}><RotateCcw size={19} /> Dîsa bileyze</button><button className="secondary-button" onClick={onHome}><Home size={19} /> Vegere malê</button></div>
      </section>
    </div>
  )
}

function PageHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return <header className="inner-header"><button className="icon-button" onClick={onBack}><ArrowLeft size={22} /></button><div><p>{subtitle}</p><h1>{title}</h1></div><span /></header>
}

function QuestionArtwork({ question, className }: { question: QuizQuestion; className: string }) {
  const [imageFailed, setImageFailed] = useState(false)
  useEffect(() => setImageFailed(false), [question.id])
  return (
    <div className={className}>
      {question.image && !imageFailed ? <img src={question.image} alt="" onError={() => setImageFailed(true)} /> : <span>{question.emoji}</span>}
    </div>
  )
}

function SavedWordsView({ player, onBack, onRemove, onToggleLearned }: { player: PlayerData; onBack: () => void; onRemove: (questionId: string) => void; onToggleLearned: (questionId: string) => void }) {
  const [filter, setFilter] = useState<SavedWordsFilter>('all')
  const savedQuestions = questions.filter((question) => player.savedWords[question.id])
  const learnedCount = savedQuestions.filter((question) => player.savedWords[question.id]?.learned).length
  const openCount = savedQuestions.length - learnedCount
  const learnedProgress = savedQuestions.length > 0 ? (learnedCount / savedQuestions.length) * 100 : 0
  const filteredQuestions = savedQuestions.filter((question) => {
    if (filter === 'learned') return player.savedWords[question.id]?.learned
    if (filter === 'open') return !player.savedWords[question.id]?.learned
    return true
  })

  return (
    <div className="page inner-page saved-words-page">
      <PageHeader
		title="Peyvên min"
		subtitle="Peyvên ku tu dixwazî fêr bibî"
		onBack={onBack}
		/>
      <section className="words-progress-card">
        <div className="words-progress-copy">
          <div><p className="overline">Lernfortschritt</p><h2>{savedQuestions.length} hatin tomarkirin · {learnedCount} hîn bû · {openCount} hîn nebû</h2></div>
          <span>{Math.round(learnedProgress)}%</span>
        </div>
        <div className="words-progress-track" aria-label={`${Math.round(learnedProgress)} ji sed hîn bû`}><span style={{ width: `${learnedProgress}%` }} /></div>
      </section>

      <div className="word-filters" aria-label="Wörter filtern">
        {([['all', 'Hemû'], ['open', 'Hîn nehat bûn'], ['learned', 'Hîn bû']] as const).map(([value, label]) => (
          <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{label}</button>
        ))}
      </div>

      {filteredQuestions.length > 0 ? (
        <section className="saved-word-grid">
          {filteredQuestions.map((question, index) => {
            const category = getCategory(question.category)
            const learned = player.savedWords[question.id]?.learned ?? false
            return (
              <article className={`saved-word-card ${learned ? 'learned' : ''}`} key={question.id} style={{ '--delay': `${index * 45}ms` } as CSSProperties}>
                <QuestionArtwork question={question} className="saved-word-art" />
                <div className="saved-word-content">
                  <div className="saved-word-category"><span>{category.emoji}</span>{category.name}</div>
                  <h2>{question.word}</h2>
                  <p>{question.meaningDe}</p>
                </div>
                <div className="saved-word-actions">
                  <button className={`learned-button ${learned ? 'active' : ''}`} onClick={() => onToggleLearned(question.id)} aria-pressed={learned}><CheckCircle2 size={18} />{learned ? 'Hîn bû' : 'Wekî hîn bû nîşan bike'}</button>
                  <button className="remove-word-button" onClick={() => onRemove(question.id)} aria-label={`${question.word} rake`}><Trash2 size={19} /></button>
                </div>
              </article>
            )
          })}
        </section>
      ) : (
        <section className="saved-words-empty">
          <div><LibraryBig size={34} /></div>
          <h2>{savedQuestions.length === 0
      ? 'Hêj peyv nehatine tomarkirin'
      : 'Di vê parzûnê de peyv tune'}</h2>
          <p>    {savedQuestions.length === 0
      ? 'Di quizê de li ser nîşana pirtûkê bitikîne da ku peyvan li vir kom bikî.'
      : 'Parzûnek din hilbijêre da ku peyvên xwe bibînî.'}</p>
          {savedQuestions.length === 0 && <button className="primary-button" onClick={onBack}><Home size={18} /> Vegere quizê</button>}
        </section>
      )}
    </div>
  )
}

function ProfileView({ player, onBack, onReset }: { player: PlayerData; onBack: () => void; onReset: () => void }) {
  const level = getLevel(player.xp)
  const nextXp = getNextLevelXp(player.xp)
  return (
    <div className="page inner-page">
      <PageHeader title="Profîl" subtitle="Pêşketina te" onBack={onBack} />
      <section className="profile-identity"><div className="profile-avatar"><UserRound size={38} /></div><div><p>ID</p><h2>{player.id}</h2><span>Asta {level}</span></div></section>
      <section className="xp-card"><div><span>XP</span><strong>{player.xp} / {nextXp}</strong></div><div className="xp-track"><span style={{ width: `${player.xp % 100}%` }} /></div></section>
      <section className="profile-grid">
        <div><Coins /><span>Coin</span><strong>{player.coins}</strong></div><div><Trophy /><span>Highscore</span><strong>{player.bestScore}</strong></div><div><Zap /><span>Lîstik</span><strong>{player.gamesPlayed}</strong></div><div><Check /><span>Bersiva rast</span><strong>{player.correctAnswers}</strong></div><div><X /><span>Bersiva çewt</span><strong>{player.wrongAnswers}</strong></div><div><Flame /><span>Combo ya herî baş</span><strong>{player.bestCombo}</strong></div><div className="wide"><Award /><span>Serkeftin</span><strong>{player.achievements.length} / {achievements.length}</strong></div>
      </section>
      <button className="reset-button" onClick={onReset}><RotateCcw size={18} /> Profîlê ji nû ve dest pê bike</button>
    </div>
  )
}

function AchievementsView({ player, onBack }: { player: PlayerData; onBack: () => void }) {
  return (
    <div className="page inner-page">
      <PageHeader title="Serkeftin" subtitle={`${player.achievements.length} ji ${achievements.length} vekirî`} onBack={onBack} />
      <div className="achievement-list">{achievements.map((achievement) => { const unlocked = player.achievements.includes(achievement.id); return <article key={achievement.id} className={unlocked ? 'unlocked' : ''}><span className="achievement-icon">{unlocked ? achievement.icon : <LockKeyhole size={25} />}</span><div><h2>{achievement.title}</h2><p>{achievement.description}</p></div><span className="reward"><Coins size={15} />{achievement.reward}</span></article> })}</div>
    </div>
  )
}
