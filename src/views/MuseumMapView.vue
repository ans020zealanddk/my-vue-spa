<template>
  <main class="page-content">
    <section aria-labelledby="map-title">
      <p class="eyebrow">{{ t('map.eyebrow') }}</p>
      <h1 id="map-title" class="page-title">{{ t('map.title') }}</h1>
      <p class="page-intro">{{ t('map.intro') }}</p>
    </section>

    <div class="section-heading">
      <h2>{{ t('map.sectionTitle') }}</h2>
      <span class="section-kicker">{{ t('map.sectionKicker') }}</span>
    </div>

    <section class="map-layout" :aria-label="t('map.ariaLabel')">
      <div class="map-panel floor-plan-panel">
        <div class="floor-tabs" role="tablist" :aria-label="t('map.levelsLabel')">
          <button
            v-for="level in levels"
            :key="level.id"
            class="floor-tab"
            :class="{ 'is-selected': selectedLevelId === level.id }"
            type="button"
            role="tab"
            :id="`floor-tab-${level.id}`"
            aria-controls="floor-plan-panel"
            :aria-selected="selectedLevelId === level.id"
            @click="selectLevel(level)"
          >
            {{ t(`map.levels.${level.id}`) }}
          </button>
        </div>

        <p class="map-label">
          {{ t(`map.levels.${currentLevel.id}`) }} · {{ t('map.schematicPlan') }}
        </p>

        <div class="floor-map-scroll">
          <svg
            id="floor-plan-panel"
            class="floor-plan"
            viewBox="0 0 640 370"
            role="tabpanel"
            :aria-labelledby="`floor-tab-${currentLevel.id} floor-plan-title`"
            aria-describedby="floor-plan-description"
          >
            <title id="floor-plan-title">
              {{ t(`map.levels.${currentLevel.id}`) }} {{ t('map.floorPlanSuffix') }}
            </title>
            <desc id="floor-plan-description">{{ t('map.floorPlanDescription') }}</desc>
            <path class="floor-outline" d="M22 24H618V330H355V352H285V330H22Z" />
            <path class="floor-corridor" d="M43 163H597M320 163V315" />
            <path
              v-for="room in currentLevelRooms"
              :key="`${room.place.id}-connector`"
              class="room-connector"
              :d="room.connector"
            />
               
              <g
                v-for="room in currentLevelRooms"
                :key="room.place.place_id"
                class="floor-room"
                :class="{ 'is-selected': selectedPlaceId === room.place.place_key }"
                role="button"
                tabindex="0"
                :aria-label="`${room.place.name}, ${room.place.floorName}. Select for directions.`"
                :aria-pressed="selectedPlaceId === room.place.place_key"
                @click="selectPlace(room.place)"
                @keydown="activateRoom($event, room.place)"
              >
                <rect
                  class="room-shape"
                  :x="room.x"
                  :y="room.y"
                  :width="room.width"
                  :height="room.height"
                  rx="2"
                />
                <text class="room-map-label" :x="room.x + room.width / 2" :y="room.y + 42">
                  {{ room.place.map_label || room.place.name }}
                </text>
                <text class="room-map-caption" :x="room.x + room.width / 2" :y="room.y + 66">
                  {{ room.place.floorName ? room.place.floorName.split(' · ')[0] : '' }}
                </text>
              </g>
            <text class="entrance-label" x="320" y="348">{{ t('map.mainEntrance') }}</text>
          </svg>
        </div>

        <div class="map-legend">
          <span class="legend-swatch" aria-hidden="true"></span>
          <span>{{ t('map.selectedRoom') }}</span>
          <span class="legend-outline" aria-hidden="true"></span>
          <span>{{ t('map.roomOutline') }}</span>
        </div>
      </div>

      <article v-if="selectedPlace" class="detail-card" aria-live="polite">
        <div>
          <p class="eyebrow">{{ selectedPlace.categoryName }}</p>
          <h2>{{ selectedPlace.name }}</h2>
          <p class="muted-copy">{{ selectedPlace.description }}</p>
        </div>
        <p class="detail-meta">{{ selectedPlace.floorName }}</p>
        <div class="room-directions">
          <h3>{{ t('map.directionsTitle') }}</h3>
          <ol class="direction-list">
            <li v-for="step in selectedPlace.directionsList" :key="step.step_order">
              {{ step.direction_text }}
            </li>
          </ol>
        </div>
      </article>  

   </section>

    <section aria-labelledby="facilities-title">
      <div class="section-heading">
        <h2 id="facilities-title">{{ t('map.facilitiesTitle') }}</h2>
        <span class="section-kicker">{{ t('map.facilitiesKicker') }}</span>
      </div>
      <div class="facility-grid">
      <button
        v-for="(facility, index) in facilityList"
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

    <aside class="notice" :aria-label="t('map.noticeLabel')">
      <span aria-hidden="true">i</span>
      <span>
        <strong>{{ t('map.noticeTitle') }}</strong>
        {{ t('map.noticeBody') }}
      </span>
    </aside>
  </main>
</template>

<script>
import { t } from '../i18n.js'
import placeService from '../services/placeService.js'

export default {
  name: 'MuseumMapView',
  data() {
    return {
      selectedPlaceId: 'european-art',
      places: [], // Will be populated from MySQL via API
      selectedLevelId: 'ground',
      levels: [
        {
          id: 'ground',
          name: 'Ground level',
          rooms: [
            {
              placeId: 'european-art',
              mapLabel: 'European Art',
              x: 48,
              y: 43,
              width: 242,
              height: 98,
              connector: 'M169 141V163',
            },
            {
              placeId: 'lockers',
              mapLabel: 'Lockers',
              x: 350,
              y: 220,
              width: 242,
              height: 88,
              connector: 'M471 163V220',
            },
          ],
        },
        {
          id: 'first',
          name: 'First level',
          rooms: [
            {
              placeId: 'danish-golden-age',
              mapLabel: 'Danish Golden Age',
              x: 48,
              y: 43,
              width: 242,
              height: 98,
              connector: 'M169 141V163',
            },
            {
              placeId: 'cafe',
              mapLabel: 'Café',
              x: 350,
              y: 220,
              width: 242,
              height: 88,
              connector: 'M471 163V220',
            },
          ],
        },
        {
          id: 'second',
          name: 'Second level',
          rooms: [
            {
              placeId: 'modern-art',
              mapLabel: 'Modern Art',
              x: 48,
              y: 43,
              width: 242,
              height: 98,
              connector: 'M169 141V163',
            },
            {
              placeId: 'restrooms',
              mapLabel: 'Restrooms',
              x: 350,
              y: 220,
              width: 242,
              height: 88,
              connector: 'M471 163V220',
            },
          ],
        },
      ],
    }
  },
  computed: {
     allPlaces() {
      // Map normalized 3NF database fields to component expectations
      return this.places.map(p => ({
        ...p,
        id: p.place_key,
        mapLabel: p.map_label || p.name,
        // Safely map the normalized Category name
        categoryName: p.Category ? p.Category.category_name : '',
        // Safely map the normalized Floor name from the floors table
        floorName: p.Floor ? p.Floor.floor_name : '',
        // Ensure directions are sorted by step_order
        directionsList: p.Directions ? p.Directions.sort((a, b) => a.step_order - b.step_order) : []
      }))
    },   
    currentLevel() {
      return this.levels.find((level) => level.id === this.selectedLevelId) ?? this.levels[0]
    },
    currentLevelRooms() {
      return this.currentLevel.rooms
        .map((room) => ({
          ...room,
          //it looks for the place in allPlaces which is fetched from MySQL and tries to find a match by ID place_key
          place: this.allPlaces.find((place) => place.id === room.placeId),
        }))
        .filter((room) => room.place) // if no match is found it filters it out so it will not render
    },
    selectedPlace() {
      return this.allPlaces.find(
        (place) => place.id === this.selectedPlaceId,
      )
    },
    // Filter facilities dynamically based on category or key
    facilityList() {
      return this.allPlaces.filter(p => p.categoryName === 'Visitor facility' || ['lockers', 'cafe', 'restrooms'].includes(p.place_key))
    }
  },
  async mounted() {
    try {
      const response = await placeService.getAll()
      this.places = response.data
      
      // If URL has query param, sync it
      if (this.$route.query.place) {
        this.selectedPlaceId = this.$route.query.place
      }
    } catch (error) {
      console.error('Failed to load places from API:', error)
    }
  },
  watch: {
    '$route.query.place': {
      handler(placeId) {
        const place = this.allPlaces.find((item) => item.id === placeId)
        if (place) {
          this.selectedPlaceId = placeId
          const level = this.levels.find((item) =>
            item.rooms.some((room) => room.placeId === placeId),
          )
          if (level) this.selectedLevelId = level.id
        }
      },
    },
  },
  methods: {
    t,
    selectLevel(level) {
      this.selectedLevelId = level.id
      const firstRoom = level.rooms[0]
      const place = this.allPlaces.find((item) => item.id === firstRoom?.placeId)
      if (place) this.selectPlace(place)
    },
    selectPlace(place) {
      this.selectedPlaceId = place.id
      const level = this.levels.find((item) =>
        item.rooms.some((room) => room.placeId === place.id),
      )
      if (level) this.selectedLevelId = level.id
      if (this.$route.query.place !== place.id) {
        this.$router.replace({ query: { ...this.$route.query, place: place.id } })
      }
    },
    activateRoom(event, place) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.selectPlace(place)
      }
    },
  },
}
</script>
