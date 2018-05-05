<template>
  <v-list dense> 

    <v-list-tile @click="" >
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

      <v-list-tile v-for="subItem in group.items" :key="subItem.title" @click="">

        <v-list-tile-action>
          <v-icon>star</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>
            {{ subItem.title }}
          </v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-icon></v-icon>
        </v-list-tile-action>
        
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
        title: 'Group',
        items: [
          { title: 'Item A' }, 
          { title: 'Item B' }
        ]
      }]
    })
  }
</script>

