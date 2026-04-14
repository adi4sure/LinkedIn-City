/**
 * useLinkedInData.js — LinkedInCity
 * Generates deterministic LinkedIn activity data based on username.
 * Since LinkedIn has no public contributions API, we generate realistic
 * activity data seeded by the username for consistent results.
 */

import { useState, useCallback } from "react";
import { normaliseContributions } from "../utils/dataUtils";

// Deterministic pseudo-random number generator
function seededRng(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = ((s << 5) - s + seed.charCodeAt(i)) | 0;
  }
  s = ((s % 2147483647) + 2147483647) % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Generate realistic LinkedIn activity patterns
function generateLinkedInActivity(username) {
  const rand = seededRng(username);
  const days = [];
  const now = new Date();
  const start = new Date(now);
  start.setFullYear(start.getFullYear() - 1);
  start.setDate(start.getDate() - start.getDay()); // align to Sunday

  // User "personality" traits derived from username
  const activityLevel = 0.3 + rand() * 0.5; // 0.3-0.8 base activity
  const weekdayBias = 0.6 + rand() * 0.3; // higher = more weekday activity
  const consistencyFactor = 0.4 + rand() * 0.4;
  const burstiness = rand() * 0.6; // chance of high-activity bursts

  // Simulate seasonal patterns
  const peakMonths = [
    Math.floor(rand() * 3), // Q1 peak
    3 + Math.floor(rand() * 3), // Q2 peak
  ];

  for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    const dow = d.getDay(); // 0=Sun, 6=Sat
    const month = d.getMonth();
    const weekOfYear = Math.floor((d - start) / (7 * 86400000));

    // Base activity probability
    let prob = activityLevel;

    // Weekday boost (LinkedIn is more active on weekdays)
    if (dow >= 1 && dow <= 5) {
      prob *= (1 + weekdayBias * 0.5);
    } else {
      prob *= (1 - weekdayBias * 0.4);
    }

    // Seasonal variation
    const monthFactor = peakMonths.includes(month) ? 1.4 : 0.85;
    prob *= monthFactor;

    // Consistency waves (some weeks are busier)
    const waveFactor = 0.7 + Math.sin(weekOfYear * 0.3 + rand() * Math.PI) * 0.3 * consistencyFactor;
    prob *= waveFactor;

    // Holiday/vacation dips (random quiet periods)
    if (rand() < 0.02) prob *= 0.1; // occasional off days

    // Generate activity count
    let count = 0;
    if (rand() < prob) {
      // Base activities: posts, comments, reactions
      count = Math.floor(1 + rand() * 4);

      // Burst days (conferences, content campaigns)
      if (rand() < burstiness * 0.15) {
        count += Math.floor(rand() * 12 + 5);
      }

      // LinkedIn-specific patterns: Tuesday-Thursday tend to be highest
      if (dow >= 2 && dow <= 4) {
        count = Math.ceil(count * (1 + rand() * 0.5));
      }
    }

    days.push({ date: dateStr, count: Math.min(count, 30) });
  }

  return days;
}

// Generate profile info
function generateProfile(username) {
  const rand = seededRng(username + "_profile");
  const titles = [
    "Software Engineer", "Product Manager", "Data Scientist",
    "UX Designer", "Marketing Director", "CTO",
    "Full Stack Developer", "Business Analyst", "VP Engineering",
    "DevOps Engineer", "AI Researcher", "Growth Lead",
  ];
  const companies = [
    "Tech Corp", "InnovateCo", "DataDriven Inc", "CloudFirst",
    "DigitalEdge", "NextGen Labs", "SmartSolutions", "FutureStack",
  ];

  return {
    name: username,
    title: titles[Math.floor(rand() * titles.length)],
    company: companies[Math.floor(rand() * companies.length)],
    connections: Math.floor(200 + rand() * 4800),
    followers: Math.floor(50 + rand() * 9950),
  };
}

export function useLinkedInData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (username) => {
    if (!username) return;
    setLoading(true);
    setError(null);

    try {
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));

      const rawDays = generateLinkedInActivity(username);
      const { cells, stats } = normaliseContributions(rawDays);
      const profile = generateProfile(username);

      setData({ cells, stats, profile, username });
    } catch (err) {
      setError(err.message || "Failed to generate activity data");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
}
