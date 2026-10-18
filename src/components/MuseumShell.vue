<template>
  <div class="museum-shell">
    <header class="site-header">
      <div class="header-topline">
        <RouterLink class="brand-lockup" :to="{ name: 'map' }" aria-label="SMK Wayfinder home">
          <span class="brand-mark">SMK</span>
          <span class="brand-name">National Gallery of Denmark</span>
        </RouterLink>
        <span class="header-note">A quieter way to find your way</span>
      </div>
      <nav class="primary-nav" aria-label="Main navigation">
        <RouterLink :to="{ name: 'map' }">Explore the museum</RouterLink>
        <RouterLink :to="{ name: 'find' }">Find an artwork</RouterLink>
      </nav>
    </header>
    <RouterView />
    <footer class="site-footer">
      A visitor prototype · For precise directions, follow museum signage or ask our staff.
    </footer>
    <VisitorUtilityBar />
  </div>
</template>

<script>
import VisitorUtilityBar from './VisitorUtilityBar.vue'

export default {
  name: 'MuseumShell',
  components: {
    VisitorUtilityBar,
  },
}
</script>
