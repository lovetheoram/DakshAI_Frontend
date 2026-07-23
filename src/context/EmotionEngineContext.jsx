// src/context/EmotionEngineContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { SoundManager } from "../utils/SoundManager";
import {
  GREETING_PACKS,
  QUIZ_FEEDBACK_PACKS,
  CURIOSITY_CARDS,
  IDENTITY_TITLES,
  getRandomMessage,
} from "../utils/emotionPacks";

export const EmotionEngineContext = createContext();

export function EmotionEngineProvider({ children }) {
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    return localStorage.getItem("daksh_sound_enabled") !== "false";
  });

  const [unlockedTitleIds, setUnlockedTitleIds] = useState(() => {
    const saved = localStorage.getItem("daksh_unlocked_titles");
    return saved ? JSON.parse(saved) : ["scholar"];
  });

  const [activeCelebration, setActiveCelebration] = useState(null);

  const setSoundEnabled = (val) => {
    setSoundEnabledState(val);
    localStorage.setItem("daksh_sound_enabled", val ? "true" : "false");
  };

  const playSound = (soundType) => {
    if (!soundEnabled) return;
    if (soundType === "click") SoundManager.playSoftClick();
    if (soundType === "chime") SoundManager.playChime();
    if (soundType === "unlock") SoundManager.playMagicUnlock();
  };

  // Evaluate user stats against Identity Title unlocks
  const checkMilestoneUnlocks = (userStats = {}) => {
    const newlyUnlocked = [];

    IDENTITY_TITLES.forEach((item) => {
      if (!unlockedTitleIds.includes(item.id)) {
        if (item.checkUnlock(userStats)) {
          newlyUnlocked.push(item);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      const updatedIds = [...unlockedTitleIds, ...newlyUnlocked.map((i) => i.id)];
      setUnlockedTitleIds(updatedIds);
      localStorage.setItem("daksh_unlocked_titles", JSON.stringify(updatedIds));

      // Trigger magic unlock celebration
      const firstNew = newlyUnlocked[0];
      triggerCelebration({
        type: "IDENTITY_UNLOCKED",
        title: `Unlocked Identity: ${firstNew.icon} ${firstNew.title}`,
        subtitle: `${firstNew.description} — ${firstNew.themeName} is now available!`,
        sound: "unlock",
      });
    }
  };

  const triggerCelebration = ({ type, title, subtitle, sound = "chime" }) => {
    playSound(sound);
    setActiveCelebration({ type, title, subtitle });
    setTimeout(() => setActiveCelebration(null), 4000);
  };

  // Event Driven Trigger API
  const trigger = (eventType, payload = {}) => {
    switch (eventType) {
      case "CHAPTER_COMPLETED":
        triggerCelebration({
          type: "CHAPTER_COMPLETED",
          title: `🌟 Chapter Mastered: ${payload.conceptName || "Concept"}!`,
          subtitle: "Awesome work. You've strengthened your knowledge foundation.",
          sound: "chime",
        });
        break;
      case "MISSION_COMPLETED":
        triggerCelebration({
          type: "MISSION_COMPLETED",
          title: "🎯 Daily Mission Complete!",
          subtitle: "Today's goal hit. Everything beyond is bonus momentum.",
          sound: "chime",
        });
        break;
      case "STREAK_MILESTONE":
        triggerCelebration({
          type: "STREAK_MILESTONE",
          title: `🔥 ${payload.days || 7}-Day Streak Reached!`,
          subtitle: "Consistency is becoming your superpower.",
          sound: "unlock",
        });
        break;
      case "BUTTON_CLICK":
        playSound("click");
        break;
      default:
        break;
    }
  };

  const getGreetingMessage = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return getRandomMessage(GREETING_PACKS.morning);
    if (hrs < 17) return getRandomMessage(GREETING_PACKS.afternoon);
    return getRandomMessage(GREETING_PACKS.evening);
  };

  const getQuizFeedbackMessage = (scorePercent) => {
    if (scorePercent >= 90) return getRandomMessage(QUIZ_FEEDBACK_PACKS.perfect);
    if (scorePercent >= 60) return getRandomMessage(QUIZ_FEEDBACK_PACKS.good);
    return getRandomMessage(QUIZ_FEEDBACK_PACKS.tough);
  };

  const getRandomCuriosity = (topicName = "") => {
    const match = CURIOSITY_CARDS.find((c) =>
      c.topic.toLowerCase().includes(topicName.toLowerCase())
    );
    if (match) return match.fact;
    const idx = Math.floor(Math.random() * CURIOSITY_CARDS.length);
    return CURIOSITY_CARDS[idx].fact;
  };

  return (
    <EmotionEngineContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        playSound,
        IDENTITY_TITLES,
        unlockedTitleIds,
        checkMilestoneUnlocks,
        trigger,
        triggerCelebration,
        activeCelebration,
        getGreetingMessage,
        getQuizFeedbackMessage,
        getRandomCuriosity,
      }}
    >
      {children}
    </EmotionEngineContext.Provider>
  );
}

export function useEmotionEngine() {
  return useContext(EmotionEngineContext);
}
