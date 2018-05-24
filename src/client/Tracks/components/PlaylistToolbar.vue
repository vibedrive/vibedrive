<template>
  <v-toolbar dense flat color="grey darken-3">
    <v-menu 
      id="filter-popover"
      transition="slide-y-transition" 
      bottom  
      :close-on-content-click="false"
    >
      <v-btn slot="activator" 

        color="black" 
        :ripple="false"
        small dark depressed>
        <span>
          {{ playlist.filters.length }} filters
        </span>
        <v-icon>
          arrow_drop_down
        </v-icon>
      </v-btn>

      <v-list>
        <template>

          <v-list-tile 
            :id="'filter-' + f.id"
            class="mb-2" 
            v-for="f in playlist.filters" 
            :key="f.id">
            <v-btn small icon class="mr-4" @click="removeFilter(f)" :ripple="false">
              <v-icon small>close</v-icon>
            </v-btn>
            <v-select 
              :items="subjectNames"
              :ripple="false"
              v-model="f.subj"
              color="grey lighten-3" 
              dark flat solo single-line dense
              class="mr-1" 
              style="background-color: #222; width: 200px">
            </v-select>
            <v-select
              :items="f.$type.predicates"
              :ripple="false"
              v-model="f.pred"
              color="grey lighten-3" 
              dark flat solo single-line dense
              style="background-color: #222;"
              class="mx-1">
            </v-select>
            <v-text-field
              color="grey lighten-3" 
              v-model="f.obj"
              dark flat solo single-line dense
              style="width: 140px; background-color: #222;"
              class="ml-1">
            </v-text-field>

          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action>  
              <v-btn small @click="addFilter()" depressed :ripple="false">
                <v-icon small>add</v-icon> 
                <span> Add filter</span>
              </v-btn>
            </v-list-tile-action> 
          </v-list-tile>

        </template>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<style lang="stylus">
  .menu__content.menu__content--select.menu__content--dropdown.menuable__content__active.theme--dark
    margin-top: -50px
</style>


<script>

  export default {
    name: 'PlaylistToolbar',
    props: {
      
    },
    methods: {
      addFilter () {
        var nextIndex = this.playlist.filters.length
        var nextType = this.filterTypes[nextIndex] || this.filterTypes[0]

        var newModel = {
          id: Date.now(),
          subj: nextType.name,
          pred: nextType.predicates[0],
          $type: nextType
        }

        this.playlist.filters.push(newModel)
      },
      removeFilter (f) {
        var index = this.playlist.filters.indexOf(f)

        this.playlist.filters.splice(index, 1)
      }
    },
    data: () => ({
      subjectNames: ['Name', 'BPM', 'Genre'],
      filterTypes: [{
        key: 'name', 
        name: 'Name',
        component: 'text',
        predicates: ['contains']
      },{
        key: 'bpm', 
        name: 'BPM',
        component: 'number',
        predicates: ['is < than', 'is equal to','is > than'], 
      },{
        key: 'genre', 
        name: 'Genre',
        component: 'chips',
        predicates: ['is one of'] 
      }],
      playlist: {
        filters: []
      }
    })
  }
</script>

