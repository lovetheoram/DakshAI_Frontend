// src/components/learn/ExamReadinessDreamPage.jsx
// DakshAI Student Vocal Learning Content Engine
// Voice-first presentation with text reveal, live equalizer, interactive timebar, and mobile-optimized controls.

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Clock,
  Sliders,
  X,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-react";

export const DEFAULT_VOCAL_LEARNING_SERIES = [
  {
    id: "l-1",
    module: "LLM Architecture",
    title: "Why Transformers Replaced RNNs",
    narration: [
      "Why did Transformer architectures replace Recurrent Neural Networks for processing long context sequences in deep learning?",
      "In traditional RNNs, hidden state updates occurred sequentially token-by-token, causing vanishing gradients over long sequences.",
      "Transformers introduced Scaled Dot-Product Self-Attention, allowing every token to compute attention weights with all other tokens simultaneously."
    ],
    key_takeaway: "Transformers replaced RNNs by using self-attention to compute long-range token relationships in parallel on GPUs."
  }
];

export const DEFAULT_AI_ENGINEERING_SERIES = DEFAULT_VOCAL_LEARNING_SERIES;

// // Varied Intermediate Transition sentence pools to prevent repetitive phrasing across 78+ scenes
const SCENE_ONE_HOOKS = [
  (title) => `अब सबसे पहले सीन में हम समझने वाले हैं — ${title}। चलिए देखते हैं इसकी पूरी कहानी और ज़रूरत!`,
  (title) => `चलिए सबसे पहले सीन की शुरुआत करते हैं — ${title} से। देखते हैं रियल-वर्ल्ड में इसकी क्या ज़रूरत पड़ी!`,
  (title) => `आइए पहले सीन में एक्सप्लोर करते हैं — ${title}। देखते हैं इंजीनियर्स ने इसे कैसे अप्रोच किया!`,
];

const RECAP_BRIDGE_VARIATIONS = [
  (takeaway, title) => `पिछली बार हमने देखा था — ${takeaway}। अब इस अगले सीन में हम समझेंगे — ${title}। चलिए देखते हैं कि अब क्या नया मोड़ आता है!`,
  (takeaway, title) => `अब तक हमने समझा — ${takeaway}। लेकिन अब आगे की चुनौती है — ${title}! आइए इसकी गहराई में उतरते हैं।`,
  (takeaway, title) => `लास्ट सीन का टेकअवे था — ${takeaway}। चलिए अब इससे आगे बढ़ते हैं और देखते हैं — ${title}!`,
  (takeaway, title) => `पिछली गुत्थी हमने सुलझाई कि — ${takeaway}। अब देखते हैं ${title} का असली इंजीनियरिंग खेल!`,
  (takeaway, title) => `अभी तक की कहानी में देखा — ${takeaway}। लेकिन कहानी यहाँ खत्म नहीं होती, अब बात करते हैं — ${title} की!`,
  (takeaway, title) => `पिछला कॉन्सेप्ट याद है ना — ${takeaway}? उसी के आधार पर अब समझते हैं — ${title}!`,
  (takeaway, title) => `पिछले सीन में हमने सीखा — ${takeaway}। अब अगला बड़ा सवाल है — ${title}! आइए देखते हैं।`,
];

const TEACHING_INTENT_HOOKS = [
  "इस सीन में हमारा मेन गोल और इंटेंट यह है कि —",
  "आइए सबसे पहले समझते हैं कि आज हम क्या अचीव करने वाले हैं —",
  "इस टॉपिक को सीखने का हमारा मुख्य मकसद यह है —",
  "यहाँ हमारा मेन लर्निंग गोल यह समझना है —",
  "इस पूरे सेशन की मुख्य थीम यह है —",
  "आइए देखते हैं इस टॉपिक को मास्टर करने की असली वजह —",
];

const NECESSITY_HOOKS = [
  "अब समझते हैं कि आखिर इसकी ज़रूरत क्यों पड़ी —",
  "सोचिए, असल में परेशानी क्या आ रही थी —",
  "आइए देखते हैं कि पुरानी एप्रोच में क्या बड़ी कमी थी —",
  "यहाँ असली मुद्दा यह था कि काम अटूट तरीके से नहीं चल पा रहा था —",
  "पहले यह समझते हैं कि इंजीनियर्स के सामने क्या असली चुनौती थी —",
  "आखिर इस नए तरीके को बनाने की नौबत क्यों आई, इसे ध्यान से सुनिए —",
  "यहाँ सबसे बड़ा सवाल यह उठता है कि क्या पुरानी सिस्टम काफी थी —",
];

const STORY_ANALOGY_HOOKS = [
  "आओ इसे एक बहुत ही सिंपल और रीयल-लाइफ़ मिसाल से इमेजिन करते हैं —",
  "इस बात को समझने के लिए एक छोटी-सी रोज़मर्रा की कहानी देखते हैं —",
  "मान लीजिए आप एक रीयल-लाइफ़ सिचुएशन में हैं —",
  "आइए एक प्रैक्टिकल सिनेरियो से इसे दिमाग में विज़ुअलाइज़ करते हैं —",
  "एक मिनट के लिए सोचिए कि आपकी रियल लाइफ में क्या होता है —",
  "इस बात को एक आसान-सी इंसानियत की मिसाल से समझते हैं —",
  "इमेजिन करिए एक ऐसी स्थिति जहाँ आपको यह डिसीजन लेना है —",
];

const DETAILED_CONCEPT_HOOKS = [
  "अब इसके कोर टेक्निकल कॉन्सेप्ट और इनर वर्किंग को ध्यान से समझते हैं —",
  "आइए अब इसके पीछे की पूरी इंजीनियरिंग और आर्किटेक्चर को ब्रेकडाउन करते हैं —",
  "अब देखते हैं कि सिस्टम के अंदर असल में क्या प्रोसेस चल रही है —",
  "यहाँ टेक्निकल लेवल पर काम कैसे होता है, ध्यान से सुनिए —",
  "आइए अब इसके डिटेल मैकेनिज्म की गहराई में उतरते हैं —",
  "अब इसके सबसे इम्पोर्टेंट इंजीनियरिंग लॉजिक को समझते हैं —",
];

const EXAM_QUESTION_HOOKS = [
  "अब डायरेक्ट इंटरव्यू में आपसे यह सवाल कैसे पूछा जाएगा, यह देखिए —",
  "एग्ज़ामिनर अक्सर इस टॉपिक से ऐसा डायरेक्ट सवाल बनाता है —",
  "अगर आप किसी टॉप टेक इंटरव्यू में बैठे हैं, तो सवाल कुछ ऐसा होगा —",
  "आइए देखते हैं कि इस कांसेप्ट पर सबसे ट्रिकी सवाल क्या बन सकता है —",
  "इंटरव्यू बोर्ड आपसे सीधे यह पूछ सकता है —",
  "एग्ज़ाम रेडीनेस के लिए यह सवाल बहुत ही हाई-यील्ड है —",
];

const KEY_FACT_HOOKS = [
  "और इसका सबसे सॉलिड direct answer और key fact यह है —",
  "इसका एक-लाइन का क्रिस्टल-क्लियर टू-द-पॉइंट जवाब यह होगा —",
  "अगर आपको एक सेंटेंस में बाज़ी मारनी है, तो बस यह याद रखिए —",
  "इसका कोर टेकअवे और सबसे इम्पोर्टेंट फैक्ट यह है —",
  "इंटरव्यू में आपको ठीक यही 100% सटीक जवाब देना है —",
  "इस पूरे कांसेप्ट की सबसे काम की चाबी यही है —",
];

const KEY_TAKEAWAY_HOOKS = [
  "संक्षेप में, इस पूरे सीन की सबसे बड़ी समरी और मास्टर टेकअवे यह है —",
  "याद रखने लायक सबसे काम की पंचलाइन यह है —",
  "इस पूरे डिस्कशन का निचोड़ बस एक लाइन में यह है —",
  "अगर आपको कोई एक बात दिमाग में लॉक करनी है, तो वो यह है —",
  "इस टॉपिक का फाइनल इंजीनियरिंग वर्डिक्ट यह है —",
];

const CHECKIN_VARIATIONS = [
  "यहाँ तक की बात क्लियर है, दोस्त?",
  "क्या यह कॉन्सेप्ट दिमाग में एकदम सेट हो गया?",
  "क्या यहाँ तक की कहानी समझ में आई, दोस्त?",
  "बढ़िया! क्या यहाँ तक सब समझ आ गया?",
  "क्या यह पॉइंट एकदम क्रिस्टल-क्लियर है?",
  "क्या आप आगे बढ़ने के लिए तैयार हैं, दोस्त?",
  "यहाँ तक की लॉजिक समझ आ गई?",
];

export function prepareCompanionStory(rawLessons, subjectName = "AI Engineering") {
  let list = rawLessons;
  if (rawLessons && !Array.isArray(rawLessons) && Array.isArray(rawLessons.scenes)) {
    list = rawLessons.scenes;
  }
  if (!Array.isArray(list) || list.length === 0) {
    list = DEFAULT_VOCAL_LEARNING_SERIES;
  }

  // Pre-calculate takeaways for previous scene recap
  const items = list.map((item, idx) => {
    const titleText = item.title || `Scene ${item.scene_number || idx + 1}`;
    let keyTakeaway = item.key_takeaway || item.takeaway || item.fact || titleText;
    if (keyTakeaway.length > 90) {
      keyTakeaway = keyTakeaway.slice(0, 85).replace(/\s\w+$/, "") + "...";
    }
    return { item, idx, titleText, keyTakeaway };
  });

  // 1. Spoken Intro Session (Scene 0) - Full context setting before Scene 1
  const introScene = {
    id: "scene-intro-0",
    module: "Orientation",
    title: "🚀 Series Orientation & Master Roadmap",
    teaching_intent: `Mastering ${subjectName}`,
    story: "Welcome to the intuitive vocal journey.",
    question: "",
    fact: "",
    narration: [
      `नमस्ते दोस्त! मैं आपका ${subjectName} लर्निंग कंपैनियन हूँ। आज हम मिलकर इस पूरे सब्जेक्ट का सफ़र एक दम इंट्यूटिव और स्टोरी स्टाइल में तय करने वाले हैं।`,
      `यहाँ हम कोई सूखी थ्योरी नहीं रटेंगे। हम देखेंगे कि रियल-वर्ल्ड में इंजीनियर्स कैसे सोचते हैं, कहाँ प्रॉब्लम्स आती हैं, और कैसे नए सॉल्यूशंस जन्म लेते हैं।`,
      `इस पूरी सीरीज़ में कुल ${items.length} सीन्स हैं — जहाँ हम RAG, Transformers, Fine-Tuning, Agents और Production Deployments तक हर कॉन्सेप्ट की गहराई में उतरेंगे।`,
      `हर सीन के बाद हम एक छोटा चेक-इन करेंगे ताकि आपकी समझ एकदम सॉलिड बनी रहे। तोचलिए, पहला सीन शुरू करते हैं!`,
      "क्या आप इस शानदार सफ़र के लिए तैयार हैं, दोस्त?"
    ],
    key_takeaway: `${subjectName} Vocal Learning Journey Overview`
  };

  // 2. Main Content Scenes (Scene 1, 2, etc.)
  const mainScenes = items.map(({ item, idx, titleText, keyTakeaway }) => {
    const rawNarration = Array.isArray(item.narration)
      ? item.narration
      : typeof item.narration === "string"
        ? [item.narration]
        : Array.isArray(item.persona_female)
          ? item.persona_female
          : Array.isArray(item.persona_male)
            ? item.persona_male
            : [];

    const fullNarration = [];

    // Part 1: Topic Context / Memory Bridge Hook
    if (idx === 0) {
      const hookFn = SCENE_ONE_HOOKS[idx % SCENE_ONE_HOOKS.length];
      fullNarration.push(hookFn(titleText));
    } else {
      const prevTakeaway = items[idx - 1].keyTakeaway;
      const bridgeFn = RECAP_BRIDGE_VARIATIONS[idx % RECAP_BRIDGE_VARIATIONS.length];
      fullNarration.push(bridgeFn(prevTakeaway, titleText));
    }

    // Part 2: Teaching Intent
    if (item.teaching_intent) {
      const intentHook = TEACHING_INTENT_HOOKS[(idx + 1) % TEACHING_INTENT_HOOKS.length];
      fullNarration.push(intentHook);
      fullNarration.push(item.teaching_intent);
    }

    // Part 3: Necessity / Real-Life Problem
    if (item.necessity && item.necessity !== item.teaching_intent) {
      const necessityHook = NECESSITY_HOOKS[(idx + 2) % NECESSITY_HOOKS.length];
      fullNarration.push(necessityHook);
      fullNarration.push(item.necessity);
    }

    // Part 4: Real-World Story / Analogy
    if (item.story) {
      const storyHook = STORY_ANALOGY_HOOKS[(idx + 3) % STORY_ANALOGY_HOOKS.length];
      fullNarration.push(storyHook);
      fullNarration.push(item.story);
    }

    // Part 5: Core Detailed Technical Narration Explanation
    if (rawNarration.length > 0) {
      const conceptHook = DETAILED_CONCEPT_HOOKS[(idx + 4) % DETAILED_CONCEPT_HOOKS.length];
      fullNarration.push(conceptHook);
      fullNarration.push(...rawNarration);
    }

    // Part 6: Direct Exam Question
    if (item.question) {
      const examHook = EXAM_QUESTION_HOOKS[(idx + 5) % EXAM_QUESTION_HOOKS.length];
      fullNarration.push(examHook);
      fullNarration.push(item.question);
    }

    // Part 7: High-Yield Key Fact / Direct Answer
    if (item.fact) {
      const factHook = KEY_FACT_HOOKS[(idx + 6) % KEY_FACT_HOOKS.length];
      fullNarration.push(factHook);
      fullNarration.push(item.fact);
    }

    // Part 8: Master Key Takeaway
    if (keyTakeaway && keyTakeaway !== item.fact) {
      const takeawayHook = KEY_TAKEAWAY_HOOKS[(idx + 7) % KEY_TAKEAWAY_HOOKS.length];
      fullNarration.push(takeawayHook);
      fullNarration.push(keyTakeaway);
    }

    // Part 9: Natural Companion Check-In
    const checkInStr = CHECKIN_VARIATIONS[idx % CHECKIN_VARIATIONS.length];
    fullNarration.push(checkInStr);

    return {
      id: item.id || `scene-${item.scene_number || idx + 1}`,
      module: item.module || "Core Material",
      title: titleText,
      teaching_intent: item.teaching_intent || item.necessity || "",
      story: item.story || "",
      question: item.question || "",
      fact: item.fact || "",
      narration: fullNarration,
      key_takeaway: keyTakeaway
    };
  });

  return [introScene, ...mainScenes];
}

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
};

export default function ExamReadinessDreamPage({
  subjectName = "AI Engineering",
  lessons = DEFAULT_VOCAL_LEARNING_SERIES,
  onBack,
}) {
  const personaMode = "female";
  const story = prepareCompanionStory(lessons, subjectName);

  const storageKey = `daksh_vocal_engine_${subjectName.replace(/\s+/g, "_").toLowerCase()}_saved_pos`;
  const savedSceneIdx = parseInt(localStorage.getItem(storageKey) || "0", 10);
  const initialScene = savedSceneIdx >= 0 && savedSceneIdx < story.length ? savedSceneIdx : 0;

  const [sceneIdx, setSceneIdx] = useState(initialScene);
  const [paragraphIdx, setParagraphIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [revealedChars, setRevealedChars] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const [voices, setVoices] = useState([]);
  const [isSwitchingVoice, setIsSwitchingVoice] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const activeUtteranceRef = useRef(null);

  const activeScene = story[sceneIdx] || story[0];
  const activeNarration = activeScene.narration || [];
  const activeText = activeNarration[paragraphIdx] || activeNarration[0] || "";

  // Dynamic duration calculation based on active speechRate
  const fullSceneText = activeNarration.join(" ");
  const totalSeconds = Math.max(3, Math.round((fullSceneText.length * 0.072) / speechRate));
  const sceneProgressPct = Math.min(100, Math.round((elapsedSeconds / Math.max(1, totalSeconds)) * 100));

  // Audio unlock & speaker chime helper for mobile browsers (iOS Safari / Android Chrome)
  const unlockAudioEngine = () => {
    if (typeof window === "undefined") return;

    // 1. Play audible Web Audio API chime to activate phone speaker and verify volume
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5 tone
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.15);
      }
    } catch (e) {
      console.warn("WebAudio unlock error:", e);
    }

    // 2. Unpause Web Speech API queue if stuck
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.resume();
      } catch (e) { }
    }
  };

  useEffect(() => {
    setElapsedSeconds(0);
  }, [sceneIdx]);

  useEffect(() => {
    let timer = null;
    if (isSpeaking && !isPaused) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => (prev < totalSeconds ? prev + 1 : prev));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSpeaking, isPaused, totalSeconds]);

  useEffect(() => {
    const updateVoices = () => {
      if ("speechSynthesis" in window) {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          setVoices(available);
        }
      }
    };
    updateVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, sceneIdx.toString());
  }, [sceneIdx, storageKey]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) { }
      }
    };
  }, []);

  const [spokenText, setSpokenText] = useState("");
  const syncTimerRef = useRef(null);
  const hasBoundaryRef = useRef(false);

  const speakText = (
    text,
    onComplete,
    modeOverride = personaMode,
    rateOverride = speechRate
  ) => {
    if (!("speechSynthesis" in window)) return;
    unlockAudioEngine();

    try {
      window.speechSynthesis.cancel();
    } catch (e) { }

    if (syncTimerRef.current) {
      clearInterval(syncTimerRef.current);
    }

    hasBoundaryRef.current = false;
    setSpokenText(text);
    setIsSpeaking(true);
    setIsPaused(false);
    setRevealedChars(0);

    const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // Detect if text contains Hindi Devanagari script
    const hasHindiChars = /[\u0900-\u097F]/.test(text);

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtteranceRef.current = utterance;

    // Pitch & rate tuned for female voice warmth and clear human articulation
    utterance.pitch = 1.15;
    const effectiveRate = Math.max(0.65, Math.min(1.3, rateOverride * (hasHindiChars ? 0.95 : 0.92)));
    utterance.rate = effectiveRate;
    utterance.lang = hasHindiChars ? "hi-IN" : "en-IN";

    // Select distinct native female voice from available WebSpeech engine pool
    const availableVoices = voices.length > 0 ? voices : (("speechSynthesis" in window) ? window.speechSynthesis.getVoices() : []);
    if (availableVoices.length > 0) {
      const eligibleVoices = availableVoices.filter((v) => {
        const vLang = v.lang.toLowerCase();
        return hasHindiChars
          ? vLang.includes("hi") || vLang.includes("in")
          : vLang.includes("en") || vLang.includes("in");
      });
      const pool = eligibleVoices.length > 0 ? eligibleVoices : availableVoices;

      const targetVoice = pool.find((v) => {
        const name = v.name.toLowerCase();
        return (
          name.includes("female") ||
          name.includes("woman") ||
          name.includes("swara") ||
          name.includes("kalpana") ||
          name.includes("zira") ||
          name.includes("aria") ||
          name.includes("sangeeta") ||
          name.includes("samantha") ||
          name.includes("lekha")
        );
      }) || pool[pool.length - 1];

      if (targetVoice && targetVoice.name) {
        try {
          utterance.voice = targetVoice;
          if (targetVoice.lang) utterance.lang = targetVoice.lang;
        } catch (e) { }
      }
    }

    // 1. Synchronize word-by-word reveal EXACTLY when audio starts playing
    utterance.onstart = () => {
      if (activeUtteranceRef.current !== utterance) return;
      setIsSpeaking(true);
      setIsPaused(false);

      // Reveal first word immediately on audio start
      let firstSpace = text.indexOf(" ");
      setRevealedChars(firstSpace > 0 ? firstSpace : Math.min(text.length, 4));

      // Conversational speech rate calibration:
      // Hindi Devanagari reading speed: ~85ms/char. English reading speed: ~72ms/char.
      const baseMs = hasHindiChars ? 85 : 72;
      const msPerChar = Math.max(18, Math.round(baseMs / effectiveRate));
      let charCounter = firstSpace > 0 ? firstSpace : 4;

      if (syncTimerRef.current) clearInterval(syncTimerRef.current);

      syncTimerRef.current = setInterval(() => {
        if (activeUtteranceRef.current !== utterance) {
          clearInterval(syncTimerRef.current);
          return;
        }
        // If boundary events are active from WebSpeech API, boundary handler will update revealedChars.
        // Otherwise, use calibrated fallback timer.
        if (!hasBoundaryRef.current) {
          setRevealedChars((prev) => {
            if (prev < text.length) {
              return Math.max(prev, charCounter + 1);
            } else {
              clearInterval(syncTimerRef.current);
              return prev;
            }
          });
          charCounter++;
        }
      }, msPerChar);
    };

    // 2. Real-time boundary event to align word position with audio engine output
    utterance.onboundary = (event) => {
      if (activeUtteranceRef.current !== utterance) return;
      hasBoundaryRef.current = true;
      if (typeof event.charIndex === "number" && event.charIndex >= 0) {
        let wordEndPos = event.charIndex + (event.charLength || 1);
        // If event.charLength is missing, scan to next space or punctuation
        if (!event.charLength || event.charLength <= 1) {
          let pos = event.charIndex;
          while (pos < text.length && !/\s|[.,!?।!]/.test(text[pos])) {
            pos++;
          }
          wordEndPos = pos > event.charIndex ? pos : event.charIndex + 1;
        }
        setRevealedChars((prev) => Math.max(prev, Math.min(text.length, wordEndPos)));
      }
    };

    utterance.onend = () => {
      if (activeUtteranceRef.current !== utterance) return;
      if (syncTimerRef.current) clearInterval(syncTimerRef.current);
      setRevealedChars(text.length);
      if (onComplete) {
        onComplete();
      } else {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    };

    utterance.onerror = (err) => {
      console.warn("SpeechSynthesis utterance error:", err);
      if (activeUtteranceRef.current !== utterance) return;
      if (syncTimerRef.current) clearInterval(syncTimerRef.current);
      setRevealedChars(text.length);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    const executeSpeak = () => {
      try {
        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Speech speak error, trying native fallback:", err);
        try {
          const fallbackUtterance = new SpeechSynthesisUtterance(text);
          fallbackUtterance.lang = hasHindiChars ? "hi-IN" : "en-IN";
          fallbackUtterance.onend = () => {
            if (syncTimerRef.current) clearInterval(syncTimerRef.current);
            setRevealedChars(text.length);
            setIsSpeaking(false);
            setIsPaused(false);
          };
          fallbackUtterance.onerror = () => {
            if (syncTimerRef.current) clearInterval(syncTimerRef.current);
            setRevealedChars(text.length);
            setIsSpeaking(false);
            setIsPaused(false);
          };
          window.speechSynthesis.resume();
          window.speechSynthesis.speak(fallbackUtterance);
        } catch (e) {
          setIsSpeaking(false);
          setIsPaused(false);
        }
      }
    };

    if (isMobile) {
      setTimeout(executeSpeak, 50);
    } else {
      executeSpeak();
    }
  };

  const speakCurrentParagraph = (
    sIdx = sceneIdx,
    pIdx = paragraphIdx,
    rate = speechRate,
    modeOverride = personaMode
  ) => {
    const currentScene = story[sIdx];
    if (!currentScene) return;

    const currentNarration = currentScene.narration || [];
    const textToSpeak = currentNarration[pIdx];
    if (!textToSpeak) return;

    setSceneIdx(sIdx);
    setParagraphIdx(pIdx);

    speakText(textToSpeak, () => {
      if (pIdx < currentNarration.length - 1) {
        speakCurrentParagraph(sIdx, pIdx + 1, rate, modeOverride);
      } else {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    }, modeOverride, rate);
  };

  const handleNoResponse = () => {
    unlockAudioEngine();
    if (syncTimerRef.current) clearInterval(syncTimerRef.current);
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch (e) { }
    }
    setElapsedSeconds(0);
    // Restart current scene from paragraph 0
    speakCurrentParagraph(sceneIdx, 0);
  };

  const handleYesResponse = () => {
    unlockAudioEngine();
    if (syncTimerRef.current) clearInterval(syncTimerRef.current);
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch (e) { }
    }

    if (sceneIdx < story.length - 1) {
      setElapsedSeconds(0);
      // Advance to next scene (which begins with Previous Scene Recap)
      speakCurrentParagraph(sceneIdx + 1, 0);
    } else {
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const handleVoiceSwitch = (targetMode) => {
    unlockAudioEngine();
    setIsSwitchingVoice(true);
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch (e) { }
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setRevealedChars(0);
    setPersonaMode(targetMode);

    setTimeout(() => {
      setIsSwitchingVoice(false);
      speakCurrentParagraph(sceneIdx, paragraphIdx, speechRate, targetMode);
    }, 250);
  };

  const handleRateChange = (newRate) => {
    unlockAudioEngine();
    setSpeechRate(newRate);
    if (isSpeaking || isPaused) {
      setIsSpeaking(true);
      setIsPaused(false);
      if ("speechSynthesis" in window) {
        try { window.speechSynthesis.cancel(); } catch (e) { }
      }
      speakCurrentParagraph(sceneIdx, paragraphIdx, newRate, personaMode);
    }
  };

  const handlePlayPause = () => {
    unlockAudioEngine();
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) { }
      setIsPaused(true);
      setIsSpeaking(false);
    } else {
      speakCurrentParagraph(sceneIdx, paragraphIdx, speechRate, personaMode);
    }
  };

  const handleReplay = () => {
    handleNoResponse();
  };

  const handleNextScene = () => {
    handleYesResponse();
  };

  const handlePrevScene = () => {
    unlockAudioEngine();
    if (sceneIdx > 0) {
      if ("speechSynthesis" in window) {
        try { window.speechSynthesis.cancel(); } catch (e) { }
      }
      speakCurrentParagraph(sceneIdx - 1, 0);
    }
  };



  const isFinalParagraph = paragraphIdx === activeNarration.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between overflow-hidden select-none font-sans">

      {/* Background Aura */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] transition-all duration-700 opacity-70 from-purple-950/40 via-black to-black" />

      {/* Top Header Bar */}
      <div className="relative z-20 shrink-0 px-3 py-2.5 border-b border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-between gap-2">
        {/* Left: Exit Engine */}
        <button
          onClick={() => {
            if ("speechSynthesis" in window) window.speechSynthesis.cancel();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-xl border border-white/10 shrink-0"
          title="Exit Scene View"
        >
          <ArrowLeft size={16} />
          <span className="hidden xs:inline">Exit</span>
        </button>

        {/* Center: Subject Name Only */}
        <div className="text-center truncate px-2 min-w-0 flex-1">
          <h1 className="text-xs sm:text-sm font-black text-gray-100 tracking-wide truncate">
            {subjectName}
          </h1>
        </div>

        {/* Right: Scene Badge & Options Dropdown Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-extrabold text-amber-300 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 whitespace-nowrap">
            {sceneIdx === 0 ? "Intro Session 🚀" : `Scene ${sceneIdx}/${story.length - 1}`}
          </span>

          <button
            onClick={() => setShowOptions(!showOptions)}
            className={`p-1.5 rounded-xl transition-all cursor-pointer border ${showOptions
              ? "bg-amber-400 text-slate-950 border-amber-300"
              : "bg-white/10 hover:bg-white/20 text-gray-200 border-white/10"
              }`}
            title="Audio & Voice Options"
          >
            <Sliders size={16} />
          </button>
        </div>
      </div>

      {/* Options Dropdown Popover */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-14 right-3 z-30 w-72 p-4 rounded-2xl bg-zinc-900/95 border border-white/20 shadow-2xl backdrop-blur-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Volume2 size={14} />
                Audio Settings
              </span>
              <button
                onClick={() => setShowOptions(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X size={14} />
              </button>
            </div>

            {/* Playback Speed */}
            <div>
              <label className="text-[10px] font-extrabold uppercase text-gray-400 block mb-1.5 tracking-wider">
                Playback Speed
              </label>
              <div className="flex items-center justify-between gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                {[0.5, 0.75, 1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleRateChange(rate)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${speechRate === rate
                      ? "bg-purple-400 text-slate-950 shadow-md"
                      : "text-gray-400 hover:text-white"
                      }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene Title Block Below Header */}
      <div className="relative z-10 shrink-0 w-full px-4 pt-3 pb-1 text-center bg-black/40">
        <h2 className="text-sm sm:text-lg font-black text-white tracking-wide leading-snug max-w-xl mx-auto line-clamp-2 drop-shadow-sm">
          {activeScene.title}
        </h2>
      </div>

      {/* Intro Companion Modal Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          >
            <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-zinc-900/95 border border-amber-500/30 shadow-2xl space-y-6 text-center overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-30 bg-purple-500" />

              {/* Companion Avatar Icon */}
              <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-1 shadow-2xl flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-4xl shadow-inner">
                  👧
                </div>
              </div>

              {/* Title & Narrative Vision Description */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  DakshAI Voice Companion
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide pt-1">
                  {subjectName}
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto font-medium leading-relaxed pt-1">
                  Namaste! Main aapka AI Engineering learning companion hoon. Standard textbook lectures ke bajaye, hum continuous real-world situations, problem intuition, aur direct engineering reveals ke through sikhate hain.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setShowIntro(false);
                  unlockAudioEngine();
                  speakCurrentParagraph(sceneIdx, 0);
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 ring-4 ring-amber-400/20"
              >
                <Play size={18} className="fill-current ml-0.5" />
                <span>Start Audio Journey 🎧</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Spoken Text & Soundwave Stage */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 py-4 flex flex-col items-center justify-between max-w-3xl mx-auto w-full my-auto">

        {/* Spoken Text Reveal */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${sceneIdx}-${paragraphIdx}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-center space-y-3 max-h-[240px] overflow-y-auto w-full px-2 py-2 my-auto"
          >
              {/* Contextual Narrative Badge Header */}
              {activeText.includes("लर्निंग कंपैनियन") || activeText.includes("सफ़र") ? (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs">
                  <span>🚀 Orientation & Master Roadmap</span>
                </div>
              ) : activeText.includes("सबसे पहले सीन") || activeText.includes("सीन में हम समझे") || activeText.includes("शुरुआत करते हैं") || activeText.includes("अगला बड़ा सवाल") ? (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs">
                  <span>🎯 Topic Context</span>
                </div>
              ) : activeText.includes("पिछली बार") || activeText.includes("लास्ट सीन") || activeText.includes("पिछली गुत्थी") || activeText.includes("अभी तक की कहानी") ? (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-xs">
                  <span>🔄 Memory Bridge</span>
                </div>
              ) : activeText.includes("ज़रूरत") || activeText.includes("परेशानी") || activeText.includes("कमी थी") || activeText.includes("असली मुद्दा") || activeText.includes("असली चुनौती") || activeText.includes("नौबत") || activeText.includes("पुरानी सिस्टम") ? (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs">
                  <span>💡 Necessity & Intent</span>
                </div>
              ) : activeText.includes("मिसाल") || activeText.includes("कहानी") || activeText.includes("सिचुएशन") || activeText.includes("सिनेरियो") || activeText.includes("इमेजिन") ? (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-xs">
                  <span>📖 Intuitive Analogy</span>
                </div>
              ) : activeText.includes("इंटरव्यू") || activeText.includes("सवाल") || activeText.includes("एग्ज़ामिनर") || activeText.includes("ट्रिकी") ? (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs">
                  <span>❓ Direct Exam Question</span>
                </div>
              ) : activeText.includes("direct answer") || activeText.includes("क्रिस्टल-क्लियर") || activeText.includes("बाज़ी") || activeText.includes("टेकअवे") || activeText.includes("सटीक जवाब") || activeText.includes("चाबी") ? (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs">
                  <span>⚡ High-Yield Key Fact</span>
                </div>
              ) : activeText.includes("क्लियर है") || activeText.includes("तैयार हैं") || activeText.includes("सेट हो गया") ? (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs">
                  <span>💬 Companion Check-In</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10">
                  <span>🧠 Concept Reveal</span>
                </div>
              )}

              <p className={`text-base sm:text-lg font-medium leading-relaxed tracking-wide select-text mt-2 ${activeText.includes("पिछली बार")
                ? "text-indigo-200 font-medium text-sm sm:text-base"
                : activeText.includes("क्लियर है")
                  ? "text-amber-200 font-bold text-base sm:text-lg"
                  : "text-gray-100"
                }`}>
                {activeText.slice(0, revealedChars)}
                {revealedChars < activeText.length && (
                  <span className="inline-block w-1.5 h-4 ml-1 animate-pulse align-middle bg-purple-400" />
                )}
              </p>
            </motion.div>
        </AnimatePresence>

        {/* Dynamic Soundwave Equalizer */}
        <div className="flex items-center justify-center gap-1.5 h-8 mt-4 mb-2 shrink-0">
          {[40, 75, 100, 65, 95, 50, 85, 60, 90, 45, 70].map((h, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.6)]"
              animate={{
                height: isSpeaking && !isPaused ? [`${h * 0.25}%`, `${h}%`, `${h * 0.35}%`] : "6px",
              }}
              transition={{
                duration: 0.55,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.06,
              }}
            />
          ))}
        </div>

        {/* Natural Companion Check-In Modal */}
        <AnimatePresence>
          {isFinalParagraph && !isSpeaking && !isPaused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-900 border border-amber-500/40 shadow-2xl text-center space-y-3 w-full max-w-md mx-auto shrink-0"
            >
              <div className="flex items-center justify-center gap-2 text-amber-300 font-black text-xs sm:text-base">
                <span>💬 Yahan tak clear hai, दोस्त?</span>
              </div>

              {/* Conversational Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {/* Replay Scene */}
                <button
                  onClick={handleNoResponse}
                  className="py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-105"
                  title="Ruko, phir se batao"
                >
                  <RotateCcw size={14} />
                  <span>Ruko, Phir Se Batao ↺</span>
                </button>

                {/* Advance to Next Scene */}
                <button
                  onClick={handleYesResponse}
                  className="py-2.5 px-3 rounded-xl font-black text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5 hover:scale-105 bg-purple-500 hover:bg-purple-400 text-white"
                  title="Haan, chalo aage"
                >
                  <ThumbsUp size={14} />
                  <span>Haan, Chalo Aage! →</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Control Bar with Audio Progress Time Bar */}
      <div className="relative z-10 shrink-0 px-4 py-3 bg-black/95 backdrop-blur-xl border-t border-white/10 flex flex-col items-center gap-2 max-w-3xl mx-auto w-full rounded-t-2xl shadow-2xl">

        {/* Visual Audio Time Progress Bar */}
        <div className="w-full">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1">
            <span className="flex items-center gap-1">
              <Clock size={10} className={isSpeaking && !isPaused ? "animate-spin text-amber-400" : "text-amber-400"} />
              {formatTime(elapsedSeconds)}
            </span>
            <span className="text-amber-300/80 font-bold">{formatTime(totalSeconds)}</span>
          </div>
          <div
            className="relative w-full h-2 rounded-full bg-white/15 overflow-hidden"
          >
            <div
              className="h-full transition-all duration-200 bg-gradient-to-r from-purple-500 via-pink-400 to-amber-300 shadow-[0_0_8px_rgba(232,121,249,0.8)]"
              style={{ width: `${sceneProgressPct}%` }}
            />
          </div>
        </div>

        {/* Centralized Traversal & Play Controls */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 w-full pt-1">
          {/* Previous Scene Button */}
          <button
            onClick={handlePrevScene}
            disabled={sceneIdx === 0}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 disabled:opacity-30 transition-all cursor-pointer border border-white/10 flex items-center justify-center"
            title="Previous Scene"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Main Play / Pause Button */}
          <button
            onClick={handlePlayPause}
            className={`px-6 py-2.5 rounded-2xl text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-all hover:scale-105 cursor-pointer min-w-[140px] justify-center ${isSpeaking
              ? "bg-purple-400 hover:bg-purple-300"
              : isPaused
                ? "bg-amber-400 hover:bg-amber-300"
                : "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:scale-105 ring-4 ring-amber-400/30 animate-pulse"
              }`}
          >
            {isSpeaking ? (
              <>
                <Pause size={18} className="fill-current" />
                <span>Pause</span>
              </>
            ) : isPaused ? (
              <>
                <Play size={18} className="fill-current ml-0.5" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Play size={18} className="fill-current ml-0.5" />
                <span>Tap to Listen 🔊</span>
              </>
            )}
          </button>

          {/* Next Scene Button */}
          <button
            onClick={handleNextScene}
            disabled={sceneIdx === story.length - 1}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 disabled:opacity-30 transition-all cursor-pointer border border-white/10 flex items-center justify-center"
            title="Next Scene"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
