import { useEffect, useState } from 'react'
import {
  Box, Container, Typography, Card, CardContent, CircularProgress, Alert,
  Tabs, Tab, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Stepper, Step, StepLabel, StepContent, Paper, Chip, IconButton,
  Fade, Grow, TextField, ToggleButtonGroup, ToggleButton, InputAdornment
} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import SchoolIcon from '@mui/icons-material/School'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
    },
    secondary: {
      main: '#ff6d00',
    },
    background: {
      default: '#0a1929',
      paper: '#132f4c',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
})

interface MorseCode {
  id: number
  character: string
  code_pattern: string
  category: string
}

function App() {
  const [codes, setCodes] = useState<MorseCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState(0)
  const [guideOpen, setGuideOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('morse_favorites')
    return saved ? JSON.parse(saved) : []
  })
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // トレーニング用state
  const [trainingMode, setTrainingMode] = useState<'listening' | 'sending' | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<MorseCode | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [trainingHistory, setTrainingHistory] = useState<Array<{ code: MorseCode; correct: boolean }>>([])

  useEffect(() => {
    const fetchCodes = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (categoryFilter) params.append('category', categoryFilter)
        if (searchQuery) params.append('search', searchQuery)

        const url = `/api/codes${params.toString() ? '?' + params.toString() : ''}`
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()

        // お気に入りフィルタリング
        const filteredCodes = showFavoritesOnly
          ? data.codes.filter((code: MorseCode) => favorites.includes(code.id))
          : data.codes

        setCodes(filteredCodes)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchCodes()
  }, [categoryFilter, searchQuery, showFavoritesOnly, favorites])

  const handleNext = () => setActiveStep((prev) => prev + 1)
  const handleBack = () => setActiveStep((prev) => prev - 1)
  const handleReset = () => setActiveStep(0)

  // 音声再生機能
  const playMorseSound = (pattern: string) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const frequency = 800 // Hz
    const dotDuration = 0.1 // 100ms
    const dashDuration = 0.3 // 300ms
    const symbolGap = 0.1 // 100ms

    let currentTime = audioContext.currentTime

    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i]
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      const duration = char === '・' ? dotDuration : dashDuration

      gainNode.gain.setValueAtTime(0, currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.01)
      gainNode.gain.setValueAtTime(0.3, currentTime + duration - 0.01)
      gainNode.gain.linearRampToValueAtTime(0, currentTime + duration)

      oscillator.start(currentTime)
      oscillator.stop(currentTime + duration)

      currentTime += duration + symbolGap
    }
  }

  // お気に入り機能
  const toggleFavorite = (codeId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(codeId)
        ? prev.filter(id => id !== codeId)
        : [...prev, codeId]
      localStorage.setItem('morse_favorites', JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const isFavorite = (codeId: number) => favorites.includes(codeId)

  // トレーニング関数
  const startTraining = (mode: 'listening' | 'sending') => {
    setTrainingMode(mode)
    setScore({ correct: 0, total: 0 })
    setTrainingHistory([])
    generateQuestion()
  }

  const generateQuestion = () => {
    if (codes.length === 0) return
    const randomCode = codes[Math.floor(Math.random() * codes.length)]
    setCurrentQuestion(randomCode)
    setUserAnswer('')
    setFeedback(null)
  }

  const submitAnswer = () => {
    if (!currentQuestion) return

    const isCorrect = trainingMode === 'listening'
      ? userAnswer.toUpperCase() === currentQuestion.character
      : userAnswer === currentQuestion.code_pattern

    setFeedback(isCorrect ? 'correct' : 'incorrect')
    setScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }))
    setTrainingHistory(prev => [...prev, { code: currentQuestion, correct: isCorrect }])

    setTimeout(() => {
      generateQuestion()
    }, 1500)
  }

  const stopTraining = () => {
    setTrainingMode(null)
    setCurrentQuestion(null)
    setUserAnswer('')
    setFeedback(null)
  }

  const guideSteps = [
    {
      label: 'モールス信号学習システムへようこそ',
      description: 'このシステムは、モールス信号の学習を支援し、習得状況を分析するためのプラットフォームです。',
    },
    {
      label: '符号辞書で基礎を学ぶ',
      description: '「符号一覧」タブでは、欧文・和文・数字のモールス信号パターンを確認できます。各符号の「・（短点）」と「ー（長点）」の組み合わせを覚えましょう。',
    },
    {
      label: 'トレーニングで実践',
      description: '「トレーニング」タブでは、聴音練習や送信練習を行えます（今後実装予定）。繰り返し練習することで、反射的に符号を認識できるようになります。',
    },
    {
      label: '苦手符号の自動抽出',
      description: 'システムがあなたの学習ログを分析し、苦手な符号を自動的に抽出します。重点的に練習すべき符号が一目でわかります。',
    },
  ]

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* ヘッダー */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 100%)',
        borderBottom: '1px solid rgba(0, 229, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        backdropFilter: 'blur(10px)',
      }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SignalCellularAltIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold" sx={{
                  background: 'linear-gradient(45deg, #00e5ff 30%, #00b8d4 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Morse Learning System
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  モールス信号学習支援・分析システム
                </Typography>
              </Box>
            </Box>
            <IconButton
              color="primary"
              onClick={() => setGuideOpen(true)}
              sx={{
                border: '2px solid',
                borderColor: 'primary.main',
                '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.1)' }
              }}
            >
              <HelpOutlineIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* タブナビゲーション */}
        <Paper elevation={0} sx={{ mb: 4, bgcolor: 'transparent' }}>
          <Tabs
            value={currentTab}
            onChange={(_, v) => setCurrentTab(v)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                py: 2,
                fontSize: '1rem',
                fontWeight: 600,
              }
            }}
          >
            <Tab icon={<MenuBookIcon />} label="符号一覧" iconPosition="start" />
            <Tab icon={<SchoolIcon />} label="トレーニング" iconPosition="start" />
            <Tab icon={<SignalCellularAltIcon />} label="分析" iconPosition="start" />
          </Tabs>
        </Paper>

        {/* 符号一覧タブ */}
        {currentTab === 0 && (
          <Fade in={currentTab === 0}>
            <Box>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress size={60} thickness={4} />
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  エラー: {error}
                </Alert>
              )}

              {!loading && !error && (
                <>
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" fontWeight="bold">
                      符号辞書
                    </Typography>
                    <Chip label={`${codes.length} 件`} color="primary" />
                  </Box>

                  {/* 検索・フィルター */}
                  <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      <TextField
                        placeholder="符号を検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ flex: 1, minWidth: '200px' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <FilterListIcon color="action" />
                        <ToggleButtonGroup
                          value={categoryFilter}
                          exclusive
                          onChange={(_, value) => setCategoryFilter(value)}
                          size="small"
                        >
                          <ToggleButton value={null}>全て</ToggleButton>
                          <ToggleButton value="欧文">欧文</ToggleButton>
                          <ToggleButton value="数字">数字</ToggleButton>
                          <ToggleButton value="和文">和文</ToggleButton>
                          <ToggleButton value="記号">記号</ToggleButton>
                        </ToggleButtonGroup>
                        <Button
                          variant={showFavoritesOnly ? 'contained' : 'outlined'}
                          startIcon={<FavoriteIcon />}
                          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                          size="small"
                          color="error"
                        >
                          お気に入り
                        </Button>
                      </Box>
                    </Box>
                  </Paper>

                  <Box sx={{ display: 'grid', gap: 2 }}>
                    {codes.map((code, index) => (
                      <Grow
                        in={true}
                        timeout={300 + index * 100}
                        key={code.id}
                      >
                        <Card sx={{
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(0, 229, 255, 0.2)',
                          }
                        }}>
                          <CardContent>
                            <Box sx={{
                              display: 'grid',
                              gridTemplateColumns: '80px 1fr 100px auto',
                              gap: 3,
                              alignItems: 'center'
                            }}>
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 60,
                                height: 60,
                                borderRadius: '12px',
                                bgcolor: 'rgba(0, 229, 255, 0.1)',
                                border: '2px solid',
                                borderColor: 'primary.main',
                              }}>
                                <Typography variant="h3" component="span" color="primary.main" fontWeight="bold">
                                  {code.character}
                                </Typography>
                              </Box>

                              <Box sx={{
                                fontFamily: 'monospace',
                                fontSize: '2rem',
                                letterSpacing: '0.3em',
                                color: 'primary.light',
                                textAlign: 'center',
                              }}>
                                {code.code_pattern}
                              </Box>

                              <Chip
                                label={code.category}
                                color="secondary"
                                sx={{ fontSize: '0.9rem', py: 2 }}
                              />

                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                  color="primary"
                                  onClick={() => playMorseSound(code.code_pattern)}
                                  sx={{
                                    border: '1px solid',
                                    borderColor: 'primary.main',
                                    '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.1)' }
                                  }}
                                >
                                  <VolumeUpIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => toggleFavorite(code.id)}
                                  sx={{
                                    border: '1px solid',
                                    borderColor: isFavorite(code.id) ? 'error.main' : 'grey.700',
                                    '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' }
                                  }}
                                >
                                  {isFavorite(code.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </IconButton>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grow>
                    ))}
                  </Box>

                  {/* 使い方ガイド */}
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 4,
                      p: 3,
                      bgcolor: 'rgba(0, 229, 255, 0.05)',
                      border: '1px solid rgba(0, 229, 255, 0.2)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <HelpOutlineIcon color="primary" />
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        使い方ガイド
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 2, mt: 2, '& li': { mb: 1.5 } }}>
                      <li>
                        <Typography>
                          <strong>検索:</strong> 文字または符号パターン（・ー）で検索できます
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          <strong>フィルター:</strong> 欧文・数字・和文・記号でカテゴリーを絞り込めます
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          <strong>音声再生:</strong> 🔊ボタンでモールス符号の音を聴くことができます
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          <strong>お気に入り:</strong> ❤️ボタンで符号をブックマークできます
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          <strong>符号の読み方:</strong> 「・」は短点（トン）、「ー」は長点（ツー）を表します
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          <strong>ヘルプ:</strong> 画面右上の「？」ボタンで詳細なガイドを表示できます
                        </Typography>
                      </li>
                    </Box>
                  </Paper>
                </>
              )}
            </Box>
          </Fade>
        )}

        {/* トレーニングタブ */}
        {currentTab === 1 && (
          <Fade in={currentTab === 1}>
            <Box>
              {!trainingMode ? (
                <Box sx={{ display: 'grid', gap: 3, maxWidth: '800px', mx: 'auto', mt: 4 }}>
                  <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                    トレーニングモードを選択
                  </Typography>

                  <Card sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 32px rgba(0, 229, 255, 0.3)' }
                  }} onClick={() => startTraining('listening')}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          bgcolor: 'rgba(0, 229, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '3px solid',
                          borderColor: 'primary.main',
                        }}>
                          <Typography variant="h3">👂</Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h5" fontWeight="bold" gutterBottom>
                            聴音練習
                          </Typography>
                          <Typography color="text.secondary">
                            モールス符号を見て、対応する文字を答える練習です
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 32px rgba(255, 109, 0, 0.3)' }
                  }} onClick={() => startTraining('sending')}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          bgcolor: 'rgba(255, 109, 0, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '3px solid',
                          borderColor: 'secondary.main',
                        }}>
                          <Typography variant="h3">✍️</Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h5" fontWeight="bold" gutterBottom>
                            送信練習
                          </Typography>
                          <Typography color="text.secondary">
                            文字を見て、モールス符号（・ー）で答える練習です
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ) : (
                <Box sx={{ maxWidth: '700px', mx: 'auto' }}>
                  {/* スコア表示 */}
                  <Paper sx={{ p: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {trainingMode === 'listening' ? '聴音練習' : '送信練習'}
                      </Typography>
                      <Typography color="text.secondary">
                        正解率: {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Chip label={`${score.correct} / ${score.total}`} color="primary" size="large" />
                      <Button variant="outlined" color="error" onClick={stopTraining}>
                        終了
                      </Button>
                    </Box>
                  </Paper>

                  {/* 問題表示 */}
                  {currentQuestion && (
                    <Card sx={{ p: 4, mb: 3, bgcolor: 'background.paper' }}>
                      <Typography variant="h6" gutterBottom align="center" color="text.secondary">
                        {trainingMode === 'listening' ? 'この符号は何の文字？' : 'この文字の符号は？'}
                      </Typography>
                      <Box sx={{
                        my: 4,
                        p: 4,
                        bgcolor: feedback === 'correct' ? 'rgba(76, 175, 80, 0.1)' : feedback === 'incorrect' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(0, 229, 255, 0.1)',
                        border: '2px solid',
                        borderColor: feedback === 'correct' ? 'success.main' : feedback === 'incorrect' ? 'error.main' : 'primary.main',
                        borderRadius: 2,
                        textAlign: 'center',
                        transition: 'all 0.3s',
                      }}>
                        <Typography variant="h2" fontWeight="bold" sx={{ fontFamily: trainingMode === 'listening' ? 'monospace' : 'inherit' }}>
                          {trainingMode === 'listening' ? currentQuestion.code_pattern : currentQuestion.character}
                        </Typography>
                      </Box>

                      {feedback === null ? (
                        <Box>
                          <TextField
                            fullWidth
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                            placeholder={trainingMode === 'listening' ? '文字を入力...' : '符号を入力（例: ・ー）'}
                            autoFocus
                            sx={{ mb: 2 }}
                          />
                          <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={submitAnswer}
                            disabled={!userAnswer}
                          >
                            回答する
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight="bold" color={feedback === 'correct' ? 'success.main' : 'error.main'} gutterBottom>
                            {feedback === 'correct' ? '✓ 正解！' : '✗ 不正解'}
                          </Typography>
                          {feedback === 'incorrect' && (
                            <Typography variant="h6" color="text.secondary">
                              正解: {trainingMode === 'listening' ? currentQuestion.character : currentQuestion.code_pattern}
                            </Typography>
                          )}
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            次の問題を準備中...
                          </Typography>
                        </Box>
                      )}
                    </Card>
                  )}
                </Box>
              )}
            </Box>
          </Fade>
        )}

        {/* 分析タブ */}
        {currentTab === 2 && (
          <Fade in={currentTab === 2}>
            <Box>
              {trainingHistory.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', maxWidth: '600px', mx: 'auto', mt: 4 }}>
                  <SignalCellularAltIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    学習データがありません
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    トレーニングを開始すると、学習履歴と分析結果がここに表示されます
                  </Typography>
                  <Button variant="contained" onClick={() => setCurrentTab(1)}>
                    トレーニングを開始
                  </Button>
                </Paper>
              ) : (
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    学習分析
                  </Typography>

                  {/* 統計サマリー */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
                    <Paper sx={{ p: 3 }}>
                      <Typography color="text.secondary" gutterBottom>総問題数</Typography>
                      <Typography variant="h4" fontWeight="bold">{trainingHistory.length}</Typography>
                    </Paper>
                    <Paper sx={{ p: 3 }}>
                      <Typography color="text.secondary" gutterBottom>正解数</Typography>
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        {trainingHistory.filter(h => h.correct).length}
                      </Typography>
                    </Paper>
                    <Paper sx={{ p: 3 }}>
                      <Typography color="text.secondary" gutterBottom>不正解数</Typography>
                      <Typography variant="h4" fontWeight="bold" color="error.main">
                        {trainingHistory.filter(h => !h.correct).length}
                      </Typography>
                    </Paper>
                    <Paper sx={{ p: 3 }}>
                      <Typography color="text.secondary" gutterBottom>正答率</Typography>
                      <Typography variant="h4" fontWeight="bold" color="primary.main">
                        {Math.round((trainingHistory.filter(h => h.correct).length / trainingHistory.length) * 100)}%
                      </Typography>
                    </Paper>
                  </Box>

                  {/* 苦手な符号 */}
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      苦手な符号
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
                      {trainingHistory
                        .filter(h => !h.correct)
                        .slice(-5)
                        .map((item, index) => (
                          <Card key={index}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Chip label={item.code.character} color="error" />
                                <Typography sx={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>
                                  {item.code.code_pattern}
                                </Typography>
                                <Chip label={item.code.category} size="small" variant="outlined" />
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
          </Fade>
        )}
      </Container>

      {/* 使い方ガイドダイアログ */}
      <Dialog
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #00e5ff 0%, #00b8d4 100%)',
          color: '#0a1929',
          fontWeight: 'bold',
        }}>
          📚 使い方ガイド
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {guideSteps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mr: 1 }}
                      disabled={index === guideSteps.length - 1}
                    >
                      {index === guideSteps.length - 1 ? '完了' : '次へ'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                    >
                      戻る
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === guideSteps.length && (
            <Paper square elevation={0} sx={{ p: 3, mt: 3, bgcolor: 'background.default' }}>
              <Typography>すべてのステップが完了しました！</Typography>
              <Button onClick={handleReset} sx={{ mt: 2 }}>
                最初から見る
              </Button>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGuideOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  )
}

export default App
