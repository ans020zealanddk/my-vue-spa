<template>
  <main class="quote-page">
    <h1>Quote Generator</h1>
    <blockquote>{{ quotes[currentQuoteIndex] }}</blockquote>
    <button type="button" @click="pickRandomQuote">Show another quote</button>
  </main>
</template>

<script>
export default {
  name: 'QuoteView',
  data() {
    return {
      quotes: [
        'Small steps still move you forward.',
        'Curiosity turns the unknown into a path.',
        'Make room for the work that matters.',
      ],
      currentQuoteIndex: 0,
    }
  },
  methods: {
    pickRandomQuote() {
      if (this.quotes.length < 2) return

      const offset = Math.floor(Math.random() * (this.quotes.length - 1)) + 1
      this.currentQuoteIndex = (this.currentQuoteIndex + offset) % this.quotes.length
    },
  },
}
</script>
