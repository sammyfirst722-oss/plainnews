import {
  aiSimplifyStory,
  createFallbackBreakdown,
  getMonthlySpendStatus,
  resetMonthlySpendForTesting,
  clearAiCacheForTesting,
} from '../lib/news-fetcher'

async function runTests() {
  console.log('========================================')
  console.log('🧪 Starting AI Fallback & Spend Guard Tests')
  console.log('========================================\n')

  let passed = 0
  let failed = 0

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`✅ PASS: ${message}`)
      passed++
    } else {
      console.error(`❌ FAIL: ${message}`)
      failed++
    }
  }

  // Save original fetch and env
  const originalFetch = global.fetch
  const originalEnv = { ...process.env }

  try {
    // ----------------------------------------------------
    // Test 1: Deterministic breakdown when no keys
    // ----------------------------------------------------
    console.log('\n--- Test 1: No API Keys Provided ---')
    delete process.env.OPENROUTER_API_KEY
    delete process.env.OPENROUTER_PAID_API_KEY
    clearAiCacheForTesting()
    resetMonthlySpendForTesting()

    const resNoKey = await aiSimplifyStory(
      'Federal Reserve Holds Interest Rates Steady',
      'The Federal Reserve decided on Wednesday to keep its key interest rate unchanged as inflation cools.',
      'money',
      'https://example.com/fed-rates-1'
    )
    assert(!!resNoKey.simplifiedTitle, 'Returns a valid breakdown title without API keys')
    assert(resNoKey.whatHappened.length >= 3, 'Returns 3 bullet points in whatHappened')
    assert(getMonthlySpendStatus().calls === 0, 'No paid calls were made')

    // ----------------------------------------------------
    // Test 2: Free model returns HTTP 429 (Rate Limited) -> Retries Paid Fallback
    // ----------------------------------------------------
    console.log('\n--- Test 2: Free Model HTTP 429 Rate Limit -> Paid Fallback Retried ---')
    process.env.OPENROUTER_API_KEY = 'test-free-key'
    process.env.OPENROUTER_PAID_API_KEY = 'test-paid-key'
    process.env.OPENROUTER_MONTHLY_SPEND_CAP_USD = '5.00'
    clearAiCacheForTesting()
    resetMonthlySpendForTesting()

    let callHistory: { model: string; key: string }[] = []

    global.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const body = JSON.parse(init?.body as string)
      const authHeader = (init?.headers as any)?.Authorization || ''
      callHistory.push({ model: body.model, key: authHeader })

      if (body.model === 'google/gemma-4-26b-a4b-it:free') {
        // Simulate rate limit
        return new Response(JSON.stringify({ error: { message: 'Rate limit exceeded: 20 req/min' } }), {
          status: 429,
          statusText: 'Too Many Requests',
        })
      }

      if (body.model === 'google/gemma-4-26b-a4b-it') {
        // Paid model succeeds
        return new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    simplifiedTitle: 'Interest Rates Remain Unchanged',
                    bigPicture: 'The central bank decided to hold interest rates where they are for now.',
                    whatHappened: [
                      'Officials voted unanimously to keep borrowing costs steady.',
                      'Inflation is getting closer to normal targets.',
                      'Future rate cuts depend on upcoming job market reports.',
                    ],
                    whyItMatters: 'Mortgage and auto loan rates are likely to stay where they are for the coming weeks.',
                    plainWords: [{ word: 'Interest Rate', meaning: 'The extra fee charged for borrowing money.' }],
                  }),
                },
              },
            ],
            usage: {
              prompt_tokens: 500,
              completion_tokens: 150,
              total_tokens: 650,
            },
          }),
          { status: 200 }
        )
      }

      return new Response('Not found', { status: 404 })
    }

    const resFallback = await aiSimplifyStory(
      'Federal Reserve Holds Interest Rates Steady',
      'The Federal Reserve decided on Wednesday to keep its key interest rate unchanged as inflation cools.',
      'money',
      'https://example.com/fed-rates-2'
    )

    assert(callHistory.length === 2, `Expected 2 calls (free then paid), got ${callHistory.length}`)
    assert(callHistory[0]?.model === 'google/gemma-4-26b-a4b-it:free', 'First call attempted free model')
    assert(callHistory[1]?.model === 'google/gemma-4-26b-a4b-it', 'Second call attempted paid fallback model')
    assert(resFallback.simplifiedTitle === 'Interest Rates Remain Unchanged', 'Result contains AI-simplified title from paid model')
    
    const spendStatus = getMonthlySpendStatus()
    assert(spendStatus.calls === 1, `Expected 1 paid call tracked, got ${spendStatus.calls}`)
    assert(spendStatus.estimatedSpendUsd > 0, `Expected estimated spend > 0, got $${spendStatus.estimatedSpendUsd}`)
    assert(!spendStatus.capReached, 'Cap is not reached yet')

    // ----------------------------------------------------
    // Test 3: Spend Cap Guard blocks paid fallback when cap is reached
    // ----------------------------------------------------
    console.log('\n--- Test 3: Monthly Spend Cap Guard Blocks Paid Fallback ---')
    clearAiCacheForTesting()
    // Simulate current spend at $5.01 (over the $5.00 cap)
    resetMonthlySpendForTesting(5.01, 100)
    callHistory = []

    const resBlocked = await aiSimplifyStory(
      'New Guidelines for Blood Pressure Announced',
      'Medical researchers have updated the recommended target blood pressure for seniors.',
      'health',
      'https://example.com/health-1'
    )

    assert(callHistory.length === 1, `Expected only 1 call (free model only), got ${callHistory.length}`)
    assert(callHistory[0]?.model === 'google/gemma-4-26b-a4b-it:free', 'Free model was attempted')
    assert(getMonthlySpendStatus().calls === 100, 'Paid call counter did NOT increment because paid call was blocked')
    assert(!!resBlocked.simplifiedTitle, 'Cleanly fell back to deterministic breakdown')

    // ----------------------------------------------------
    // Test 4: Both free and paid models fail -> Deterministic breakdown
    // ----------------------------------------------------
    console.log('\n--- Test 4: Both Free and Paid Models Fail ---')
    clearAiCacheForTesting()
    resetMonthlySpendForTesting(0, 0)
    callHistory = []

    global.fetch = async (): Promise<Response> => {
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        statusText: 'Internal Server Error',
      })
    }

    const resBothFail = await aiSimplifyStory(
      'Major Storm Hits Coastal Cities',
      'Heavy rainfall and winds caused power outages across multiple coastal towns overnight.',
      'us-world',
      'https://example.com/storm-1'
    )

    assert(!!resBothFail.simplifiedTitle, 'Fell back cleanly to deterministic breakdown')
    assert(resBothFail.whatHappened.length >= 3, 'Includes 3 whatHappened bullets')

    // ----------------------------------------------------
    // Test 5: Live API test with real key (simulating free model rejection)
    // ----------------------------------------------------
    console.log('\n--- Test 5: Live API Test with Simulated Free Model Rejection ---')
    global.fetch = originalFetch
    process.env = { ...originalEnv }

    if (process.env.OPENROUTER_API_KEY) {
      clearAiCacheForTesting()
      resetMonthlySpendForTesting(0, 0)

      // Set free model to a non-existent free model to simulate upstream failure
      process.env.OPENROUTER_FREE_MODEL = 'google/gemma-nonexistent-failure-test:free'
      process.env.OPENROUTER_FALLBACK_MODEL = 'google/gemma-4-26b-a4b-it'

      console.log('Sending live request: free model configured to fail, paid model configured to succeed...')
      const liveRes = await aiSimplifyStory(
        'NASA Telescope Discovers New Distant Solar System',
        'Astronomers using the James Webb Space Telescope have identified a planetary system 120 light years away with possible water vapor in the atmosphere.',
        'tech',
        'https://example.com/nasa-telescope-' + Date.now()
      )

      console.log('Live Result Simplified Title:', liveRes.simplifiedTitle)
      console.log('Live Result Big Picture:', liveRes.bigPicture)
      const liveSpend = getMonthlySpendStatus()
      console.log(`Live Spend Status: ${liveSpend.calls} calls, $${liveSpend.estimatedSpendUsd.toFixed(6)} estimated USD`)

      assert(!!liveRes.simplifiedTitle, 'Live fallback generated a simplified title')
      assert(liveRes.whatHappened.length >= 1, 'Live fallback returned whatHappened points')
      assert(liveSpend.calls === 1, `Expected 1 tracked paid fallback call, got ${liveSpend.calls}`)

      // ----------------------------------------------------
      // Test 6: Live Normal Request with Primary Free Model
      // ----------------------------------------------------
      console.log('\n--- Test 6: Live Normal Request with Free Model ---')
      clearAiCacheForTesting()
      resetMonthlySpendForTesting(0, 0)
      delete process.env.OPENROUTER_FREE_MODEL

      console.log('Sending live request using primary free model (google/gemma-4-26b-a4b-it:free)...')
      const normalRes = await aiSimplifyStory(
        'US Treasury Announces New Savings Bond Rates',
        'The United States Treasury announced adjusted interest rates for Series I savings bonds for the upcoming semi-annual period.',
        'money',
        'https://example.com/treasury-bonds-' + Date.now()
      )

      console.log('Result Title:', normalRes.simplifiedTitle)
      const normalSpend = getMonthlySpendStatus()
      console.log(`Spend Status: ${normalSpend.calls} calls, $${normalSpend.estimatedSpendUsd.toFixed(6)} estimated USD`)
      assert(!!normalRes.simplifiedTitle, 'Generated a valid simplified title (via free tier or paid fallback)')
      assert(normalSpend.calls <= 1, 'Spend counter tracked properly (0 if free succeeded, 1 if free was rate-limited)')
    } else {
      console.log('Skipping Live API test: OPENROUTER_API_KEY not found in environment.')
    }

  } finally {
    // Restore original globals
    global.fetch = originalFetch
    process.env = originalEnv
  }

  console.log('\n========================================')
  console.log(`📊 Test Summary: ${passed} PASSED, ${failed} FAILED`)
  console.log('========================================')

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error('Unhandled test failure:', err)
  process.exit(1)
})
