<template>
  <v-list dense color="blue" style="background: none;"> 

    <v-list-tile @click="">
      <v-list-tile-content>
        <v-list-tile-title>
          All tracks
        </v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-group
      v-for="group in groups"
      v-model="group.active"
      :key="group.title"
      :prepend-icon="group.action"
      no-action>

      <v-list-tile slot="activator">
        <v-list-tile-content>
          <v-list-tile-title>
            {{ group.title }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile v-for="subItem in group.items" 
        :key="subItem.title" 
        @click="">

        <v-list-tile-content>
          <v-list-tile-title>
            {{ subItem.title }}
          </v-list-tile-title>
        </v-list-tile-content>

        <v-spacer></v-spacer>

      </v-list-tile>
    </v-list-group>

  </v-list>
</template>

<script>
  export default {
    name: 'PlaylistsMenu',
    props: {
      
    },
    data: () => ({
      groups: [{
        active: true,
        title: 'Podcast Playlists',
        items: [
          { title: 'Untrapped', tags: ['Trap', 'Hip Hop'] }, 
          { title: 'Impossible Illusions', tags: ['Techno', 'Dub', 'Electro'] }, 
          { title: 'Headphone Grooves', tags: ['Disco', 'House', 'Funk'] }, 
          { title: 'Tiny Dreamworlds', tags: ['Future', 'Chill', 'Experimental'] }, 
          { title: 'All Systems Online', tags: ['8-bit', 'Electro', 'House'] }, 
          { title: 'This Raw Self', tags: ['Whatever I feel like'] }
        ]
      }]
    })
  }
</script>

