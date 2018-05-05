import Vue from 'vue'

Vue.filter('toMB', value => (value / (1000 * 1000)).toFixed(2))
