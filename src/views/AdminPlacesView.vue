<script setup>
import { ref, onMounted } from 'vue'
import placeService from '../services/placeService.js'

// State
const places = ref([])
const categories = ref([])
const floors = ref([])

// 3NF-compliant form state (using foreign IDs instead of text fields)
const form = ref({ 
  place_key: '', 
  name: '', 
  map_label: '', 
  category_id: '', 
  floor_id: '', 
  description: '' 
})
const isEditing = ref(false)
const currentId = ref(null)

// 1. READ (Fetch all places, categories, and floors on load)
const loadData = async () => {
  try {
    const [placesRes, categoriesRes, floorsRes] = await Promise.all([
      placeService.getAll(),
      placeService.getCategories ? placeService.getCategories() : Promise.resolve({ data: [{ category_id: 1, category_name: 'Collection zone' }, { category_id: 2, category_name: 'Visitor facility' }] }),
      placeService.getFloors ? placeService.getFloors() : Promise.resolve({ data: [{ floor_id: 1, floor_name: 'Ground level' }, { floor_id: 2, floor_name: 'First level' }, { floor_id: 3, floor_name: 'Second level' }] })
    ])
    places.value = placesRes.data
    categories.value = categoriesRes.data
    floors.value = floorsRes.data
  } catch (error) {
    console.error('Error fetching admin data:', error)
  }
}

onMounted(() => {
  loadData()
})

// 2. CREATE or UPDATE Form Submit
const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await placeService.update(currentId.value, form.value)
    } else {
      await placeService.create(form.value)
    }
    resetForm()
    loadData()
  } catch (error) {
    console.error('Error saving place:', error)
  }
}

// 3. EDIT (Load item data into form)
const editPlace = (place) => {
  isEditing.value = true
  currentId.value = place.place_id
  form.value = { 
    place_key: place.place_key,
    name: place.name,
    map_label: place.map_label,
    category_id: place.category_id,
    floor_id: place.floor_id,
    description: place.description
  }
}

// 4. DELETE
const deletePlace = async (id) => {
  if (confirm('Are you sure you want to delete this place?')) {
    try {
      await placeService.delete(id)
      loadData()
    } catch (error) {
      console.error('Error deleting place:', error)
    }
  }
}

const resetForm = () => {
  isEditing.value = false
  currentId.value = null
  form.value = { place_key: '', name: '', map_label: '', category_id: '', floor_id: '', description: '' }
}
</script>

<template>
  <div class="admin-container" style="padding: 2rem;">
    <h1>Admin Management Dashboard (CRUD)</h1>
    
    <!-- Form for Create / Update -->
    <form @submit.prevent="handleSubmit" style="margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.5rem; max-width: 400px;">
      <h3>{{ isEditing ? 'Edit Place' : 'Add New Place' }}</h3>
      
      <input v-model="form.place_key" placeholder="Place key (e.g. sculpture-hall)" required />
      <input v-model="form.name" placeholder="Name" required />
      <input v-model="form.map_label" placeholder="Map Label" required />
      
      <!-- Category Dropdown (3NF Foreign Key) -->
      <select v-model="form.category_id" required>
        <option disabled value="">Select Category</option>
        <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">
          {{ cat.category_name }}
        </option>
      </select>

      <!-- Floor Dropdown (3NF Foreign Key replacing location text) -->
      <select v-model="form.floor_id" required>
        <option disabled value="">Select Floor Level</option>
        <option v-for="floor in floors" :key="floor.floor_id" :value="floor.floor_id">
          {{ floor.floor_name }}
        </option>
      </select>

      <input v-model="form.description" placeholder="Description" required />
      
      <button type="submit">{{ isEditing ? 'Update' : 'Create' }}</button>
      <button type="button" v-if="isEditing" @click="resetForm">Cancel</button>
    </form>

    <!-- Table for Read & Delete/Edit Triggers -->
    <table border="1" cellpadding="10" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Key</th>
          <th>Name</th>
          <th>Category</th>
          <th>Floor</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="place in places" :key="place.place_id">
          <td>{{ place.place_id }}</td>
          <td>{{ place.place_key }}</td>
          <td>{{ place.name }}</td>
          <td>{{ place.Category ? place.Category.category_name : 'N/A' }}</td>
          <td>{{ place.Floor ? place.Floor.floor_name : 'N/A' }}</td>
          <td>
            <button @click="editPlace(place)">Edit</button>
            <button @click="deletePlace(place.place_id)" style="color: red; margin-left: 5px;">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
