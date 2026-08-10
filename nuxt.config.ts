// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      // Polyfills for old signage browsers (e.g. Yodeck / Chromium < 93).
      // Runs before the app bundle since it's an inline classic script in <head>.
      script: [
        {
          tagPosition: 'head',
          tagPriority: 'critical',
          innerHTML: [
            "if(!Object.hasOwn){Object.defineProperty(Object,'hasOwn',{configurable:true,writable:true,value:function(o,p){if(o==null){throw new TypeError('Cannot convert undefined or null to object')}return Object.prototype.hasOwnProperty.call(Object(o),p)}})}",
            "if(!Array.prototype.at){Object.defineProperty(Array.prototype,'at',{configurable:true,writable:true,value:function(n){n=Math.trunc(n)||0;if(n<0)n+=this.length;return(n<0||n>=this.length)?undefined:this[n]}})}"
          ].join('')
        }
      ]
    }
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    'nuxt-vue3-google-signin',
    '@nuxt/image'
  ],

  devtools: {
    enabled: true
  },

  colorMode: {
    preference: 'light'
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_BASE_URL,
    }
  },

  googleSignIn: {
    clientId: process.env.GOOGLE_CLIENT_ID
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})