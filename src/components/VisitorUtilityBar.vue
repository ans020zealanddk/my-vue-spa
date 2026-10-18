<template>
  <aside class="utility-bar" aria-label="Visitor information and shortcuts">
    <div class="utility-inner">
      <span class="utility-heading">Visitor essentials</span>
      <nav class="utility-actions" aria-label="Visitor essentials">
        <a
          class="utility-link"
          href="https://www.smk.dk/en/section/visit-smk/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Opening hours
        </a>
        <a
          class="utility-link"
          href="https://www.smk.dk/en/?s=audio+guide"
          target="_blank"
          rel="noopener noreferrer"
        >
          Audio guides
        </a>
        <RouterLink
          v-for="facility in facilities"
          :key="facility.id"
          class="utility-link"
          :to="{ name: 'map', query: { place: facility.id } }"
        >
          {{ facility.label }}
        </RouterLink>
      </nav>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'VisitorUtilityBar',
  data() {
    return {
      facilities: [
        { id: 'lockers', label: 'Lockers' },
        { id: 'cafe', label: 'Café' },
        { id: 'restrooms', label: 'Restrooms' },
      ],
    }
  },
}
</script>
