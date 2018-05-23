<template>
  <div id="playlists-menu">
    <v-list dense color="blue" style="background: none;"> 

      <v-list-tile 
        @click="" 
        active-class="selected-playlist"
        :value="true"> 
          <v-list-tile-avatar>
            <v-icon>
              queue_music
            </v-icon>
          </v-list-tile-avatar>
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
        >

        <v-list-tile slot="activator">
          <v-list-tile-avatar>
            <v-icon>
              folder
            </v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>
              {{ group.title }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-for="subItem in group.items" 
          :key="subItem.title" 
          @click="">

          <v-list-tile-avatar>
            <v-icon>
              queue_music
            </v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ subItem.title }}
            </v-list-tile-title>
          </v-list-tile-content>

          <v-spacer></v-spacer>

        </v-list-tile>
      </v-list-group>

    </v-list>
  </div>
</template>

<style lang="stylus">
  #playlists-menu
    .list.list--dense
      padding-top: 0

    .list__tile.list__tile--link,
    .list__group__header
      border: 1px solid rgba(0,0,0,0)
    .theme--dark .list .list__tile--link:hover,
    .theme--dark .list .list__group__header:hover
      border: 1px solid #21A8BF
      background-color: transparent !important
    .list__tile.list__tile--link.list__tile--active.selected-playlist
      background-color: #21A8BF
    // .list__tile.list__tile--link.list__tile--active.selected-playlist:hover
    //   background-color: #21A8BF !important
</style>

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

