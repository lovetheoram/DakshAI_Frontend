// src/intelligence/observer/ObserverEngine.js
// Observes behavioral signals by subscribing to EventTracker's local pub/sub.
// Builds a snapshot of what is happening right now — no timers, no polling.
// Purely reactive: evaluates on every behavior event.

import EventTracker from "../events/EventTracker";

class ObserverEngine {
  constructor() {
    this._snapshot = this._defaultSnapshot();
    this._pageStartTime = Date.now();
    this._lastActivityTime = Date.now();
    this._recentEvents = [];           // rolling 120s window
    this._sessionEventCount = 0;       // total events this session
    this._sessionInterventionCount = 0;
    this._lastSpokeAt = null;          // timestamp of last Daksh intervention
    this._userJustDismissed = false;
    this._dismissedAt = null;
    this._unsubscribe = null;
    this._onEvaluate = null;           // callback → set by whoever needs evaluation results
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────

  /**
   * Start observing. Called once at app startup (in MindModelContext).
   * @param {Function} onEvaluate — called with ObservationSnapshot after each event
   */
  start(onEvaluate) {
    this._onEvaluate = onEvaluate;
    this._unsubscribe = EventTracker.subscribe((eventType, metadata) => {
      this._onBehaviorEvent(eventType, metadata);
    });
  }

  stop() {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
  }

  // ── Route change notification ─────────────────────────────────────────────

  /**
   * Call this on every route change (from MindModelContext's location listener).
   * Resets page-level timers and fires PAGE_VIEW event to trigger OIDPI evaluation.
   */
  onRouteChange(newPath) {
    this._pageStartTime = Date.now();
    this._lastActivityTime = Date.now();
    this._snapshot.page = newPath;
    this._snapshot.timeOnPageSeconds = 0;
    this._snapshot.scrollDepthPercent = 0;
    this._onBehaviorEvent("PAGE_VIEW", { page: newPath });
  }

  // ── External state setters ───────────────────────────────────────────────

  /** Call when user updates scroll position */
  setScrollDepth(percent) {
    const prev = this._snapshot.scrollDepthPercent || 0;
    this._snapshot.scrollDepthPercent = Math.max(prev, percent);
    this._lastActivityTime = Date.now();

    // Trigger evaluation on significant scroll threshold milestones (25%, 50%, 75%, 90%)
    if (Math.floor(percent / 25) > Math.floor(prev / 25)) {
      this._onBehaviorEvent("SCROLL_DEPTH", { percent });
    }
  }

  /** Call when Daksh intervention was shown */
  recordIntervention() {
    this._lastSpokeAt = Date.now();
    this._sessionInterventionCount += 1;
  }

  /** Call when user dismisses Daksh */
  recordDismissal() {
    this._userJustDismissed = true;
    this._dismissedAt = Date.now();
    // Clear dismissal block after 10 seconds so user can experience guidance on next page
    setTimeout(() => { this._userJustDismissed = false; }, 10 * 1000);
  }

  /** Inject MindProfile data from MindModelContext */
  /** Inject MindProfile data from MindModelContext */
  setMindProfile(profile) {
    this._snapshot.confidence = profile?.confidence_score ?? 0.5;
    this._snapshot.momentum = profile?.momentum_direction ?? "steady";
    this._snapshot.currentState = profile?.current_state ?? "on_track";
    this._snapshot.fearAreas = profile?.fear_areas ?? [];
    this._snapshot.accountAgeDays = profile?.account_age_days ?? 0;
    this._snapshot.isNewUser = !profile || (profile.account_age_days ?? 0) <= 3;
  }

  /** Inject today's diary data */
  setTodayDiary(entry) {
    this._snapshot.todayEnergy = entry?.energy_score ?? null;
    this._snapshot.todayEnergyLogged = entry != null;
  }

  // ── Core event handler ───────────────────────────────────────────────────

  _onBehaviorEvent(eventType, metadata) {
    const now = Date.now();

    // Update last activity
    this._lastActivityTime = now;
    this._sessionEventCount += 1;

    // Rolling 120s event window (for inFlow detection)
    this._recentEvents.push({ eventType, ts: now });
    this._recentEvents = this._recentEvents.filter(e => now - e.ts < 120_000);

    // Derive snapshot fields
    this._snapshot = this._buildSnapshot(now, eventType, metadata);

    // Debounce evaluation by 400ms for rapid clicking (<1s apart)
    // When a user clicks multiple topics/tabs quickly, wait for them to land before evaluating
    if (this._evalDebounceTimer) {
      clearTimeout(this._evalDebounceTimer);
    }

    const debounceDelay = eventType === "PAGE_VIEW" ? 100 : 250;

    this._evalDebounceTimer = setTimeout(() => {
      if (this._onEvaluate) {
        try { this._onEvaluate(this._snapshot, eventType, metadata); } catch (_) {}
      }
    }, debounceDelay);
  }

  // ── Snapshot builder ─────────────────────────────────────────────────────

  _buildSnapshot(now, lastEventType, lastEventMeta) {
    const timeOnPageMs = now - this._pageStartTime;
    const idleMs = now - this._lastActivityTime;

    // inFlow: 3+ events in the last 120 seconds
    const inFlow = this._recentEvents.length >= 3;

    // Recent burst in last 10s (rapid navigation = exploring, not stuck)
    const recentBurst = this._recentEvents.filter(e => now - e.ts < 10_000).length;

    // Minutes since Daksh last spoke
    const lastSpokeMinutesAgo = this._lastSpokeAt
      ? Math.floor((now - this._lastSpokeAt) / 60_000)
      : 999;

    // Random initial silence offset (0 - 20%) generated once per session
    if (this._snapshot._randomInitialSilence === undefined) {
      this._snapshot._randomInitialSilence = Math.floor(Math.random() * 21); // 0 to 20
    }

    return {
      // Time signals
      timeOnPageSeconds: Math.floor(timeOnPageMs / 1000),
      idleSeconds: Math.floor(idleMs / 1000),

      // Interaction signals
      inFlow,
      recentEventCount: recentBurst,
      eventWindowSeconds: 10,
      scrollDepthPercent: this._snapshot.scrollDepthPercent ?? 0,

      // Session signals
      sessionEventCount: this._sessionEventCount,
      sessionInterventionCount: this._sessionInterventionCount,
      lastSpokeMinutesAgo,
      userJustDismissed: this._userJustDismissed,
      _randomInitialSilence: this._snapshot._randomInitialSilence,

      // Current event
      lastEvent: lastEventType,
      lastEventMeta: lastEventMeta ?? {},

      // Current page
      page: this._snapshot.page ?? "/",

      // MindProfile signals & user age
      confidence: this._snapshot.confidence ?? 0.5,
      momentum: this._snapshot.momentum ?? "steady",
      currentState: this._snapshot.currentState ?? "on_track",
      fearAreas: this._snapshot.fearAreas ?? [],
      isNewUser: this._snapshot.isNewUser ?? true,
      accountAgeDays: this._snapshot.accountAgeDays ?? 0,

      // Diary signals
      todayEnergy: this._snapshot.todayEnergy ?? null,
      todayEnergyLogged: this._snapshot.todayEnergyLogged ?? false,
    };
  }

  // ── Public snapshot accessor ─────────────────────────────────────────────

  /** Returns the most recent snapshot without triggering evaluation */
  snapshot() {
    return { ...this._snapshot };
  }

  // ── Internal helpers ─────────────────────────────────────────────────────

  _defaultSnapshot() {
    return {
      page: "/",
      timeOnPageSeconds: 0,
      idleSeconds: 0,
      inFlow: false,
      recentEventCount: 0,
      eventWindowSeconds: 10,
      scrollDepthPercent: 0,
      sessionEventCount: 0,
      sessionInterventionCount: 0,
      lastSpokeMinutesAgo: 999,
      userJustDismissed: false,
      _randomInitialSilence: Math.floor(Math.random() * 21),
      lastEvent: null,
      lastEventMeta: {},
      confidence: 0.5,
      momentum: "steady",
      currentState: "on_track",
      fearAreas: [],
      isNewUser: true,
      accountAgeDays: 0,
      todayEnergy: null,
      todayEnergyLogged: false,
    };
  }
}

// Singleton — shared across the entire app
const observerEngine = new ObserverEngine();
export default observerEngine;
