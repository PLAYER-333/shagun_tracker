import { create } from 'zustand'
import { supabase } from '../supabaseClient'

const useAppStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────
  user: null,
  profile: null,
  events: [],
  people: [],
  gifts: [],
  loading: false,
  initialized: false,

  // ── Auth ───────────────────────────────────────────
  setUser: (user) => set({ user }),

  initAuth: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null
      set({ user, initialized: true })
      if (user) get().loadAll()
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      set({ user })
      if (user) {
        get().loadAll()
      } else {
        set({ profile: null, events: [], people: [], gifts: [] })
      }
    })
  },

  loadAll: async () => {
    await Promise.all([
      get().loadProfile(),
      get().loadEvents(),
      get().loadPeople(),
      get().loadGifts(),
    ])
  },

  // ── Profile ────────────────────────────────────────
  loadProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    let { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      
    // If the SQL trigger failed to create a profile, create it now
    if (!data) {
      const { data: newProfile } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          full_name: user.user_metadata?.full_name || 'My Family'
        })
        .select()
        .single()
      data = newProfile
    }
    
    if (data) set({ profile: data })
  },

  updateProfile: async (updates) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (!error && data) set({ profile: data })
    return { error }
  },

  // ── Events ─────────────────────────────────────────
  loadEvents: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('event_date', { ascending: false })
    if (data) set({ events: data })
  },

  addEvent: async (eventData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: { message: 'Not authenticated' } }
    const { data, error } = await supabase
      .from('events')
      .insert({ ...eventData, user_id: user.id })
      .select()
      .single()
    if (!error && data) {
      set(state => ({ events: [data, ...state.events] }))
    }
    return { data, error }
  },

  deleteEvent: async (eventId) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)
    if (!error) {
      set(state => ({ events: state.events.filter(e => e.id !== eventId) }))
    }
    return { error }
  },

  // ── People ─────────────────────────────────────────
  loadPeople: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('people')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true })
    if (data) set({ people: data })
  },

  addPerson: async (personData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: { message: 'Not authenticated' } }
    const { data, error } = await supabase
      .from('people')
      .insert({ ...personData, user_id: user.id })
      .select()
      .single()
    if (!error && data) {
      set(state => ({ people: [...state.people, data].sort((a, b) => a.name.localeCompare(b.name)) }))
    }
    return { data, error }
  },

  // ── Gifts ──────────────────────────────────────────
  loadGifts: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('gifts')
      .select('*')
      .eq('user_id', user.id)
      .order('gift_date', { ascending: false })
    if (data) set({ gifts: data })
  },

  addGift: async (giftData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: { message: 'Not authenticated' } }
    const { data, error } = await supabase
      .from('gifts')
      .insert({ ...giftData, user_id: user.id })
      .select()
      .single()
    if (!error && data) {
      set(state => ({ gifts: [data, ...state.gifts] }))
    }
    return { data, error }
  },

  deleteGift: async (giftId) => {
    const { error } = await supabase
      .from('gifts')
      .delete()
      .eq('id', giftId)
    if (!error) {
      set(state => ({ gifts: state.gifts.filter(g => g.id !== giftId) }))
    }
    return { error }
  },

  // ── Auth actions ───────────────────────────────────
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null, events: [], people: [], gifts: [] })
  },
}))

export default useAppStore
