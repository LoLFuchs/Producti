export interface LofiTrack {
  id: string;
  title: string;
  url: string;
  artist?: string;
}

// Royalty-free lofi music tracks from reliable sources
export const lofiTracks: LofiTrack[] = [
  {
    id: "chill-study-beats",
    title: "Chill Study Beats",
    url: "/audio/lofi-beat-1.mp3", // Use the one that downloaded successfully
    artist: "Mixkit Music"
  },
  {
    id: "lofi-chill",
    title: "Lofi Chill",
    url: "/audio/lofi-beat-1.mp3", // Use the same file for backup tracks
    artist: "Mixkit Music"
  },
  {
    id: "coffee-chill",
    title: "Coffee Chill",
    url: "/audio/lofi-beat-1.mp3", // Use the same file for backup tracks
    artist: "Mixkit Music"
  },
  {
    id: "ambient-piano",
    title: "Ambient Piano",
    url: "/audio/lofi-beat-1.mp3", // Use the same file for backup tracks
    artist: "Mixkit Music"
  },
  {
    id: "peaceful-garden",
    title: "Peaceful Garden",
    url: "/audio/lofi-beat-1.mp3", // Use the same file for backup tracks
    artist: "Mixkit Music"
  }
];
