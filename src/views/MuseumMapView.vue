<template>
  <main class="page-content">
    <section aria-labelledby="map-title">
      <p class="eyebrow">SMK · Copenhagen</p>
      <h1 id="map-title" class="page-title">Find your way through art.</h1>
      <p class="page-intro">
        Choose a collection or visitor essential to see its location and plan your next stop.
      </p>
    </section>

    <div class="section-heading">
      <h2>Explore the museum</h2>
      <span class="section-kicker">Select a zone to get oriented</span>
    </div>

    <section class="map-layout" aria-label="Museum zone selector">
      <div class="map-panel">
        <span class="map-label">Gallery zones · schematic</span>
        <div class="map-zones">
          <button
            v-for="(zone, index) in zones"
            :key="zone.id"
            class="zone-button"
            :class="{ 'is-selected': selectedPlaceId === zone.id }"
            type="button"
            :aria-pressed="selectedPlaceId === zone.id"
            @click="selectPlace(zone)"
          >
            <span class="zone-number">0{{ index + 1 }} / COLLECTION</span>
            <span class="zone-name">{{ zone.name }}</span>
            <span class="zone-floor">{{ zone.location }}</span>
          </button>
        </div>
      </div>

      <article v-if="selectedPlace" class="detail-card" aria-live="polite">
        <div>
          <p class="eyebrow">{{ selectedPlace.category }}</p>
          <h2>{{ selectedPlace.name }}</h2>
          <p class="muted-copy">{{ selectedPlace.description }}</p>
        </div>
        <p class="detail-meta">{{ selectedPlace.location }}</p>
      </article>
    </section>

    <section aria-labelledby="facilities-title">
      <div class="section-heading">
        <h2 id="facilities-title">Visitor essentials</h2>
        <span class="section-kicker">A few useful places to know</span>
      </div>
      <div class="facility-grid">
        <button
          v-for="(facility, index) in facilities"
          :key="facility.id"
          class="facility-link"
          :class="{ 'is-selected': selectedPlaceId === facility.id }"
          type="button"
          :aria-pressed="selectedPlaceId === facility.id"
          @click="selectPlace(facility)"
        >
          <span class="facility-icon" aria-hidden="true">{{ index + 1 }}</span>
          <span class="facility-name">{{ facility.name }}</span>
        </button>
      </div>
    </section>

    <aside class="notice" aria-label="Map accuracy notice">
      <span aria-hidden="true">i</span>
      <span>
        <strong>Schematic visitor guide</strong>
        Locations are illustrative, not a surveyed floor plan. Please follow current museum signs
        or ask staff for precise directions.
      </span>
    </aside>
  </main>
</template>

<script>
export default {
  name: 'MuseumMapView',
  data() {
    return {
      selectedPlaceId: 'european-art',
      zones: [
        {
          id: 'european-art',
          category: 'Collection zone',
          name: 'European Art 1300–1800',
          location: 'Historic collections · gallery zone',
          description:
            'Explore European paintings and sculpture from the late medieval period through the eighteenth century.',
        },
        {
          id: 'danish-golden-age',
          category: 'Collection zone',
          name: 'Danish Golden Age',
          location: 'Danish collections · gallery zone',
          description:
            'Discover the artists and changing cultural life of Denmark in the early nineteenth century.',
        },
        {
          id: 'modern-art',
          category: 'Collection zone',
          name: 'Modern Art',
          location: 'Modern collections · gallery zone',
          description:
            'Move through modern and contemporary works from Denmark and around the world.',
        },
      ],
      facilities: [
        {
          id: 'lockers',
          category: 'Visitor facility',
          name: 'Lockers',
          location: 'Visitor services · location guide',
          description: 'Find the visitor-services area and check with staff for current locker access.',
        },
        {
          id: 'cafe',
          category: 'Visitor facility',
          name: 'Café',
          location: 'Café · location guide',
          description: 'Take a pause at the museum café; ask staff for current service information.',
        },
        {
          id: 'restrooms',
          category: 'Visitor facility',
          name: 'Restrooms',
          location: 'Visitor facilities · location guide',
          description: 'Use the museum signs to find the nearest restroom from your current gallery.',
        },
      ],
    }
  },
  computed: {
    selectedPlace() {
      return [...this.zones, ...this.facilities].find(
        (place) => place.id === this.selectedPlaceId,
      )
    },
  },
  watch: {
    '$route.query.place': {
      handler(placeId) {
        if ([...this.zones, ...this.facilities].some((place) => place.id === placeId)) {
          this.selectedPlaceId = placeId
        }
      },
      immediate: true,
    },
  },
  methods: {
    selectPlace(place) {
      this.selectedPlaceId = place.id
      if (this.$route.query.place !== place.id) {
        this.$router.replace({ query: { ...this.$route.query, place: place.id } })
      }
    },
  },
}
</script>
