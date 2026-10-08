'use client'

import React, { memo, useMemo, useState, useCallback, useEffect } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from 'react-simple-maps'
import type { NewsStory } from '@/lib/types'
import {
  STATE_COORDINATES,
  POPULAR_STATES,
  ALL_US_STATES,
  US_REGIONS,
  formatStateName,
} from '@/lib/location-extractor'
import {
  MapPin,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Radio,
  Flame,
  Search,
  CheckCircle2,
  X,
} from 'lucide-react'

const GEO_URL = '/us-topo.json'

interface NewsMapProps {
  stories: NewsStory[]
  onStoryClick: (s: NewsStory) => void
  selectedState: string | null
  onSelectState: (state: string | null) => void
  onRewardXp?: (amount: number, reason: string) => void
}

const MemoGeo = memo(function MemoGeo(props: any) {
  return <Geography {...props} />
})

export default function NewsMap({
  stories,
  onStoryClick,
  selectedState,
  onSelectState,
  onRewardXp,
}: NewsMapProps) {
  const [zoom, setZoom] = useState<number>(1)
  const [center, setCenter] = useState<[number, number]>([-96, 38])
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [tickerIndex, setTickerIndex] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  // Group stories by state
  const storiesByState = useMemo(() => {
    const map: Record<string, NewsStory[]> = {}
    for (const s of stories) {
      if (s.state) {
        const k = s.state.toLowerCase()
        if (!map[k]) map[k] = []
        map[k].push(s)
      }
    }
    return map
  }, [stories])

  const statesWithStories = useMemo(() => Object.keys(storiesByState), [storiesByState])
  const totalStateStories = useMemo(
    () => Object.values(storiesByState).reduce((acc, curr) => acc + curr.length, 0),
    [storiesByState]
  )

// Active states with news reports
  const activeStateSlugs = useMemo(
    () =>
      Object.keys(storiesByState)
        .filter((slug) => (storiesByState[slug]?.length || 0) > 0)
        .sort((a, b) => (storiesByState[b]?.length || 0) - (storiesByState[a]?.length || 0)),
    [storiesByState]
  )

  // Compute states for quick-picks based on selected region
  const displayedStates = useMemo(() => {
    if (selectedRegion === 'all') {
      const seen = new Set<string>()
      const list: { name: string; slug: string }[] = [{ name: 'All 50 States', slug: 'all' }]
      seen.add('all')
      for (const slug of activeStateSlugs) {
        if (!seen.has(slug)) {
          seen.add(slug)
          const meta = ALL_US_STATES.find((s) => s.slug === slug)
          list.push({ name: meta?.name || formatStateName(slug), slug })
        }
      }
      for (const p of POPULAR_STATES) {
        if (!seen.has(p.slug)) {
          seen.add(p.slug)
          list.push(p)
        }
      }
      return list
    } else {
      const reg = US_REGIONS[selectedRegion]
      if (!reg) return POPULAR_STATES
      const sorted = [...reg.states].sort((a, b) => {
        const countA = storiesByState[a]?.length || 0
        const countB = storiesByState[b]?.length || 0
        if (countA !== countB) return countB - countA
        return a.localeCompare(b)
      })
      const list: { name: string; slug: string }[] = [{ name: `All ${reg.label}`, slug: 'all' }]
      for (const slug of sorted) {
        const meta = ALL_US_STATES.find((s) => s.slug === slug)
        list.push({ name: meta?.name || formatStateName(slug), slug })
      }
      return list
    }
  }, [selectedRegion, activeStateSlugs, storiesByState])

  // Stories that have an assigned state for the live ticker
  const stateStoriesList = useMemo(() => stories.filter((s) => s.state), [stories])

  // Sync zoom and center when selectedState changes
  useEffect(() => {
    if (selectedState && STATE_COORDINATES[selectedState]) {
      setCenter(STATE_COORDINATES[selectedState])
      setZoom(3.5)
      if (onRewardXp) {
        onRewardXp(5, `Exploring ${formatStateName(selectedState)} News Wire`)
      }
      setTimeout(() => {
        drawerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 150)
    } else {
      setCenter([-96, 38])
      setZoom(1)
    }
  }, [selectedState, onRewardXp])

  // Automatic ticker cycling
  useEffect(() => {
    if (stateStoriesList.length <= 1) return
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % stateStoriesList.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [stateStoriesList.length])

  const handleStateClick = useCallback(
    (stateKey: string) => {
      if (selectedState === stateKey) {
        onSelectState(null)
      } else {
        onSelectState(stateKey)
      }
    },
    [selectedState, onSelectState]
  )

  const pointerStartRef = React.useRef<{ x: number; y: number; t: number } | null>(null)
  const drawerRef = React.useRef<HTMLDivElement>(null)
  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.4, 7))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.4, 1))
  const handlePan = (dx: number, dy: number) => setCenter(([cx, cy]) => [cx + dx, cy + dy])
  const handleReset = () => {
    onSelectState(null)
    setZoom(1)
    setCenter([-96, 38])
  }
  const onPointerDownTrack = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY, t: Date.now() }
  }
  const onPointerUpTrack = (e: React.PointerEvent, stateName: string) => {
    if (pointerStartRef.current) {
      const dx = Math.abs(e.clientX - pointerStartRef.current.x)
      const dy = Math.abs(e.clientY - pointerStartRef.current.y)
      const dt = Date.now() - pointerStartRef.current.t
      if (dx < 15 && dy < 15 && dt < 450) {
        handleStateClick(stateName)
      }
    }
  }

  const currentTickerStory = stateStoriesList[tickerIndex] || stateStoriesList[0]

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* =================================================================== */}
      {/* MAP COMMAND CENTER CARD                                            */}
      {/* =================================================================== */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-card shadow-xl transition-all">
        {/* Top Radar Bar: Red, White & Blue */}
        <div className="border-b-2 border-border/80 bg-gradient-to-r from-blue-950 via-slate-900 to-red-950 px-4 sm:px-6 py-3.5 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-masthead text-xs sm:text-sm tracking-wider uppercase font-bold text-white">
                50-State Interactive News Radar
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600/80 text-white border border-blue-400">
                Live Wire
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
            <span className="hidden md:inline">
              <span className="text-white font-extrabold">{totalStateStories}</span> Dispatches in{' '}
              <span className="text-white font-extrabold">{statesWithStories.length}</span> States
            </span>

            {selectedState && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Return to All 50 States</span>
              </button>
            )}
          </div>
        </div>

        {/* US Regions Filter Bar */}
        <div className="px-3 sm:px-6 py-2 border-b border-border/40 bg-muted/20 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-black uppercase text-muted-foreground shrink-0 mr-1 flex items-center gap-1">
            <Radio className="w-3 h-3 text-red-600 animate-pulse" />
            <span>Region:</span>
          </span>
          {Object.entries(US_REGIONS).map(([key, reg]) => {
            const isSelected = selectedRegion === key
            const regStoryCount = reg.states.reduce(
              (acc, s) => acc + (storiesByState[s]?.length || 0),
              0
            )

            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedRegion(key)
                  if (key !== 'all' && selectedState && !reg.states.includes(selectedState)) {
                    onSelectState(null)
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-xs scale-102'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border/70 hover:bg-muted/60'
                }`}
              >
                <span>{reg.label}</span>
                {regStoryCount > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-red-500/15 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {regStoryCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* State Quick-Picks Row */}
        <div className="p-3 sm:px-6 sm:py-3 border-b-2 border-border/60 bg-muted/30">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-black uppercase text-muted-foreground shrink-0 mr-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-600" />
              <span>Jump To:</span>
            </span>

            {displayedStates.map((st) => {
              const isSelected =
                st.slug === 'all' ? selectedState === null : selectedState === st.slug
              const count =
                st.slug === 'all'
                  ? stories.length
                  : storiesByState[st.slug]?.length || 0

              return (
                <button
                  key={st.slug}
                  onClick={() => onSelectState(st.slug === 'all' ? null : st.slug)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-102'
                      : 'bg-card text-foreground border-border/80 hover:border-blue-500/50 hover:bg-muted/60'
                  }`}
                >
                  <span>{st.name}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-white/25 text-white' : 'bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            })}

            {/* All 50 States Dropdown */}
            <div className="shrink-0 pl-1">
              <select
                value={selectedState || 'all'}
                onChange={(e) => onSelectState(e.target.value === 'all' ? null : e.target.value)}
                className="px-3 py-1.5 rounded-xl border-2 border-border/80 bg-card text-xs font-bold text-foreground focus:outline-hidden focus:border-blue-600 cursor-pointer"
              >
                <option value="all">🇺🇸 All 50 States + DC...</option>
                {ALL_US_STATES.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name} ({s.code}) {storiesByState[s.slug]?.length ? `• ${storiesByState[s.slug].length} stories` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Interactive SVG Radar Map */}
        <div className="relative w-full h-[360px] sm:h-[460px] bg-slate-950 overflow-hidden touch-none select-none">
          {/* Subtle patriotic backdrop grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-25"></div>

          {/* Floating Map Zoom Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-2xl shadow-lg backdrop-blur-md">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-black transition-all active:scale-95 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-black transition-all active:scale-95 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-black transition-all active:scale-95 cursor-pointer"
              title="Reset USA"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Hover / Selection Tooltip */}
          {selectedState ? (
            <div className="absolute top-4 left-4 right-16 z-10 px-3.5 py-2.5 rounded-2xl bg-slate-900/95 border-2 border-red-500 text-white shadow-2xl backdrop-blur-md flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
                <span className="font-extrabold text-xs sm:text-sm uppercase text-red-400 truncate">
                  📍 {formatStateName(selectedState)}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-600 text-white shrink-0">
                  {storiesByState[selectedState]?.length || 0} Reports
                </span>
              </div>
              <button
                onClick={handleReset}
                className="px-2 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-[11px] font-bold cursor-pointer shrink-0"
              >
                ✕ All USA
              </button>
            </div>
          ) : hoveredState ? (
            <div className="absolute bottom-4 left-4 z-10 px-3.5 py-2 rounded-2xl bg-slate-900/95 border-2 border-blue-500/50 text-white shadow-xl backdrop-blur-md text-xs font-bold animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="font-extrabold text-sm uppercase text-blue-300">
                  {formatStateName(hoveredState)}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-200">
                  {storiesByState[hoveredState]?.length || 0} Stories Active
                </span>
              </div>
            </div>
          ) : null}

          {/* Map Canvas */}
          <ComposableMap
            projection="geoAlbersUsa"
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup
              center={center}
              zoom={zoom}
              minZoom={1}
              maxZoom={8}
              onMoveEnd={({ coordinates, zoom: newZoom }) => {
                if (coordinates) setCenter(coordinates)
                if (typeof newZoom === 'number') setZoom(newZoom)
              }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((g) => {
                    const name = g.properties?.name?.toLowerCase()
                    const isSelected = selectedState === name
                    const isHovered = hoveredState === name
                    const hasStories = !!(name && storiesByState[name]?.length)

                    let fill = '#0f172a'
                    let stroke = '#1e293b'
                    let strokeWidth = 0.6

                    if (isSelected) {
                      fill = '#dc2626'
                      stroke = '#ffffff'
                      strokeWidth = 2.5
                    } else if (hasStories) {
                      fill = '#1e40af'
                      stroke = '#60a5fa'
                      strokeWidth = 1.2
                    }

                    return (
                      <MemoGeo
                        key={g.properties?.name || g.rsmKey}
                        geography={g}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        style={{
                          default: { outline: 'none', transition: 'all 250ms' },
                          hover: {
                            fill: isSelected ? '#1e40af' : hasStories ? '#1e3a8a' : '#334155',
                            stroke: '#dc2626',
                            strokeWidth: 1.5,
                            outline: 'none',
                            cursor: 'pointer',
                          },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={() => setHoveredState(name || null)}
                        onMouseLeave={() => setHoveredState(null)}
                        onPointerDown={onPointerDownTrack}
                        onPointerUp={(e: any) => {
                          if (name) onPointerUpTrack(e, name)
                        }}
                        onClick={() => {
                          if (name) handleStateClick(name)
                        }}
                      />
                    )
                  })
                }
              </Geographies>

              {/* Pulsing Beacons & Story Markers for States with Active News */}
              {Object.entries(storiesByState).map(([state, ss]) => {
                const coords = STATE_COORDINATES[state]
                if (!coords) return null
                const isSelected = selectedState === state
                const count = ss.length
                const radius = Math.max(5, Math.min(14, 5 + count * 1.5))

                return (
                  <Marker
                    key={state}
                    coordinates={coords}
                    onPointerDown={onPointerDownTrack}
                    onPointerUp={(e: any) => onPointerUpTrack(e, state)}
                    onClick={() => handleStateClick(state)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Animated Outer Radar Ring */}
                    <circle
                      r={radius + 8}
                      fill={isSelected ? '#dc2626' : '#2563eb'}
                      opacity={0.3}
                      className="animate-radar"
                    />

                    {/* Middle Glow Ring */}
                    <circle
                      r={radius + 2}
                      fill={isSelected ? '#dc2626' : '#3b82f6'}
                      opacity={0.6}
                    />

                    {/* Solid Inner Center */}
                    <circle
                      r={radius}
                      fill={isSelected ? '#ffffff' : '#dc2626'}
                      stroke={isSelected ? '#dc2626' : '#ffffff'}
                      strokeWidth={1.5}
                    />

                    {/* Count Text */}
                    {count > 0 && (
                      <text
                        textAnchor="middle"
                        y={3.5}
                        style={{
                          fontFamily: 'system-ui, sans-serif',
                          fontSize: '8px',
                          fontWeight: '900',
                          fill: isSelected ? '#dc2626' : '#ffffff',
                          pointerEvents: 'none',
                        }}
                      >
                        {count}
                      </text>
                    )}
                  </Marker>
                )
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Real-Time State Wire Ticker Bar */}
        {currentTickerStory && (
          <div className="bg-slate-900 border-t-2 border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px] uppercase shrink-0">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>STATE WIRE</span>
              </span>
              <span className="font-extrabold text-blue-400 shrink-0">
                [{formatStateName(currentTickerStory.state).toUpperCase()}]:
              </span>
              <span
                onClick={() => {
                  if (currentTickerStory.state) onSelectState(currentTickerStory.state)
                  onStoryClick(currentTickerStory)
                }}
                className="font-bold text-white hover:text-blue-300 transition-colors truncate cursor-pointer"
              >
                {currentTickerStory.simplifiedTitle}
              </span>
            </div>

            <button
              onClick={() => {
                if (currentTickerStory.state) onSelectState(currentTickerStory.state)
                onStoryClick(currentTickerStory)
              }}
              className="text-[11px] font-black text-blue-400 hover:text-white shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* SELECTED STATE DISPATCH DRAWER (WHEN A STATE IS FOCUSED)            */}
      {/* =================================================================== */}
      {selectedState && (
        <div ref={drawerRef} className="rounded-3xl border-2 border-blue-600/40 bg-gradient-to-br from-blue-600/10 via-card to-card p-5 sm:p-6 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-blue-600 text-white">
                <MapPin className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-masthead text-lg sm:text-xl font-bold text-foreground">
                  {formatStateName(selectedState)} Dispatches
                </h3>
                <p className="text-xs text-muted-foreground font-semibold">
                  {storiesByState[selectedState]?.length || 0} active local reports right now
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl border-2 border-border/80 bg-card hover:bg-muted font-bold text-xs text-foreground transition-all cursor-pointer"
            >
              ← Back to Full USA Map
            </button>
          </div>

          {/* Quick List of Stories in this State */}
          {storiesByState[selectedState]?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {storiesByState[selectedState].map((story) => (
                <div
                  key={story.id}
                  onClick={() => onStoryClick(story)}
                  className="p-3.5 rounded-2xl bg-card border-2 border-border/80 hover:border-blue-500/60 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-700 dark:text-blue-300">
                      {story.categoryLabel}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {story.timeAgo}
                    </span>
                  </div>
                  <h4 className="font-fancy text-sm font-bold text-foreground group-hover:text-blue-600 transition-colors line-clamp-2">
                    {story.simplifiedTitle}
                  </h4>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-card rounded-2xl border border-dashed border-border text-xs text-muted-foreground">
              No state-specific wire reports for {formatStateName(selectedState)} at this hour. National headlines affecting all 50 states are shown below.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
